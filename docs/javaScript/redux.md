---
title: Take about Redux I
date: 2018-04-23 13:23:43
tags: [Redux]
description: Take about Redux I
---

本来我们组用的前端技术一般 也就是利用基于`react`的`AntD`脚手架
后来组里来了一个pku的dalao 科普了 `react`全家桶

目前我们项目里除了基础的`redux`之外，还用了`saga`中间件 `react-router`

在了解`redux`之前 可能你不一定要用`redux`
经常有人会说 不会`redux`说明你不需要用`redux`
[“You Might Not Need Redux”](https://medium.com/@dan_abramov/you-might-not-need-redux-be46360cf367)
————————————————————————

**什么是Redux？**

讲起来`redux`第一次代码提交也就在三年前 一晃作为`react`家族一员 被广泛应用于各web构建

先来看一段官方文档的介绍
`Redux 是 JavaScript 状态容器，提供可预测化的状态管理。`

通俗的来讲`redux`做的工作类似于`state`做的工作，它是来管理数据状态的，解决数据变化和异步这两个问题的工具。
将原来事件驱动的服务，变化为数据驱动的服务。

**redux有什么特点？**

`redux`一般是由

1. action
2. reducer
3. store
4. MiddleWare

相对于`state`，首先`redux`里面的数据是可以跨页面的，其次`redux`的数据是只读的，如果需要更改数据必须调用相应的`action`。
当然这点也很好理解，因为`redux`读取时用的是`this.props props`本身就是只读的。（从这个角度 也可以把`redux`理解为父组件统一管理状态的库）
`reducer`函数是一个纯函数，只根据对应的`action`和之前的`state`，返回新的`state`。

**Action**
顾名思义 是一个存放行为的函数。
组件通过`dispath`调用`action`函数，`action`函数收到`request` 把对应的`type` 和 相应的参数 传递给 `store`

```javascript
import types from '../constants/actionTypes';
import { createActions } from '../util/utils';

//同步action
export function fetchCollapseChange(collapse) {
  return {
    type: types.CHANGE_COLLAPSE,
    payload: {
      collapse,
    },
  };
}

//异步action
export const fetchTimeInfo = createActions([
  types.FETCH_TIME_INFO_REQUEST,
  types.FETCH_TIME_INFO_SUCCESS,
  types.FETCH_TIME_INFO_FAILURE,
]);
```

```javascript
import { createConstants } from '../util/utils';

export default createConstants(

  'CHANGE_COLLAPSE',

  'FETCH_TIME_INFO_REQUEST',
  'FETCH_TIME_INFO_SUCCESS',
  'FETCH_TIME_INFO_FAILURE',
}
```

```javascript
const LoadStatus = {
  CACHED: 'cached',
  CHECKING: 'checking',
  LOADING: 'loading',
  UPDATING: 'updating',
  PROCESSING: 'processing',
  FINISHED: 'finished',
  ERROR: 'error',
  NONE: 'none',
};

export default LoadStatus;
```

**Reducer**
当`Action` 执行之后 得到了对应的`Action_type`。根据这些`type`，`reducer`函数更新相应的数据，注意`reducer`是一个纯函数，不执行复杂的数据处理过程。
`Reducer` 分为初始化，`action`更新两部分。

```javascript
import types from '../constants/actionTypes';
import LoadStatus from '../constants/loadStatus';

function getInitState() {
  return {
    loginLayout: {
      collapse: false,
      time: '0000-00-00 00:00',
      timeNum: 0,
      loadStatus: LoadStatus.NONE,
    },
  };
}

function layoutReducer(state = getInitState(), action) {
  const { payload } = action;
  switch (action.type) {
    case types.CHANGE_COLLAPSE:
      return {
        ...state,
        loginLayout: {
          ...state.loginLayout,
          collapse: payload.collapse,
        },
      };
    case types.FETCH_TIME_INFO_REQUEST:
      return {
        ...state,
        loginLayout: {
          ...state.loginLayout,
          loadStatus: LoadStatus.LOADING,
        },
      };
    case types.FETCH_TIME_INFO_SUCCESS:
      return {
        ...state,
        loginLayout: {
          ...state.loginLayout,
          loadStatus: LoadStatus.FINISHED,
          time: payload.time,
          timeNum: payload.result,
        },
      };
    case types.FETCH_TIME_INFO_FAILURE:
      return {
        ...state,
        loginLayout: {
          ...state.loginLayout,
          loadStatus: LoadStatus.ERROR,
        },
      };
    default:
      return state;
  }
}

export default layoutReducer;
```

```javascript
import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import layoutReducer from './layoutReducer';

const rootReducer = combineReducers({
  layout: layoutReducer,
});

export default rootReducer;
```

**Store**
`store`就相当于一个存储库，受到各种函数调用，当`store`里面的参数值更新之后 把更新后的参数返回给各个组件。

```javascript
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { fetchUserInfo } from './actions/userAction';
import { fetchCollapseChange } from './actions/layoutAction';

//把所有state值 存入props中
function mapStateToProps(state) {
  const {
    user: {
      loginUser: {
        isAdmin,
      },
    },
    layout: {
      loginLayout: {
        collapse,
      },
    },

  } = state;
  return {
    isAdmin,
    collapse,
  };
}

//把所有dispatch 函数 存入props
function mapDispatchToProps(dispatch) {
  return {
    fetchUserInfo() {
      dispatch(fetchUserInfo.request());
    },
    fetchCollapseChange(collapse) {
      dispatch(fetchCollapseChange(collapse));
    },
  };
}

//withRouter
export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(AppLayout));
```

当`props`更新之后 `render`会重新渲染一次 以实现类似`setState`的功能。
此外`redux`可以通过`componentWillReceiveProps` 获取下一次`props`值 根据此值 可以做相应的操作

```javascript
  componentWillReceiveProps(nextProps) {
    const {
      loadStatus: nextLoadStatus,
    } = nextProps;

    const {
      loadStatus,
    } = this.props;

    const { filterVis, filtered } = this.state;
    if (loadStatus === LoadStatus.LOADING && nextLoadStatus === LoadStatus.FINISHED && filterVis) {
      this.onChangeSearch(filtered);
    }
  }
```

**Saga**
`saga`是实现异步`Redux`的一个中间件 负责传递`ajax`请求 和 根据进度返回相应的`loadStatus` 、相应的返回值

```javascript
import baseApi from './baseApi';

export default {
  fetchTimeInfo() {
    return baseApi.get('/system/time');
  },
};
```

```javascript
import axios from 'axios';
import { backendUrl } from '../util/constant';

const baseApi = axios.create({
  baseURL: backendUrl,
  timeout: 30000,
  withCredentials: true,
  changeOrigin: true,
});

baseApi.interceptors.response.use((response) => {
  const { data } = response;
  if (typeof data.success === 'boolean' && !data.success) {
    return Promise.reject(response);
  }
  return {
    result: data,
    receivedAt: Date.now(),
    response,
  };
}, (err) => {
  console.log(err);
  if (err.response.status === 302) {
    location.href = backendUrl;
    window.localStorage.setItem('last', window.location.href);
    console.log(`set last to ${window.location.href}`);
  }
  return Promise.reject(err);
});

export default baseApi;
```

```javascript
import { call, put, takeLatest } from 'redux-saga/effects';
import types from '../constants/actionTypes';
import layoutApi from '../apis/layoutApi';
import { fetchTimeInfo } from '../actions/layoutAction';
import { timeStamp2String } from '../util/constant';

export function* fetchTimeInfoTask() {
  try {
    const payload = yield call(layoutApi.fetchTimeInfo);
    payload.time = timeStamp2String(payload.result);
    yield put(fetchTimeInfo.success(payload));
  } catch (err) {
    yield put(fetchTimeInfo.failure(err));
  }
}

export default function* layoutSaga() {
  yield takeLatest(types.FETCH_TIME_INFO_REQUEST, fetchTimeInfoTask);
```

```javascript
import { all } from 'redux-saga/effects';
import layoutSaga from './layoutSaga';

export default function* rootSaga() {
  yield all([
    layoutSaga(),
  ]);
}
```

```jsx
import { applyMiddleware, createStore, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import thunkMiddleware from 'redux-thunk';
import rootReducer from '../reducers';
import rootSaga from '../sagas';
import DevTools from '../containers/DevTools';

export default function configureStore(initialState) {
  const sagaMiddleware = createSagaMiddleware();

  const middlewares = [
    thunkMiddleware,
    sagaMiddleware,
  ];

  console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
  let store = {};
  if (process.env.NODE_ENV === 'production') {
    store = createStore(rootReducer, initialState, compose(applyMiddleware(...middlewares)));
  } else {
    store = createStore(rootReducer, initialState, compose(
      applyMiddleware(...middlewares),
      DevTools.instrument(),
    ));
  }

  sagaMiddleware.run(rootSaga);

  return store;
}
```

`Saga` 可以实现`ajax`请求统一管理 通过`loadStatus`来判断api调用状态
通过选择`takeLeading/takeLatest/takeEvery` 来管理`ajax`请求 避免堆积pending

**数据流**
`redux`的生命周期 从调用`dispatch`开始
当组件开始渲染 调用了 某个`action` 函数 可能是写在`componentDidMount` 亦或是 普通函数中的 `this.props.xxxx()`;
之后 调用`mapDispatchToProps` 通过`withRouter`传递给`action`函数
`action`拿到请求之后 返回相应的`type`
之后`reducer`执行相应的更新`store`

相对而言 异步调用`action`会分两步走
一开始的`type` 是`XXXX.REQUEST`
`action`之后调用一次`reducer`
之后执行一次api
当收到返回值之后 调用saga函数
`saga`函数会自动返回一个`type XXXX.SUCCESS`
如果超时未收到返回则 `action` 返回 `type XXXX.FAILURED`
之后第二次`reducer`

此外`Rudux` 自带非常友好的调试机制 通过contr + q 调用 contr + h切换
![](http://wyydsb.xin/wp-content/uploads/2018/04/4.23I.png)
————————————————————————
PS：参考：
\[1\].[redux官方文档](https://redux.js.org/).
\[2\].[阮一峰Redux教程](http://www.ruanyifeng.com/blog/2015/03/react.html).

`updated 4/23/2018`

