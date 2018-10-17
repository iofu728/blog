---
pageClass: custom-page-class
---

# Fetch

使用fetch代替原有的ajax实现Http请求

其实原生fetch很简单，
```jsx harmony
export default async function request (url, options) {
  try {
    const response = await fetch(url, options);
  } catch (error) {
    return error;
  }
}
````

options里面Headers头的配置


## 超时处理

通过Promise进行超时判断

```jsx harmony
const timeout = ms => promise =>
  new Promise(((resolve, reject) => {
    setTimeout(() => {reject(new Error('timeout'));}, ms);
    promise.then(resolve, reject);
  }));

export default async function request (url, options) {
  try {
    const response = await timeout(url.includes('upload') ? intervalTime * 300 :
      (url.includes('latest') ? intervalTime * 30 : intervalTime * 15))(fetch(url,
      { ...options, mode: 'cors', credentials: 'include' }));
  } catch (error) {
    if (!url.includes('time') && layout && !once && !errorMap[path]) {
          errorMap[path] = true;
          notification.open({
            message: <span>Api request connect timeout in {path}</span>,
            description: 'Some api can not connect, Please reload the page!!!',
            duration: 0
          });
        }
    return error;
  }
}
```

默认不显示 /api/system/time的超时报错，实现了即使有接口超时，仍能继续正常使用。

## 302跳转

因为fetch对HTTP Response为302的进行自动中断处理，故修改api状态码为
```java
    @Override
    public void redirect(HttpServletRequest request, HttpServletResponse response, String potentialRedirectUrl) throws IOException {
        if (isFetch(request)) {
            response.setHeader("Content-Type", MediaType.APPLICATION_JSON_UTF8_VALUE);
            String response302 = JSONObject.toJSONString(BaseResponse.newFailResponse().errorCode(30200).errorMsg(serverName).build());
            response.setStatus(HttpServletResponse.SC_OK); // 状态码改为200
            response.getWriter().write(response302);
            response.getWriter().flush();
        } else {
            response.sendRedirect(potentialRedirectUrl);
        }
    }

    // 重写判断规则，并对前端第一个请求Header头加上'application/json'
    private boolean isFetch(HttpServletRequest request) {
        return StringUtils.contains(request.getContentType(), "application/json");
    }
```

改造好之后，前端的处理就比较方便了

```jsx harmony
if (data.errorCode === 30200) {
      location.href = baseUrl;
      if (data.errorMsg && !once && !errorMap[path]) {
        errorMap[path] = true;
        notification.open({
          message: 'Api request error',
          description: data.errorMsg,
          duration: 0
        });
        once = 1;
      }
    }
```

上述函数带有一些let变量，是为了判断notification场景及次数。

## 全局errorMsg/ error 拦截

```jsx harmony
// errorMag
if (data.errorCode === 30200) {
    } else if (!url.includes('static')) {
      if (data.errorMsg) {
        if (!errorMap[path]) {
          errorMap[path] = true;
          notification.open({
            message: 'Api request error',
            description: data.errorMsg,
            duration: 0
          });
        }
      }
    }
// Error check
    const checkStatus = response => {
      const { status } = response;

      if (status >= 200 && status < 300) {
        return response;
      }

      const error = new Error(response.statusText);
      error.response = response;
      error.message = 1;
      return error;
    };
// Error
    const maybeError = checkStatus(response);
    if (maybeError.message && layout) {
      const { status } = maybeError.response;
      if (!errorMap[path]) {
        errorMap[path] = true;
        notification.open({
          message: <span>Api request error for <span className={globalStyles.red}>{status}</span> in {path}</span>,
          description: 'Some api can not auto connect, Please go to another page and reload!!!',
          duration: 0,
        });
      }
      return maybeError;
    }
```

## header

此处仅列举目前项目中用到的Header设置，更多请详见参考中的[官方文档](参考)

### get

```jsx harmony
export const fetchTime = () => request(`${timeApi}`);
// 对第一个请求，加上'content-type': 'application/json'
export const admin = () => request(`${isAdminApi}`, { headers: { 'content-type': 'application/json' } });
// 如果是Params,利用封装的函数
export const fetchFlowLinkList = filter => {
  const params = paramsGenerate(filter);
  return request(`${flowLinkApi}${params}`);
};
// 强制不使用缓存
export const fetchHashList = () => request(`${listApi}`, { headers: { 'Cache-Control': 'no-store' } });
```

### post
```jsx harmony
// 普通Body
export const createAndStart = requests =>
  request(`${taskApi}/create_and_start`, {
    method: 'POST',
    body: JSON.stringify(requests),
    headers: { 'content-type': 'application/json' },
  });

// urlencode / Form表单
export const uploadFile = (groupId, id, formData) =>
  request(`${groupApi}s/${groupId}/data/source/${id}/upload`, {
    method: 'POST',
    body: formData,
  });
```

### Delete

```jsx harmony
export const editFlowLink = (requests, id) =>
  request(`${flowLinkApi}/${id}?version=${requests.version}`, {
    method: 'DELETE',
    headers: { 'content-type': 'application/json' },
  });
```


## 参考
* [官方文档](https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API/Using_Fetch)



