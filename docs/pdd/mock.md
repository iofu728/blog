
# Mock 数据

利用`umi`实现数据Mock。

`umi` 约定 `mock` 目录下的 `*.js` 会被用来生成模拟API数据。

## Mock 配置

Mock 文件配置参考如下pattern:

```
[HTTP-Method API-Path]: <Static Data Object> | <Dynamic Data Provider>
```

**具体示例**

假设 `mock` 目录结构如下：

```
+ mock/
  - users.js
  - cities.js
```

## 静态数据模拟

然后在 `users.js` 里做如下配置

```js
export default {
  'get /users': {
    result: [
      {
        id: 1,
        name: 'zhangsan',
        alias: '张三',
        email: 'zhangsan@qq.com',
      }
    ]
  }
}
```

`dev`启动后，可以通过`/users`直接在代码请求该API。

## 动态数据模拟配置


然后在 `cities.js` 里做如下配置

```js
export default {
  'get /cities': function (req, res, next) {
    setTimeout(() => {
      res.json({
        result: [
          {
            id: 1,
            name: 'beijing',
            alias: '北京'
          }
        ]
      })
    }, 1500)
  }
}
```

`dev`启动后，可以通过`/cities`直接在代码请求该API，`1.5s`后得到了返回数据。

