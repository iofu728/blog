---
title: 浅谈React组件间数据流方案🌊——『从Redux到Dva』
date: 2018-08-26 11:19:19
tags: [React, JavaScript]
description: dva
---

> Dva is a data processing plan for React.

Before `Dva`, there are some messy plans for React data processing like `React Component`, `Redux`, `Redux-Saga`.

ps: 以下图片copy from [`Dva` official documentation](https://dvajs.com/guide/fig-show.html#%E7%A4%BA%E4%BE%8B%E8%83%8C%E6%99%AF)

## 组件间继承

![图片.png | left | 747x518](https://cdn.yuque.com/yuque/0/2018/png/103904/1528436560812-2586a0b5-7a6a-4a07-895c-f822fa85d5de.png "")

参照 React 官方文档, 如果多个 Component 之间要发生交互, 那么状态(即: 数据)就保存在在这些 Component 的最小公约父节点上, 即 `<App/>`

`<TodoList/> <Todo/>` 以及`<AddTodoBtn/>` 本身不维持任何 state, 完全由父节点`<App/>` 传入 props 以决定其展现, 是一个纯函数的存在形式, 即: `Pure Component`

### 二: Redux 表示法

![图片.png | left | 747x558](https://cdn.yuque.com/yuque/0/2018/png/103904/1528436134375-4c15f63d-72f1-4c73-94a6-55b220d2547c.png "")

Redux 做了以下改进：

1. 将数据状态及页面逻辑从 `<App/>`里面抽取出来, 变成 store-数据, reducer-页面逻辑
2. `<TodoList/> ` 及`<AddTodoBtn/>`都是 Pure Component, 通过 connect 方法可以很方便地给它俩加一层 wrapper 从而建立起与 store 的联系: 可以通过 dispatch 向 store 注入 action, 促使 store 的状态进行变化, 同时又订阅了 store 的状态变化, 一旦状态有变, 被 connect 的组件也随之刷新
3. 使用 dispatch 往 store 发送 action 的这个过程是可以被拦截的, 自然而然地就可以在这里增加各种 Middleware, 实现各种自定义功能, eg: logging

这样一来, 各个部分各司其职, 耦合度更低, 复用度更高, 扩展性更好

### 三: 加入 Saga

![图片.png | left | 747x504](https://cdn.yuque.com/yuque/0/2018/png/103904/1528436167824-7fa834ea-aa6c-4f9f-bab5-b8c5312bcf7e.png "")

`redux-saga` 是一种 通过拦截action，实现异步操作的Middleware

1. saga 拦截某个 异步action A, 将action改为 A_REQUEST，并发起 http 请求；
2. 如果请求成功, 则继续向 reducer 发一个 type == A_SUCCESS 的 action, 提示创建成功, 反之则发送 type == A_FAILURE 的 action
3. saga 针对异步 请求 自身特点 给出了 一些 异步处理的API， 如`take`， `call`， `put`，`all`；还有一些高阶API， 如`takeLeast`， `takeLeading`，`throttle`。这些API 对于处理异步数据流 是十分方便的。

### 四: Dva 表示法

![图片.png | left | 747x490](https://cdn.yuque.com/yuque/0/2018/png/103904/1528436195004-cd3800f2-f13d-40ba-bb1f-4efba99cfe0d.png "")

Dva 就做了一件事： 把redux 和 redux-saga 封装在一起， 简化了原本较为繁冗的代码

1. 把 store 及 saga 统一为一个 model 的概念, 写在一个 js 文件里面
2. 增加了一个 Subscriptions, 用于收集其他来源的 action, eg: 键盘操作，进入页面（可代替react的 `componentDidMount`）
3. model 写法很简约

## Models

### State

`type State = any`

State 表示 存在`Store`中的数据，通常表现为一个 `javascript` 对象；️️操作的时候每次都要当作不可变数据（immutable data）来对待，特别是js中的原生Map，保证每次都是全新对象，没有引用关系，这样才能保证 State 的独立性，便于测试和追踪变化。

可通过 dva 的实例属性 `_store` 看到顶部的 state 数据，但是通常你很少会用到:

```jsx
const app = dva();
console.log(app._store); // 顶部的 state 数据
```

### Action

`type Action = any`

Action 是一个普通 `javascript` 对象，它是改变 `State` 的唯一途径。无论是从 UI 事件、网络回调，还是 WebSocket 等数据源所获得的数据，最终都会通过 dispatch/put 函数调用一个 action，从而改变对应的数据。

action 必须带有 `type` 属性指明具体的行为，其它字段可以自定义，如果要发起一个 action 需要使用 `dispatch` 函数；需要注意的是 `dispatch` 是在组件 connect Models以后，通过 props 传入的。

在Dva中，action可以作用于 `effect` 和 `reducer`
```jsx
dispatch({
  type: 'fetchTaskList',
  filter: {
    offset: 0,
    limit: 20,
  }
});
```

### dispatch 函数

`type dispatch = (a: Action) => Action`

dispatch function 是一个用于触发 action 的函数，action 是改变 State 的唯一途径，但是它只描述了一个行为，而 dipatch 可以看作是触发这个行为的方式，而 Reducer 则是描述如何改变数据的。

在 dva 中，connect Model 的组件通过 props 可以访问到 dispatch，可以调用 Model 中的 Reducer 或者 Effects，常见的形式如：

```javascript
dispatch({
  type: 'user/add', // 如果在 model 外调用，需要添加 namespace
  xxx: {}, // 需要传递的信息
});
```

### Reducer

`type Reducer<S, A> = (state: S, action: A) => S`

Reducer（也称为 reducing function）函数接受两个参数：之前已经累积运算的结果和当前要被累积的值，返回的是一个新的累积结果。该函数把一个集合归并成一个单值。

Reducer 的概念来自于是函数式编程，很多语言中都有 reduce API。如在 javascript 中：

```javascript
[1, 2, 3].reduce((prev, next) => prev + next);
//expect return 6
```
在 dva 中，reducers 做的就是 拿到新旧数据，并返回将要更新的结果。

一般，reducer只用来做数据更新的工作，不做任何其他作用。（数据比较这些都放在effec中进行，reducer不放任何和业务逻辑有关的东西，相当于redux中同步调用）

### **Effect**🎈

#### 很重要的函数

Effect 可以被翻译成副作用，最常见的用处就是实现异步操作。它来自于函数编程的概念，之所以叫副作用是因为它使得我们的函数变得不纯，同样的输入不一定获得同样的输出。

dva 为了控制副作用的操作，底层引入了[redux-sagas](http://superraytin.github.io/redux-saga-in-chinese)做异步流程控制。采用了[generator的相关概念](http://www.ruanyifeng.com/blog/2015/04/generator.html)，所以将异步转成同步写法，从而将effects转为纯函数。通过yield实现异步等待，从而完成异步的功能。

在我看来， reducer是一个重要的部分，有关数据的业务逻辑一般放在这里，使得数据在进入DOM之后不会有过多的处理工作，尽量把React写成`Pure PureComponent`。

像Taishan中数据处理最复杂的Task模块，所有处理工作都放在`/models/task.js`的effect中，复杂的函数长达数百行。

#### saga 低阶Api

```jsx
* fetchTaskDetail ({ taskId }, { call, put, select, all }) {
  const { layout: { intervals }, task: { report: { taskDetail: taskDetailAgo, taskInfo } } } = yield select(state => state);
  if (!intervals) {return;}
  const { data: taskDetail } = yield call(taskServices.fetchTaskDetail, taskId);
  if (!taskDetail) {return;}
  if (!compareObject(taskDetail)(taskDetailAgo)) {
    yield put({ type: 'saveTaskDetail', taskDetail });
    if (Object.keys(taskInfo).length) {yield put({ type: 'prepareTaskReport' });}
    }
},
```
当action 中的 type 匹配到'fetchTaskDetail', 则会调用上述Generate *函数。

该函数有两个参数，第一个参数是dispatch传进来的Object，在这里你可以获取需要的参数值；第二个参数是redux-saga Api名称，仅支持低阶APi（高阶利用另外方法掉用）。

可以看到该函数用到了四个saga的`APi`，`call``put``select``all`
分别实现

`select`-从store获取state值,
`call`  -调用services里面的request，并传入参数，
`put`   -相当于model外的dispatch，发送action请求，在这里主要用于调用下游函数/存储函数reducer
`all`   -使得all数组中的请求 同步进行 减小异步等待 造成的时间损耗，
还可能使用
`take`  -等待函数，用于实现进度同步,

该函数做了以下几件事：
1. select出intervals，如果intervals为false，函数终止，顺便select出store中存储的旧的数据；
2. 调用services请求，并堵塞直到收到Http Response；
3. 如果超时 或者 报错，则拿到的result为空，此时，不存入store，函数终止；
4. 比较拿到的result值，如果更新了就调用reducer；
5. 如果taskInfo不为空则，运行prepare函数，prepare函数是位于effect中的数据处理函数；

#### Saga 高阶Api

```jsx
    fetchTaskFlowDetail: [
      function * fetchTaskFlowDetailFunc ({ taskFlowId }, { call, put, select, all }) {
        const { task: { taskFlow: { taskFlowDetail: taskFlowDetailAgo, taskFlowAllReport } }, layout: { intervals } } = yield select(state => state);
        if (!intervals && Object.keys(taskFlowDetailAgo).length) {return;}
        const { data: taskFlowDetail } = yield call(taskServices.fetchTaskFlowDetail, taskFlowId);
        if (!taskFlowDetail) {return;}
        const { status } = taskFlowDetail;
        taskFlowDetail.completed = status && (status === '200700' || status === '200800');
        if (!compareObject(taskFlowDetail)(taskFlowDetailAgo)) {
          yield put({ type: 'saveTaskFlowDetail', taskFlowDetail });
          yield all([put({ type: 'prepareTaskFlowDetail' }), !taskFlowDetail.completed && put({ type: 'prepareTaskFlowRealMetric' })]);
        }
        yield all([
          Boolean(taskFlowDetail.completed && !Object.keys(taskFlowAllReport).length && !allReport) && put({ type: 'fetchTaskFlowAllReport', taskFlowId }),
          !Object.keys(taskFlowDetailAgo).length && put({ type: 'prepareTaskFlowList' }),
        ]);
      }, { type: 'takeLatest' },
    ],
```

和上面的effect 略有不同，当使用高阶APi时候，是在数组的第二项中调用。然后把原来的函数放在数组的第一项。
目前dva 资瓷 `takeEvery`,`takeLeast`,`throttle` 详见->[dva源码](https://github.com/dvajs/dva/blob/master/packages/dva-core/src/getSaga.js)

其实 特别 期待 支持 `takeLeading`的 虽然 可以通过低阶Api 组合使用 但 目前 测试take 未起作用。// todo

### Subscription

Subscriptions 是一种从 __源__ 获取数据的方法，它来自于 elm。

Subscription 语义是订阅，用于订阅一个外部事件，然后根据条件 dispatch 需要的 action。外部可以是当前的时间、服务器的 websocket 连接、keyboard 输入、history 路由变化等等。

目前TAISHAN项目中 主要利用其 代替React的`componentDidMount`，监听路由变化，从而开始/结束调用异步请求。

此外还利用进行些许键盘快捷键定制。
```jsx
  subscriptions: {
    setup ({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        nowPath = pathname === '/' ? '/task' : pathname;
        if (baseUrl.includes('com') && !importScriptTime) {
          dispatch({ type: 'fetchHashList' });
        } else {
          const script = document.createElement('script');
          script.type = 'application/javascript';
          script.async = true;
          script.src = 'https://cavalry.corp.yiran.com/sdk/js/v1.js';
          document.body.appendChild(script);
        }
        if (timeInterval) {return;}
        dispatch({ type: 'fetchUser' });
        dispatch({ type: 'fetchTime' });
        dispatch({ type: 'group/fetchGroupList' });
        dispatch({ type: 'flow/fetchDefaultScript' });
        timeInterval = setInterval(() => {dispatch({ type: 'fetchTime' });}, intervalTime * 5);
        setInterval(() => {dispatch({ type: 'timeAdd' });}, intervalTime);
      });
    },
  }
```

## 取数据 mapStateToProps

和redux一致 利用connect把数据和component绑定在一起

利用mapStateToProps, 把redux state中的数据放到props中

此后 每次该component绑定的数据发生变更，该方法将会被再次调用

随之 一系列生命周期 会被依次调用

```jsx
function mapStateToProps (state) {
  const { loading: { effects }, layout: { isAdmin, user: { userList, grantList } }, routing: { location: { pathname } } } = state;
  const path = pathname.split('/');
  return {
    isAdmin, userList, grantList,
    grantLoad: effects['layout/fetchGrantList'],
    groupId: path[2],
  };
}
```
## Router

该部分由umi自动生成

```jsx
import { Router, Route } from 'dva/router';
app.router(({history}) =>
  <Router history={history}>
    <Route path="/" component={HomePage} />
  </Router>
);
```

## 数据流向

数据的改变发生通常是通过用户交互行为或者浏览器行为（如路由跳转等）触发的，当此类行为会改变数据的时候可以通过 `dispatch` 发起一个 action，如果是同步行为会直接通过 `Reducers` 改变 `State` ，如果是异步行为（副作用）会先触发 `Effects` 然后流向 `Reducers` 最终改变 `State`，所以在 dva 中，数据流向非常清晰简明，并且思路基本跟开源社区保持一致（也是来自于开源社区）。

<img src="https://zos.alipayobjects.com/rmsportal/PPrerEAKbIoDZYr.png" width="807" />


## 与umi结合使用

* **按目录约定注册 model**，无需手动 `app.model`
* **文件名即 namespace**，可以省去 model 导出的 `namespace` key
* **无需手写 router.js**，交给 umi 处理，支持 model 和 component 的按需加载
* **内置 query-string 处理**，无需再手动解码和编码
* **内置 dva-loading 和 dva-immer**，其中 dva-immer 需通过配置开启
* **开箱即用**，无需安装额外依赖，比如 dva、dva-loading、dva-immer、path-to-regexp、object-assign、react、react-dom 等

## 参考

* [使用 umi 改进 dva 项目开发](https://github.com/sorrycc/blog/issues/66)
* [umi + dva，完成用户管理的 CURD 应用](https://github.com/sorrycc/blog/issues/62)
* [dva文档](https://dvajs.com/guide/concepts.html)
