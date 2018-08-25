
# FAQ

::: tip
持续补充中。
:::

[[toc]]

## 常见问题

### Eslint 报错
#### 诸如./src/models/task.js Line 5:  Expected 'multiple' syntax before 'single' syntax  sort-imports

Dev 时，如果有关于语法相关的报错，都会在主屏幕上显示（无需打开 开发者模式）

而基本上都是属于Eslint报错

首先尝试使用
```bash
yarn run eslint-fix
```
如果未能解决，需要找到报错处，进行手动更改；

常见的Eslint报错有：
* sort-imports import未按字母顺序排序
* no-magic-numbers 请使用变量代替常量数据

目前是有三个warning 没法解决，两个是骑兵引入，一个是Emojis引入

### Warning: React does not recognize the `inlineIndent` prop on a DOM element. 等 Warning

这个warning，主要是为了样式统一，把左上角的图标塞进Menu里面，导致的warning。

尝试拿出来过，没有好的解决方案

### yarn run start 不成功

检查package.json 中ip对不对，端口号有没有占用，系统是否是unix

如果是unix，请把
```jsx
"set PORT=8080&&set HOST=172.16.2.162&&umi dev"
```
改为
```jsx
"PORT=8080 HOST=172.16.2.162 umi dev"
```

主要原因是不同系统，命令行语言不同，导致的。

### 启动成功但页面无内容，时间显示"1970-01-01 08：00：00"

检查lion上8，31有没有配置，ipconfig.js中ip配置是否正确

### uncaught at _callee3 at _callee3 
```
     at _callee6 
     at takeEvery(task/flowList, _callee) 
     at _callee 
     at _callee 
     Error: TypeError: Cannot convert undefined or null to object
```

基本上就是model里面那个参数值undefined

### Warning: `Form.Item` cannot generate `validateStatus` and `help` automatically, while there are more than one `getFieldDecorator` in it.

出现原因：Form 组件中一个<FormItem/>绑定了多个getFieldDecorator

处理建议：问题不大，不需要处理

### 一些线上bug在本地可能不能复现
可能是因为缓存原因，因为chrome版本问题，产生了一些缓存冲突；而本地因为不启用缓存，则不会出现这样的问题。

解决方案：清除缓存

## 后期想法

### umi 2.0 升级

首先 umi 2.0 是一个大版本升级，修改的东西比较多，需要配置的项也比较多

目前(now=18.8.23) 只发布了2.0.0-beta.17 GitHub还有用户提出AntD样式显示异常的问题

目前不建议升级，但长远来讲，需要升级，建议升级前期，拿Lucifer练手（Lucifer和TAISHAN采用一致框架，之前的一些前期验证都是在Lucifer上实现的）

### AntD Pagination组件 PageSize Bug跟进
项目中的后端分页，在一些场景中，需要控制回跳到第一页，但因为AntD的bug，page显示异常。
已反馈Bug，待修复之后，检查下这部分逻辑

参见[](https://github.com/ant-design/ant-design/issues/11286)，目前处于`inactive`相信不久之后会修复

### 未合并代码
Pattern部分代码写完了 见TAISHAN-772_pattern

但考虑到部分接口 可能 更改 暂时不合

### 单测
单测还是很有必要的 有空的时候 可以补起来

### 改进点
1. Task Create 可以加一个新建项目确认弹窗
2. 轮询接口最好改成TakeLeading，但是目前dva不支持，考虑使用take+call实现
3. 数据源添加数据时，如果连续两次操作，会造成有一个message.loading会一直在那里
4. 目前还有两个页面数据量较大的页面是前端分页，dataSource/integral
5. 数据源页loading机制

### 代码优化
有些代码还有很大优化空间，实际上第三次大版本升级的时候很多地方都没有细改

尤其是Effect等数据处理方面


