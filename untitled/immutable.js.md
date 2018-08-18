# immutable.js

毕设做到想砸电脑

很难受了  
![](http://wyydsb.xin/wp-content/uploads/2018/05/5.12II.gif)  
————————————————————————  
上周因为一个小问题 接触到**immutable.js**这个东西

官方文档：[http://facebook.github.io/immutable-js/docs/\#/](http://facebook.github.io/immutable-js/docs/#/)

> _Immutable data encourages pure functions \(data-in, data-out\) and lends itself to much simpler application development and enabling techniques from functional programming such as lazy evaluation._
>
> _While designed to bring these powerful functional concepts to JavaScript, it presents an Object-Oriented API familiar to Javascript engineers and closely mirroring that of Array, Map, and Set. It is easy and efficient to convert to and from plain Javascript types._

简单 翻译一下 `immutable`倡导简单的函数实现（数据输入、数据输出）提供了一些将原生js的object封装成 `map，set` 的接口  
好像还是一头雾水 ing  
那么让我们慢慢来说

首先 `immutable` 是用来解决 `react`浅比较 这个问题的  
它是一种不可变数据结构约定

在`immutable`下 所有数据结构都是不可变的  
如果你需要改变`object`下面某个参数的值的时候 只能new 一个

我们知道react 有一个`shouldComponentUpdate(nextProps,nextState){}`方法当props或者state更新的时候  
会比较`nextProps`和`props`,`nextState`和`state`之间有无区别，如果有区别就返回true，否则就返回false

redux对数据的管理也是基于这个生命周期函数

但要注意 在react中 所有比较都是浅比较  
爬一下 `shouldComponentUpdate`的源码

```javascript
if (this._compositeType === CompositeTypes.PureClass) {
  shouldUpdate = !shallowEqual(prevProps, nextProps) || ! shallowEqual(inst.state, nextState);
}
```

而`shallowEqual`的源码则是

```javascript
const hasOwn = Object.prototype.hasOwnProperty

function is(x, y) {
  if (x === y) {
    return x !== 0 || y !== 0 || 1 / x === 1 / y
  } else {
    return x !== x && y !== y
  }
}

export default function shallowEqual(objA, objB) {
  if (is(objA, objB)) return true

  if (typeof objA !== 'object' || objA === null ||
      typeof objB !== 'object' || objB === null) {
    return false
  }

  const keysA = Object.keys(objA)
  const keysB = Object.keys(objB)

  if (keysA.length !== keysB.length) return false

  for (let i = 0; i < keysA.length; i++) {
    if (!hasOwn.call(objB, keysA[i]) ||
        !is(objA[keysA[i]], objB[keysA[i]])) {
      return false
    }
  }

  return true
}
```

从上面我们可以看出 当`props`里面的`object`只要包含的`key`也是`object` 就会判断错误  
换句话说，你修改`object`里面的`object`的值的时候 不会更新`render`

在实际应用中 比如说前端的`map`这个数据结构

前端的`map`是一个特殊的`object` 对应的值是`object`里面嵌套`object`

这就造成上面的问题

笔者是在使用`redux`管理`map`更新的时候 死活不会渲染 才发现这个问题

这个问题 `redux` 在`issue`中讨论过[https://github.com/reactjs/redux/issues/1499](https://github.com/reactjs/redux/issues/1499)

给出的解决方案是 使用`immutable.js`来代替原生的`map`

而`immutable`则是通过使得对象不可改变 来实现这个功能的

相对于 原来的 浅比较 `immutable`提供的是更精确的比较

可以想象 如果使用`immutable.js` 组件渲染次数可以得到有效的控制 可以更精确利用资源

而`immutable`提供`immutable-pure-render-decorator`方法进行比较

```javascript
import {React} from 'base';

import pureRenderDecorator from '../../../widgets/libs/immutable-pure-render-decorator';

@pureRenderDecorator
export default class PartA extends React.Component {
    constructor(props) {
        super(props);
        // 舍弃React.addons.PureRenderMixin
        // this.shouldComponentUpdate = React.addons.PureRenderMixin.shouldComponentUpdate.bind(this);
    }

    render() {
        console.log('组件PartA，render执行了');
        const data = this.props.data;
        return (
            <section>
                <div>
                    <p>我是组件PartA</p>
                    <p>{data.toJSON ? JSON.stringify(data.toJSON()) : data}</p>
                </div>
            </section>
        )
    }
}
```

附上 自己写的 比较函数

```javascript
export const compareArray = (array1, array2) => {
  if (!array2 || !array1) {return false;}

  if (array1.length !== array2.length) {return false;}

  for (let i = 0; i < array1.length; i++) {
    if (array1[i] instanceof Array && array2[i] instanceof Array) {
      if (array1[i] !== array2[i]) {return false;}
    } else if (array1[i] instanceof Object) {
      if (!compareObject(array1[i], array2[i])) {return false;}
    } else if (array1[i] !== array2[i]) {return false;}
  }
  return true;
};
```

```javascript
export function compareObject (x, y) {

  if (x === null || x === undefined || y === null || y === undefined) {return x === y;}
  if (x.constructor !== y.constructor) {return false;}
  if (x instanceof Function) {return x === y;}
  if (x instanceof RegExp) {return x === y;}
  if (x === y || x.valueOf() === y.valueOf()) {return true;}
  if (Array.isArray(x) && x.length !== y.length) {return false;}
  if (x instanceof Date) {return false;}
  if (!(x instanceof Object) || !(y instanceof Object)) {return false;}
  const p = Object.keys(x);
  return Object.keys(y).every((i) => p.indexOf(i) !== -1) && p.every((i) => compareObject(x[i], y[i]));
}
```

**`updated 6/6/2018`**

