---
pageClass: custom-page-class
---
# Take about Redux Ⅱ

毕设 跑程序一次要跑1h+ 很是无聊
想来 还是写点博客 嗯 在服务器到期前 hhh 好像没几天了
![](http://wyydsb.xin/wp-content/uploads/2018/05/5.5I.png)

额 PC还“绿”屏了 命途多舛呀

——————————————————————————————
还记得上次的博文 有这么一句断论

> State是事件驱动的，而Redux是数据驱动

这句话貌似很有道理 但仔细一想 好像又不是那么回事
说`redux`是数据驱动

但执行`this.props.xxxxxx(request)`之前的 还是`onClick`，`onCellClick`这些事件

你这些利用`mapDispatchToProps`转换为`props`的函数 照样是事件驱动的

如果你怎么看 确实没错 `State`和`redux`都是事件驱动的

——————————————————————————————

但`redux`没有那么简单 这些都只是`State`的特性 `redux`’保留了而已

毕竟在`react`生态下 实用的 事件触发是理所应当

记得说过`redux` 和 `state`都有一个特性

> 当state或者props里面存放的数据发生改变的时候 render会重新渲染一次

这句话 也可以看成是数据驱动的一个特性
数据变了 组件会更新

————
但其实这是`redux` 和 `state` 共同的特点
`redux` 还有自己的特点

```jsx
componentWillReceiveProps(nextProps)
```

在生命周期的讲解中 我们知道这个函数是`props`的一个属性函数
当`props`更新的时候 就会调用一次这个函数

因为`redux`利用`withRouter`把`redux`的`action`及参数值 存储为`props`
当参数值发生改变时，`props`发生改变，就会调用`componentWillReceiveProps`

这个时候如果利用`compare`函数 对传过来的参数进行比较
如果数据改变了 则更新 渲染; 若没改变 不更新 也就不用重新渲染

这样看 渲染 的过程 是 数据驱动的 而不是 发出的 事件驱动的

举个栗子：

做一个实时获取数据的报表页
假如说页面1s调用 一次http请求

调用请求 这个 步骤 我们规避不了

但我们可以利用`redux` 规避掉不需要的 渲染 过程

```jsx
  componentWillReceiveProps(nextProps) {
    const {
      filter: nextFilter,
    } = nextProps;

    const {
      filter,
    } = this.props;

    if (!compareObject(nextFilter, filter)) {
      this.refreshContainer(nextFilter);
    }
  }
```

```jsx
export const compareObject = (obj1, obj2) => {
  if (!(obj1 instanceof Object) || !(obj2 instanceof Object)) {
    return false;
  }
  const obj1Keys = Object.keys(obj1);
  const obj2Keys = Object.keys(obj2);
  if (!compareArray(obj1Keys, obj2Keys)) {
    return false;
  }
  for (let i = 0; i < obj1Keys.length; ++i) {
    const key = obj1Keys[i];
    const value1 = obj1[key];
    const value2 = obj2[key];
    if (typeof value1 !== typeof value2) {
      return false;
    }
    if (value1 instanceof Array) {
      if (!compareArray(value1, value2)) {
        return false;
      }
    }
    if (value1 instanceof Object) {
      if (!compareObject(value1, value2)) {
        return false;
      }
    }
    if (value1 !== value2) {
      return false;
    }
  }
  return true;
};
```

另外 `redux-saga`中间件 还可以规避掉 堆积的 http请求

还是上面那个例子

如果同时有1w个浏览器 打开 刚才那个实时报表页
在1s中 有1w个http请求 访问到后台

如果后台是每个请求都单独回复的模式
就会出现一系列`pending`情况

势必造成 1s结束的时候 下一个 http到来的时候 上一个http请求还没有 处理完
如此一来 一大堆 http请求 堆积在那里 造成服务器 堵塞
如果时延足够大的话 ajax会判断为请求超时

在实际操作过程中 我们就遇到这种情况 造成线上一大片告警
还好是在测试环节出现这个问题

实际上这个问题 真正解决途径 应该是后台返回值的时候 不重新抓取数据 1s-2s这个过程所有收到的http请求 都返回1s时的数据
减少后台处理量

前端解决方式 之一 就是利用 `saga`的 `takeLeading`
当有http还未完成请求时 上一个调用取消 下一个请求顶上

```jsx
export default function* agentSaga() {
  yield takeLatest(types.FETCH_AGENT_INFO_REQUEST, fetchAgentInfoTask);
  yield takeLatest(types.FETCH_FLOW_AGENT_REQUEST, fetchFlowAgentTask);
}
```

当然也可以使用另外一种模式
有http请求未完成时，上一个调用继续 下一个取消
这个可以用`LoadStatus`的状态来判断

```javascript
if (LoadStatus === LoadStatus.Loading) {
终止；
}
```

```javascript
  fetch() {
    if (this.props.groupLoad !== LoadStatus.LOADING) {
      this.props.fetchGroupCreate();
    }
  }
```

—-
离毕业还有57天
离答辩还有30天

嗝屁 滚蛋

`updated 5/5/2018`

