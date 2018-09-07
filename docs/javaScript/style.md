---
pageClass: custom-page-class
---

# Style

TAISHAN 使用样式参考AntD Pro，但略有不同，除外界引入组件外使用.css定义组件样式

基本样式采用左侧可收缩菜单栏，上方固定头部设定。

全局layout见layouts/目录

## 颜色定制

* 这其实是TAISHAN第三版大改的一个动力

* 因为用过AntD Sider组件的同学应该都知道，AntD这个组件虽然很方便，但稍微丑了点

* 不支持颜色定制，只有白和黑两种颜色，导致，A端大部分AntD做的项目都是一个样子，黑色边栏，亮蓝色组件，左边栏还特别长，不能更改。

* 为解决这个问题，使用了深度定制AntD的umi框架，修改了组件颜色为 #07527a

* 未解决Sider样式较为丑的问题，舍弃使用AntD的Sider组件，利用Menu+css搭建，并约定不能使用SubMenu

* 对Header，利用css进行优化处理

## flex

* 对于css构建中，推荐使用flex
* flex最大的好处是方便实现居中

```css
.center {
  display: flex;
  justify-content: center;
  align-items: center
}
```
* 其他，就注意把所有组件尤其是，Table组件的Style定义到Css中，方便以后重构
