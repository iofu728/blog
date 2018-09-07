---
pageClass: custom-page-class
---

# 介绍

⛰TAISHAN-fe 是基于[Umi](https://umijs.org/)、[Dva](https://dvajs.com/)、[AntD](https://ant.design/docs/react/introduce-cn)的[React](https://reactjs.org/) 项目

适用于压力测试系统 `多用户` `权限化` `表单式` `实时` `数据可视化` 的需求

从业务层面 上 对标 阿里 [`PTS`](https://pts.aliyun.com/aliyun)

从技术侧面 上 借鉴 [`AntD Pro`](https://pro.ant.design/docs/getting-started-cn)

目录结构清晰 语法简洁 样式较同类更优

## 可能的技术栈/?债👇
* 函数式编程
* redux & redux-saga
* React fiber & component
* Promise & Generate & async
* flex
* fetch & http header

## 约定🤝

在TAISHAN-fe代码构建过程中，约定：

1. 所有放在`component/`的代码必须写成`Presentational Component`，
其他pages里面的`Modal` 为了提高复用性及引用便利性，参数过多/dispatch/使用回调函数的使用`Container Component`,其他使用`Presentational Component`；
2. 尽量使用 函数式编程
3. 尽量使用箭头函数 而不是function（）{}
4. 对于`Component` 尽量使用`function` 而不是 `class`
5. 尽量使用 `.filter` `.map` `.reduce` 而不是`for` `if-else`
6. 尽量使用`classname` 而不是 `style`
7. 尽量通过数据去驱动 而不是事件
8. 尽量使用`pure` `immutable` 而不是 改变原始值
9. 默认适配1680×1050 兼顾 Mac & Win


## 依赖组件
```jsx
    "@babel/core": "^7.0.0-0",          // 向前兼容ES语法
    "codemirror": "^5.39.0",            // 在线代码编辑 高亮 组件
    "dva": "^2.1.0",                    // redux 浅封装
    "dva-loading": "^2.0.2",            // dva 在异步 操作时 自动赋予 函数 Load 状态
    "eslint": "^4.19.1",                // 代码规范插件
    "eslint-config-umi": "^0.1.1",
    "eslint-plugin-babel": "^5.1.0",
    "eslint-plugin-flowtype": "^2.34.1",
    "eslint-plugin-import": "^2.6.0",
    "eslint-plugin-jsx-a11y": "^5.1.1",
    "eslint-plugin-react": "^7.1.0",
    "file-saver": "^1.3.8",             // 文件下载
    "husky": "^0.12.0",                 // git Hooks 用于 在git commit 进行 代码检测
    "highcharts": "^6.1.0",             // 数据可视化
    "keymaster": "^1.6.2",              // 键盘操控 监听
    "rc-tween-one": "1.x",              // svg 动画
    "ramda": "^0.25.0",                 // js函数库 函数式编程
    "react-codemirror2": "^5.0.4",      // codemirror react下封装
    "react-dnd": "^5.0.0",              // 拖拽组件
    "react-dnd-html5-backend": "^5.0.1",// 拖拽依赖
    "redux-mock-store": "^1.5.3",       // mock
    "umi": "^1.0.0-0",                  // webpack + 路由， 支持插件 马上要升2.0了
    "umi-plugin-dva": "^0.1.5",         // umi的dva插件 可定制文件不被注册成路由
    "umi-plugin-routes": "^0.1.5"       // umi 路由自定义规则
    "vuepress": "^0.14.2"               // 文档组件
```

