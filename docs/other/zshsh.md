---
title: Linux流水式开光神器zsh.sh
date: 2019-05-01 20:52:49
tags: [Bash]
description: zsh.sh
---

上一篇讲了很多 Mac 中配置的小技巧[如何给码农 👨‍💻‍ 的 Mac 开光](https://wyydsb.xin/other/terminal.html)

时隔半年，再来诈尸更新一下开光 🕴 系列。

主要是遇到一个很现实的问题，

> 一开始你可能只是一个实验室的小砖工
> 你手上的机子可能还是要去排队才能轮的上的
>
> 没有可以持久使用的机子，肯定不会去想要不要给服务器配一下 zsh，让大家登机子上去好用一点
> （这个业务场景不考虑做一些内部使用的系统，提升用户体验，不存在的）
>
> 直到有一天 ~~（当然这一天很可能不存在）~~，大老板 看你骨骼清奇，说给你 5 张 V100 用一下
>
> 你喜出望外，一脸色眯眯，等想着自己是不是要给服务器整一套好用的环境
>
> 但是 一个星期过去了，你发现你还在配环境（当然 周报有东西写 是好事情 hhh）

有时候，一件事做几次可能会挺有收获的，但一旦重复次数多了，只剩下厌倦了。

而作为一个 zsh 深度用户，在白板 linux 上敲命令总感觉少了些什么

`zsh.sh`就是为了解决这个问题，也为了方便新手能容易的配置之前教程中说明的环境

- 如果你手上有一些机器，或者正准备迁移自己的服务器
- 如果你苦于繁琐的配置过程，害怕配置中遇到 bug
- 如果你不喜欢白板 shell 界面，习惯于 zsh 环境

欢迎使用[zsh.sh](https://github.com/iofu728/zsh.sh)

![image](https://cdn.nlark.com/yuque/0/2019/png/104214/1556737097752-085bd8b9-dd94-4be6-b401-c2ba80b1a346.png)

- 目前支持 `Ubuntu`, `CentOS`, `MacOSX` 三个发行版
- 支持 `amb64(64bit)` & `i386 (32bit)`
- 支持 `Docker` 部署，Ubuntu, Ubuntu32, CentOS 三个版本
- 目前 zsh.sh 中包含 oh-my-zsh,fzf,vimrc 三块的配置

在使用过程中，肯定会有一些小困难，欢迎在 issue 或者评论区跟我交流。😉

![image](https://cdn.nlark.com/yuque/0/2019/gif/104214/1556771802339-d084eb70-90d0-438f-925c-50aace8a535e.gif)

个人感觉使用起来，还是蛮爽的。科技解放生产力~

## Vscode

顺带补一下 VScode 的一些配置

半年前，其实我的主力 IDE 还是 Sublime，

慢慢的身边的工友用 VScode 的比较多，就把一部分配置迁过来了

用下来几个月的感受，VSCcode 毕竟开源，插件也好功能也好相对于 Sublime 确实多挺多的

但相对而言跟人的感觉就比 Sublime 重

直观的感受，就你看 7.8k 行代码文件的时候就有一个 code Help 进程在那里呜呜呜

因为之前在 Sublime 主要是 1. 保存时自动 format; 2. 自动更新头文件信息; 这两个功能比较在意

所以在 Vscode 中也配置了这两项

### Save Format

这里用到的是`Formatting Toggle`这个插件，支持的文件类型还是比较多的，比如给 markdown 表格自动格式化，这还是挺酷炫的

![image](https://cdn.nlark.com/yuque/0/2019/gif/104214/1556736489258-0dd9ae24-bda1-4e4d-b2aa-f5af581f763e.gif)

### Header Insert

配置了`psioniq file header` 主要要改一下配置项

```json
{
  "gitlens.advanced.messages": {
    "suppressShowKeyBindingsNotice": true
  },
  "terminal.external.osxExec": "iTerm2.app",
  "guides.enabled": false,
  "workbench.colorTheme": "Monokai Pro",
  "workbench.iconTheme": "Monokai Pro Icons",
  "files.autoSave": "onFocusChange",
  "psi-header.changes-tracking": {
    "autoHeader": "autoSave",
    "isActive": true,
    "modDate": "@Last Modified time: ",
    "modAuthor": "@Last Modified by:   "
  },
  "formattingToggle.activateFor": ["formatOnSave"],
  "psi-header.config": {
    "forceToTop": true,
    "blankLinesAfter": 1,
    "author": "gunjianpan",
    "authorEmail": "gunjianpan@pku.edu.cn"
  },
  "editor.formatOnSave": true,
  "psi-header.templates": [
    {
      "language": "*",
      "template": [
        "@Author: <<author>>",
        "@Date:   <<filecreated('YYYY-MM-DD HH:mm:ss')>>",
        "@Last Modified by:   <<author>>",
        "@Last Modified time: <<dateformat('YYYY-MM-DD HH:mm:ss')>>"
      ]
    }
  ],
  "window.zoomLevel": 0,
  "latex-workshop.view.pdf.viewer": "tab",
  "latex-workshop.chktex.run": "onType",
  "liveshare.featureSet": "insiders",
  "terminal.integrated.rendererType": "dom",
  "editor.suggestSelection": "first",
  "vsintellicode.modify.editor.suggestSelection": "automaticallyOverrodeDefaultValue",
  "files.exclude": {
    "**/.classpath": true,
    "**/.project": true,
    "**/.settings": true,
    "**/.factorypath": true
  },
  "[markdown]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "python.jediEnabled": false,
  "[dockerfile]": {
    "editor.defaultFormatter": "PeterJausovec.vscode-docker"
  },
  "markdown-pdf.styles": ["https://unpkg.com/mdss"],
  "C_Cpp.updateChannel": "Insiders"
}
```

### Live Share

然后比较推荐的时候 Vscode 的 Live Share, 这是我队友给我推荐的

你可以用 Live share 多人写代码，也可以用来作为远程 Terminal 帮忙调试的媒介

一键召唤神龙

![image](https://cdn.nlark.com/yuque/0/2019/png/104214/1556736836330-392cb896-64ab-4cbe-8095-3bc4f97e8f3c.png)

### Latex

Vscode 毕竟是宇宙第一操作系统， 在上面敲 Latex 也是很爽的，配上 Latex 公式神器[Mathpix snipping Tool](https://mathpix.com/)

![image](https://cdn.nlark.com/yuque/0/2019/png/104214/1556736477702-03c5e335-6606-45ed-a1b3-df1c9fcc69ae.png)

![image](https://cdn.nlark.com/yuque/0/2019/png/104214/1556736470215-0431f2cc-039c-4dd9-b8e5-55110c46602a.png)
