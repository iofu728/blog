---
title: 浅谈JavaScript中的Functional programming
date: 2019-02-28 14:32:48
tags: [JavaScript]
description: Functional programming
---

函数式编程不是一个新概念, 也不只是独属于`JavaScript`

相反, 我们可以在几乎所有主流高级编程语言中或多或少看到`它`的影子

因为最早接触到函数式编程来自于Java, JavaScript的实践，所以这篇文章从JavaScript讲起

## What means `Functional Programming`?

> In computer science, `functional programming` is a programming paradigm—a style of building the structure and elements of computer programs—that treats computation as the evaluation of mathematical functions and avoids changing-state and mutable data.

这是Wikipedia上关于函数式编程的一段描述

顾名思义，函数式编程是一种建立在以`函数`为核心基础上的一种编程思想

就跟面向对象编程OOP强调处处是对象，面向切片编程AOP强调用切片解决问题一样

我的理解`Function`在这里的意思是即来即走，互不干扰，互不影响，通过两个花括号`{}`把语句执行的作用于限定在很小的一段空间

然后我觉得函数式编程还带有强烈的`Immutable`思想

Immutable其实起源于JavaScript中对Object的一种render策略的优化

但其特性和函数式编程十分吻合，即数据一旦进行初始化，其值就不能再发生改变

此外，互不干扰意味着Function的ouput仅由input决定，即Pure Function

虽然 函数式编程在使用过程中看起来在堆砌`语法糖`，但条带式语句能更好的表达程序语义，减少无效的中间变量

总结一下:

> 函数式编程是一种
> 1. 以函数为主要载体的编程风格;
> 2. 强调`immutable`, 减少对已初始化变量的修改;
> 3. 推崇`Pure Function`, 强调输入与输出的一致性;
> 4. 使用一些语法糖，拆解计算过程, 减少中间变量;
> 5. Curry 化细分入参;

## For JavaScript

已经很久没写js了，凭借以前写的document 尽量去回想js中一些Functional Programming的影子

## `curry`

> 再回来理一遍Curry 发现自己之前对Curry的理解比较浅薄

感觉 Curry是一种元编程的思想 即把函数作为参数 传入另外一个函数

当一个函数 因为几次复用重写 导致函数体量激增的时候

1. 举个例子 我们来实现一个拼接字符数组的函数

```js
export function joinArray = arrys => arrys.reduce((a, b) => a.concat(b));

joinArray(['1', '2', '3'])    // => '123'
```

额 pt写多的我 其实第一个想到的其实是
```python
print("".join(arrys)) // wu wu wu, 阶级差距
```

所以 其实 js可以这么写
```js
console.log(arrys.join());
```

但 都这么写我的故事 就没法讲下了🙉


2. 如果我们在前面一个需求的基础上 要求 把数组中的每一个值 +1s

当然 这时候join一点用也没有了，那么 就把上面的joinArray改成下面的函数

```js
export function concatArray = arrys => addNum =>
       arrys.map(a => (+a)+ addNum + '')
            .reduce((a, b) => a.concat(b));

concatArray(['1', '2', '3'], 1)    // => '234'
```

3. 如果这个时候 我们有想在前面的基础上 再实现 把数组中的每个值都✖️2

要求 复用上面的代码

一种思路 加个参数 type 来判断是乘还是加
```js
export function concatArray = arrys => countNum => type =>
       arrys.map(a => type ? (+a)+ countNum + '' : +a * countNum + '')
            .reduce((a, b) => a.concat(b));

concatArray(['1', '2', '3'], 2, 0)    // => '246'
```

你就会发现 这样写下去 代码会变得奇丑无比

如果 还需要实现 除法 减法的时候 不敢想象🐽

so 需要引入curry的思想, 把函数作为参数传入参数

**正解**

```js
const multiple = originNum => multiNum => +originNum * multiNum + ''

const plus = originNum => addNum => (+originNum) + plusNum + ''

export function concatArray = arrys => stylishChar =>
       arrays.map(stylishChar)
             .reduce((a, b) => a.concat(b));

concatArray(['1', '2', '3'], multiple(2))    // => '246'
concatArray(['1', '2', '3'], plus(1))        // => '234'
```

总的来说 curry实现的是 一种基础函数层面上的封装

以期通过把函数作为参数 使得代码能够达到较好的复用性能

### Immutable.js

首先 我觉得 最能反映函数式编程思想的 肯定是facebook 开发的这套源于解决js中Object变量管理的问题

说到Immutable.js就不得不提浅copy，深copy，浅比较，深比较这两对概念

在js 中`const a = {b: 1};` 其中 a存储的是`Object {b: 1}`的内存地址

如果 我做一个赋值Object a的操作，例如 `a.b = 2;` 实际上a -> 指向的内存地址并不会发生变化

如果这个时候 render的判断依据是浅比较，即直接对比变量对应的内存地址，那么就会发现，内存地址并未发生变化，于是也就不会进行渲染

具体可以参考 很久很久以前 写的一篇老文中关于生命周期函数`shouldComponentUpdate`中`shallowEqual`机制的源码分析[immutable.js](https://wyydsb.xin/javaScript/immutable.html)

### `radma`

提到lambda大家一定不陌生

在JavaScript中有一个类似于lambda的库 叫做 radma

总的来说 还是一些语法糖 用的好 确实 令人眼前一亮

然后 虽然 js原生支持`.map` `.filter` `reduce`

但用下来 其实原生的`reduce` 比较难用

相对命令式，声明式的语法更简洁

下面举一些用radma写的一些🌰：

1. `mapToList`

```js
// 命令式
export function mapToList (maps) {
  const list = [];
  Object.keys(maps).forEach((order) => {list.push(maps[order]);});
  return list;
}

// 声明式
export const mapToList = maps => Object.keys(maps).map(value => maps[value]);
```

可以看出用了radma之后整体整洁程度提升比较明显 可以说是卓有成效的

原则上讲所有for循环，if-else，switch都可以用radma实现

2. `paramsGenerate`

```js
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
export const paramsGenerate = values =>
      R.reduce(
        (acc, item) =>
        `${acc}${!acc ? '?' : '&'}${item}=${values[item]}`, '',
        Object.keys(values)
              .filter(r => values[r] !== null)
      );
```

如果这里使用原生的`.reduce()` 可能会踩很多坑 需要做很多类型判断 代码量就蹭蹭蹭蹭的上去了

就变成下面这样了

```js
export const paramsGenerate = values =>
      Object.keys(values)
            .filter(r => values[r] !== null)
            .reduce((r, m, k) => `${k === 1 ? `?${r}=${values[r]}` : `${r}`}&${m}=${values[m]}`);
```

3. `totalNum`

```js
const totalAll = R.reduce((acc, item) => acc + item.qps, 0, newData);
```

4. `listToMap`

```js
export const listToMap = list => R.reduce((acc, item) => Object.assign(acc, { [item.id]: item }), {}, list);
```

5. `promise`

此外 promise中也体现了类似的思想

```js
    this.props.dispatch({ type: 'test/fetchTest', testId })
              .then(() => this.TestNext)(testName));
```

我们可以看到这是一段基于dva回调函数 的代码，我们在书写的过程中可以很便捷的实现异步回调的功能

实际上[dva源码](https://github.com/dvajs/dva/blob/master/packages/dva-core/src/createPromiseMiddleware.js)中也是通过promise实现的

```js
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

其实 还想谈谈py，Cpp里面的Functional Programming 时间关系 今天先谈到这里

