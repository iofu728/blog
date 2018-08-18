# bug of react 16.4 componentDidUpdate

几个月前 react 升级到16.3之后

官方准备弃用 `componentWillReceiveProps`

跟它加上了`UNSAFE_` 标签

为了 一劳永逸

根据 [`官方文旦`](https://reactjs.org/docs/react-component.html)\`\`

```jsx
往 static getDerivedStateFromProps(props, state)和
componentDidUpdate(prevProps, prevState, snapshot) 迁移
```

一开始并没有 发现任何 异常

虽然在使用的过程中 出现了 些许bug

但潜意识也以为是自己写错了 在 另外一些地方 慌乱的修了 （嗯 表面 修了）

直到 今天 才发现

`componentDidUpdate` 传过来的 `prevProps` 比 `this.props` 还晚

我一度 怀疑 是不是 我对 生命周期 有什么 误解

did update 就是 已经 完成 update 的 时候 会 调用 这个 函数

不管怎么样 `prevProps` 传过来的 参数 肯定 要比 `this.props`快

但 实际上 `prevProps` 比 `this.props`慢  
而 `prevState` 比 `this.state`快

这 就 尴尬了 到底 哪个才是 next

蒙圈了

应该是 react 16.4引入的 bug

`updated 8/8/2018`

