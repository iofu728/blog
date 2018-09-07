---
pageClass: custom-page-class
---

# 路由

umi 根据 `pages` 目录自动生成路由配置。

而 umi 是 利用 react-router 4 实现路由

在 `dev` 模式 下 每次`build` 都会在`pages/.umi` 下

自动生成 路由文件 `DvaContainer.js` `router.js` `umi.js`


## 配置规则

`pages/` 目录下 所有 `.js` 文件 按照 `目录层级` 自动 生成 路由

例如
```
+ pages/
  + task/
    - $taskId.js  # 前置$ 表述 变量; 后置 $ 表示 可选
    - create.js
    - index.js   # index.js 与 page.js 解析为 根路由 文件
  + record/
    - page.js    # page.js 同级目录下 其他.js 自动 不被路由
```
则，umi 会自动生成路由配置如下：

```js
[
  { path: '/task': exact: true, component: './pages/task/index.js' },
  { path: '/task/:taskId': exact: true, component: './pages/task/$taskId.js' },
  { path: '/task/create': exact: true, component: './pages/task/create.js' },
  { path: '/record': exact: true, component: './pages/create/page.js' },
]
```

对于 `pages/` 目录下 部分 不想 被 路由的 `.js` 文件 如`/components` `/models` `/services`

可以在 `.umirc.js` 中 配置 进行忽略

```jsx
export default {
  plugins: [
    'umi-plugin-dva',
    ['umi-plugin-routes', {
      exclude: [
        /models/,
        /services/,
        /components/,
      ],
    }],
  ],
}

```

## DvaContainer.js

Dva 配置文件 `自动生成`

```jsx
import { Component } from 'react';
import dva from 'dva';
import createLoading from 'dva-loading';

// 创建dva 实例
const app = dva({
  history: window.g_history,
});
window.g_app = app;

// 装载 dva 插件
app.use(createLoading());

// 注册 dva modal 建立 namespace
app.model({ ...(require('../../models/dataSource.js').default) });
...
app.model({ ...(require('../../models/group.js').default) });

class DvaContainer extends Component {
  render() {
    // 配置 路由
    app.router(() => this.props.children);
    // 启动 应用
    return app.start()();
  }
}

export default DvaContainer;

```
## router.js

dva 路由文件 `自动生成`

```jsx
import React from 'react';
import { Router as DefaultRouter, Route, Switch } from 'react-router-dom';
import dynamic from 'umi/dynamic';
import renderRoutes from 'umi/_renderRoutes';
import { routerRedux } from 'dva/router';


let Router = DefaultRouter;
const { ConnectedRouter } = routerRedux;
Router = ConnectedRouter;


let routes = [
  {
    "path": "/",
    "component": require('../../layouts/index.js').default,
    "routes": [
      {
        "path": "/taskFlow/:taskFlowId",
        "exact": true,
        "component": require('../taskFlow/$taskFlowId.js').default
      },
      {
        "path": "/flow",
        "exact": true,
        "component": require('../flow/index.js').default
      },
      {
        "path": "/flow/integral",
        "exact": true,
        "component": require('../flow/integral.js').default
      },
      {
        "path": "/flow/link",
        "exact": true,
        "component": require('../flow/link.js').default
      },
      {
        "path": "/flow/daytime",
        "exact": true,
        "component": require('../flow/daytime.js').default
      },
      ...
      {
        "component": () => React.createElement(require('/Users/gunjianpan/Desktop/pdd/taishan/taishan-frontend/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', routes: '[{"path":"/","component":"./src/layouts/index.js","routes":[{"path":"/dataSource","exact":true,"component":"./src/pages/dataSource/page.js"},{"path":"/taskFlow/:taskFlowId","exact":true,"component":"./src/pages/taskFlow/$taskFlowId.js"},{"path":"/flow","exact":true,"component":"./src/pages/flow/index.js"},{"path":"/flow/integral","exact":true,"component":"./src/pages/flow/integral.js"},{"path":"/flow/components/flowLinkList","exact":true,"component":"./src/pages/flow/components/flowLinkList.js"},{"path":"/flow/components/flowLinkModal","exact":true,"component":"./src/pages/flow/components/flowLinkModal.js"},{"path":"/flow/components/flowList","exact":true,"component":"./src/pages/flow/components/flowList.js"},{"path":"/flow/components/flowDaytimeModal","exact":true,"component":"./src/pages/flow/components/flowDaytimeModal.js"},{"path":"/flow/components/linkNode","exact":true,"component":"./src/pages/flow/components/linkNodeModal.js"},{"path":"/flow/components/flowIntegralModal","exact":true,"component":"./src/pages/flow/components/flowIntegralModal.js"},{"path":"/flow/components/flowDaytime","exact":true,"component":"./src/pages/flow/components/flowDaytime.js"},{"path":"/flow/components/flowIntegral","exact":true,"component":"./src/pages/flow/components/flowIntegral.js"},{"path":"/flow/components/flowDataModal","exact":true,"component":"./src/pages/flow/components/flowDataModal.jsal.js"},{"path":"/flow/link","exact":true,"component":"./src/pages/flow/link.js"},{"path":"/flow/daytime","exact":true,"component":"./src/pages/flow/daytime.js"},{"path":"/group/components/groupRole","exact":true,"component":"./src/pages/group/components/groupRole.js"},{"path":"/flow/components/flowModal","exact":true,"component":"./src/pages/flow/components/flowModal.js"},{"path":"/group/components/userGroupModal","exact":true,"component":"./src/pages/group/components/userGroupModal.js"},{"path":"/group","exact":true,"component":"./src/pages/group/index.js"},{"path":"/group/:groupId","exact":true,"component":"./src/pages/group/$groupId.js"},{"path":"/task/components/createForm","exact":true,"component":"./src/pages/task/components/createForm.js"},{"path":"/task/components/taskFlowReport","exact":true,"component":"./src/pages/task/components/taskFlowReport.js"},{"path":"/task/components/taskInputModal","exact":true,"component":"./src/pages/task/components/taskInputModal.js"},{"path":"/task/components/taskList","exact":true,"component":"./src/pages/task/components/taskList.js"},{"path":"/task/components/taskReport","exact":true,"component":"./src/pages/task/components/taskReport.js"},{"path":"/task/create","exact":true,"component":"./src/pages/task/create.js"},{"path":"/task","exact":true,"component":"./src/pages/task/index.js"},{"path":"/task/:taskId","exact":true,"component":"./src/pages/task/$taskId.js"},{"path":"/group/components/groupList","exact":true,"component":"./src/pages/group/components/groupList.js"},{"path":"/","exact":true,"component":"./src/pages/index.js"},{"path":"/record","exact":true,"component":"./src/pages/record/page.js"},{"path":"/resource","exact":true,"component":"./src/pages/resource/page.js"},{"path":"/user","exact":true,"component":"./src/pages/user/page.js"},{"path":"/group/components/groupRoleModal","exact":true,"component":"./src/pages/group/components/groupRoleModal.js"}]}]' })
      }
    ]
  }
];


export default function() {
  return (
<Router history={window.g_history}>
  <Route render={({ location }) =>
    renderRoutes(routes, {}, { location })
  } />
</Router>
  );
}

```

## umi.js

umi Dev 依赖
```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import createHistory from 'umi/_createHistory';
import FastClick from 'umi-fastclick';


document.addEventListener(
  'DOMContentLoaded',
  () => {
    FastClick.attach(document.body);
  },
  false,
);

// create history
window.g_history = createHistory({
  basename: window.routerBase,
});


// render
function render() {
  const DvaContainer = require('./DvaContainer').default;
ReactDOM.render(React.createElement(
  DvaContainer,
  null,
  React.createElement(require('./router').default)
), document.getElementById('root'));
}
render();

// hot module replacement
if (module.hot) {
  module.hot.accept('./router', () => {
    render();
  });
}

require('/Users/gunjianpan/Desktop/pdd/taishan/taishan-frontend/src/global.css');
// Enable service worker
if (process.env.NODE_ENV === 'production') {
  require('./registerServiceWorker');
}

```

## 参考

* [https://reacttraining.com/react-router/](https://reacttraining.com/react-router/)
* [https://umijs.org/guide/router.html](https://umijs.org/guide/router.html)
