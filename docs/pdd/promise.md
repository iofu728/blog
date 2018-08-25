
# 函数式编程

关于什么是函数式编程 每个人都有自己的看法

但总结起来 不外乎几点

1. 以函数为主要载体的编程方式；
2. 使用`pure`，`immutable`的函数，代替改变原有状态的函数，减少作用域及副作用；
3. 将处理过程拆解成可复用的函数，利用`filter` `map` `reduce`减少中间变量和操作，语义更加清晰；
4. 使用链式，使得处理过程清晰，可读；
5. 使用`curry`化，把函数入参细分，去除不需要的参数；

在我看来 js的函数式编程 = `lambda` + `promise` + 箭头函数 + `curry` + ...

## lambda - radma

虽然，相较于java的`lambda`，js的函数编程更鲜为人知。

但从语法上来说，js比java跟适合进行函数式操作。

js原生支持`.map` `.filter` `reduce`

其中 特别不推荐使用原生的`reduce` 其他两个很好用

相对命令式，声明式的语法更简洁

```jsx
// 命令式
export function mapToList (map) {
  const list = [];
  Object.keys(map).forEach((order) => {list.push(map[order]);});
  return list;
}
// 声明式
export const mapToList = maps => Object.keys(maps).map(value => maps[value]);
```

两者之间的差距是显而易见的

尽量使用箭头函数 和 声明式 写法，对于减少代码量，是卓有成效的。

原则上讲所有for循环，if-else，switch都可以用radma实现。

举几个栗子

### .reduce 🎁

#### 返回字符串
```jsx
// 命令式
export function paramsGenerate (values) {
  let params = '?';

  Object.keys(values).forEach((r, m) => {
    if (values[r] !== null) {
      if (m) {params += '&';}
      params += `${r}=${values[r]}`;
    }
  });

  return params;
}
// 声明式
export const paramsGenerate = values => R.reduce((acc, item) => `${acc}${!acc ? '?' : '&'}${item}=${values[item]}`, '', Object.keys(values).filter(r => values[r] !== null));
```

可以看到 声明式 写法，把上述一坨代码，变成一行来实现。
这里使用了radma函数库，之所以不使用原生的`reduce`，是因为原生的`reduce`及其难用.

首先`[].reduce()`会报错

其次
```jsx
// expect return 1, but return { id: 1 }
[{ id: 1 }].reduce((acc, item) => acc + item.id); 
```

于是上面的`paramsGenerate`函数我们需要三次特殊处理，这还有什么便捷性可言。。。
```jsx
export const paramsGenerate = values => Object.keys(values).filter(r => values[r] !== null)
  .reduce((r, m, k) => `${k === 1 ? `?${r}=${values[r]}` : `${r}`}&${m}=${values[m]}`);
```

#### 返回Num

事实上，reduce最开始就是用来计算数组的和，这点对reduce而言，就是常规操作。
比如说
```jsx
const totalAll = R.reduce((acc, item) => acc + item.qps, 0, newData);
```

#### 返回Object
这点我觉得可以算是一个亮点，对于懒癌晚期来说，可以说是福音了。

```jsx
export const listToMap = list => R.reduce((acc, item) => Object.assign(acc, { [item.id]: item }), {}, list);
```

### .filter
.filter 主要替代for + if的操作，这个也是常规操作。

```jsx
const tableId = baseDataColumns.filter(item => Number.parseInt(value, 10) === item.colId)[0].tableId;
``` 
### .map
.map 说起来，是一种特殊的.reduce，特殊在其返回的是Array

```jsx
//半命令式
 const tableAll = [];
 Object.keys(flowMap).forEach((r) => {if (!flowSource) {temp.tableAll.push(flowMap[r].id);}});
//声明式
const tableAll = R.map(r => flowMap[r].id, Object.keys(flowMap).filter(_ => !flowSource));
```

这里为什么不用原生的.map，完全是强迫症使然。原生的map在这里因为前面进行了.filter处理，eslint会强剖你分成两行。

为了让它变成一行，我就用了radma的.map

其实radma还有很多很多有趣的语法，这里仅介绍了冰山一角。

### .cond

替代swicth

```jsx harmony
export const getStatusText = R.cond([
  [R.equals('200000'), R.always('新建')],
  [R.equals('200100'), R.always('待压测')],
  ...
  [R.T, R.always('错误')],
]);
```

## curry
何为curry：给定一个函数的部分参数，生成一个接受其他参数的新函数
```jsx
// 接收一个函数，并返回一个只接受一个参数的函数。
function curry(fun) { // 柯里化一个参数，虽然似乎没什么用
  return function(arg) {
    return fun(arg);
  };
}

function curry2(fun) { // 柯里化两个参数
  return function(secondArg) {
    return function(firstArg) {
        return fun(firstArg, secondArg);
    };
  };
}
function curry3(fun) { // 柯里化三个参数
  return function(last) {
    return function(middle) {
      return function(first) {
        return fun(first, middle, last);
      };
    };
  };
}
```
curry化不管怎么样，在工程上可以让你方便的知道每个参数在函数里到底起到作用了没。

## promise
promise 经常用于处理回调

```jsx
    this.props.dispatch({ type: 'flow/fetchFlowAll', groupId })
      .then(() => this.goToFlow(groupId)(flowName));
```

dva支持的这个dispatch 之后.then的语法实际上用的是promise实现的。[](https://github.com/dvajs/dva/blob/master/packages/dva-core/src/createPromiseMiddleware.js)

```jsx
// dva 源码
import { NAMESPACE_SEP } from './constants';

export default function createPromiseMiddleware(app) {
  return () => next => action => {
    const { type } = action;
    if (isEffect(type)) {
      return new Promise((resolve, reject) => {
        next({
          __dva_resolve: resolve,
          __dva_reject: reject,
          ...action,
        });
      });
    } else {
      return next(action);
    }
  };

  function isEffect(type) {
    if (!type || typeof type !== 'string') return false;
    const [namespace] = type.split(NAMESPACE_SEP);
    const model = app._models.filter(m => m.namespace === namespace)[0];
    if (model) {
      if (model.effects && model.effects[type]) {
        return true;
      }
    }

    return false;
  }
}
```

在TAISHAN项目中，request封装判断超时的时候也用到了promise

```jsx harmony
const timeout = ms => promise =>
  new Promise(((resolve, reject) => {
    setTimeout(() => {reject(new Error('timeout'));}, ms);
    promise.then(resolve, reject);
  }));
```

## 箭头函数

这个很简单，只是ES6的语法特性

```jsx harmony
function1 (params1) {
  ...
}
// 等价于

function1 = params1 => {
  ...
};

// 如果 函数中只有return 还可以简化为
function1 = params1 => ...;

```

## 组件设计

React 应用是由一个个独立的 Component 组成的，我们在拆分 Component 的过程中要尽量让每个 Component 专注做自己的事。

一般来说，Component组件有两种设计：

1. Container Component
2. Presentational Component

### Container Component
Container Component 一般指的是具有`监听数据行为`的组件，一般来说它们的职责是`绑定相关联的 model 数据`，以数据容器的角色包含其它子组件，通常在项目中表现出来的类型为：Layouts、Router Components 以及普通 Containers 组件。

通常的书写形式为：

```javascript
import React, { Component, PropTypes } from 'react';

// dva 的 connect 方法可以将组件和数据关联在一起
import { connect } from 'dva';

// 组件本身
const MyComponent = (props)=>{};
MyComponent.propTypes = {};

// 监听属性，建立组件和数据的映射关系
function mapStateToProps(state) {
  return {...state.data};
}

// 关联 model
export default connect(mapStateToProps)(MyComponent);
```

### Presentational Component
Presentational Component 的名称已经说明了它的职责，展示形组件，一般也称作：Dumb Component，它不会关联订阅 model 上的数据，而所需数据的传递则是通过 props 传递到组件内部。

通常的书写形式：

```javascript
import React, { Component, PropTypes } from 'react';

// 组件本身
// 所需要的数据通过 Container Component 通过 props 传递下来
const MyComponent = (props)=>{}
MyComponent.propTypes = {};

// 并不会监听数据
export default MyComponent;
```

### 对比
对组件分类，主要有两个好处：

1. 让项目的数据处理更加集中；
2. 让组件高内聚低耦合，更加聚焦；

试想如果每个组件都去订阅数据 model，那么一方面组件本身跟 model 耦合太多，另一方面代码过于零散，到处都在操作数据，会带来后期维护的烦恼。

除了写法上订阅数据的区别以外，在设计思路上两个组件也有很大不同。
`Presentational Component`是独立的纯粹的，这方面很好的例子，可以参考 [ant.design UI组件的React实现](http://ant.design/docs/react/introduce) ，每个组件跟业务数据并没有耦合关系，只是完成自己独立的任务，需要的数据通过 `props` 传递进来，需要操作的行为通过接口暴露出去。
而 `Container Component` 更像是状态管理器，它表现为一个容器，订阅子组件需要的数据，组织子组件的交互逻辑和展示。

### 对`Modal`的Component不使用`Presentational`的解释
1. 项目里面几乎所有的数据都存在Store,如果使用`Presentational`会造成，从父组件传递给子组件的参数过多，且对于复用组件而言，参数需要从所有引用处传递，使得代码显得冗余，繁冗，与redux初衷不符，这样额写法更像react最原始的架构；
2. 如果使用`Presentational`，必须保证不能使用connect，对于调用dispatch函数，都得在父组件处声明，使得回调函数不易实现；

更多的相关内容，可以看看Redux作者 Dan Abramov 的看法：
- [https://github.com/reactjs/redux/issues/756#issuecomment-141683834](https://github.com/reactjs/redux/issues/756#issuecomment-141683834)
- [https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0#.231v4pdgr](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0#.231v4pdgr)

## 参考

* [JS 函数式编程指南](https://llh911001.gitbooks.io/mostly-adequate-guide-chinese/content/)
* [ramda](https://ramdajs.com/)🍎
* [淘宝前端FED](http://taobaofed.org/blog/2017/03/16/javascript-functional-programing/)
