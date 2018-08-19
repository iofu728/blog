# React component

编者按：React 16之后 对 生命周期函数  
进行大改增加了一些函数 对于部分函数增加UNSAFE\_头 准备React 17之后正式废弃  
以下文章适用于**React** **15** 及之前 版本 **React** **16** 的 component function 有空时候补上

对React的使用来说，生命周期对理解、使用渲染至关重要，所以在这里对React的生命周期做一些整理。

在分析生命周期之前，先明确几个概念，  
1.`props`：这个东西和`this`一样，在lz一开始写前端的时候迷迷糊糊的，不知道到底是什么。  
我们知道对于一个类而言，其中的参数，仅在该类有效，如果一个组件被反复调用，那么根据oop的写法，我们应该把它封装成一个通用的组件，为了使得这个组件能够接收到某个类传过来的参数，我们用`props`来完成。  
在React 0.13之后，`props`只读，不能在函数中修改其值。  
2.`this`：`this`指的就是这个页面目前设定的所有参数及值。  
在ES6中，调用函数的时候不会自动绑定`this`，需要通过`.bind(this)`或者`=>`来实现。  
也可以将绑定方法写到`constructor`中。

```javascript
 render() {
    return (
      <div onClick={this.handleClick.bind(this)}>ES6方式创建的组件</div>
    );
  }

or

 constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
 render() {
    return (
      <div onClick={this.handleClick}>ES6方式创建的组件</div>
    );
  }

or

handleClick = () => {
    console.log(this);
  }
```

3.`render`：渲染函数。通过内部的html来实现渲染页面\(`react`支持前端+后端渲染\)  
4.父组件、子组件：相当于封装函数，调用位置。  
5.DOM： `document object modal`。文档对象模型，通常通过节点树来表示。

从上面的分析，我们可以推断出React对一个页面的展示，从一些参数的初始化开始。  
在ES5的时候，还是用

```javascript
getDefaultProps，getInitialState
```

到了ES6的时候，已经用`constructor`替代：

```javascript
  constructor(props) {
    super(props);
    this.state = {
      createModalVisible: false,
      pagination: {
        total: 0,
        showSizeChanger: true,
        size: 'small',
        showTotal: (total => `总条数: ${total}  `),
      },
      dataSource: [],
    };
  }
```

对于需要另外进行初始化`props`处理的，可以在class外面调用

```javascript
propTypes，defaultProps
```

进行`props`类型和值的约定。

```jsx
MyComponent.propTypes = {
  nameProp: React.PropTypes.string
};
MyComponent.defaultProps = {
  nameProp: ''
};
```

在初始化`props`和`state`之后，进行初始函数调用

```javascript
componentWillMount()
```

然后第一次渲染。

```jsx
render()
```

渲染之后，会调用

```javascript
componentDidMount()
```

当父组件调用其`render`时候，子组件就会调用一次

```javascript
componentWillReceiveProps(nextProps)
```

当子组件进行一次`setState`或者父组件/`redux`的`props`更新一次值的时候，调用

```javascript
shouldComponentUpdate(nextProps, nextState)
```

，当`shouldComponentUpdate`返回true时，

```javascript
componentWillUpdate(nextProps, nextState)
```

就会被调用，然后就会重新进行一次渲染，调用一次`render`。

当组件卸载的时候调用

```javascript
componentWillUnmount()
```

PS：参考：  
\[1\].[react官方文档](https://reactjs.org/docs/react-component.html).

`updated 4/6/2018`

