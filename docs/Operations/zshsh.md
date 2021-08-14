---
title: Linux批量配置神器zsh.sh 👻 VSCode真香攻略
date: 2019-05-01 20:52:49
tags: [Operations/Configuration]
description: zsh.sh
---

[反向引流·知乎](https://zhuanlan.zhihu.com/p/64444982)

> 19.05.03 Update Vscode 配置攻略（都是血和泪换来的）

上一篇讲了很多 Mac 中配置的小技巧[如何给码农 👨‍💻‍ 的 Mac 开光](https://wyydsb.xin/Operations/terminal.html)

时隔半年，再来诈尸更新一下开光 🕴 系列。

> 每次当我们看到 dalaos 写的教程时候，虽然一条条都列的很详细了，但实际操作起来还是困难重重。
> 有没有一种更舒适的方式让我们更容易的获得教程中所搭建的环境。

对于博主来说，除了上述原因之外，主要是遇到一个很现实的问题，

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

> **VSCode 真香**
>
> **VSCode 真香**
>
> **VSCode 真香**

![image](https://cdn.nlark.com/yuque/0/2019/gif/104214/1556892046025-2a0af4ce-a131-4164-91de-8bdd607e18e0.gif)

hhh 之前我一直是 Sublime 布道者，VSCode 黑

直到最近，主力 IDE 已经变成 VSCode 了

特别是最近 VSCode 正式发布[vscode-remote](https://github.com/Microsoft/vscode-remote-release)

第一眼 看到的时候 震惊了！！！

这意味着以后你可以在服务器上用 VSCode 写代码，这还要什么[coder-server](https://github.com/cdr/code-server)

先鞭尸一下 coder-server, 相较于 vscode-remote:

- coder-server, 横向扩展性差，必须在相应的服务器上部署 coder-server
- 配置麻烦，我们本地 local 的 VSCode 肯定会花大力气配置，但如果有 n 台服务器呢，你还会这么做吗（写个脚本，不好意思，这个有点难写）
- 所以一开始看到 code-server 的时候没有那么惊喜，（流露出配过环境的人的眼泪 😢

试验下来超级顺滑，除了现在 vscode-remote 只支持 64bit 的 Linux 这一点，其他都很丝滑（Nachos 还是不能用 hhh

除了支持 ssh 连接之外，还支持 Docker Container 的连接，超级棒了

但 vscode-remote 目前出于公测阶段，只能在绿色的 VSCode Insider 中使用，而且功能还待完善

![image](https://cdn.nlark.com/yuque/0/2019/png/104214/1556892036812-6fb847fe-fe65-4730-9e14-cfbdf54d4526.png)

### 给我个理由

> 那么作为一个忠实的 Sublime 用户，为何会从 Sublime 迁移到 VSCode 来

当时觉得 Sublime 有几点特别吸引我:

1. 好看
2. 轻量
3. 可配置实现 ide 唤起编译运行
4. 保存时自动调整代码格式
5. 写 cpp 的时候模板用起来特别爽
6. 可以设置带有 File Header

而这些 我都在 VSCode 中一个个实现了

因为 之前配置的 Vscode 装插件装的特别多 在代码量特别大的时候（7k-8k 行），code help 进程就会打满，整个机子就会石乐志一样

再加上 vscode-remote 只支持 Insider 版，就顺道把配置理了一下

### Save Format

这里用到的是[`Formatting Toggle`](https://marketplace.visualstudio.com/items?itemName=tombonnike.vscode-status-bar-format-toggle) + [`Prettier`](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)这个插件，支持的文件类型还是比较多的，比如给 markdown 表格自动格式化，这还是挺酷炫的

![image](https://cdn.nlark.com/yuque/0/2019/gif/104214/1556736489258-0dd9ae24-bda1-4e4d-b2aa-f5af581f763e.gif)

```json
{
  "formattingToggle.activateFor": ["formatOnSave"],
  "editor.formatOnSave": true,
  "files.autoSave": "onFocusChange"
}
```

### File Header

这个用了[`psioniq File Header`](https://marketplace.visualstudio.com/items?itemName=psioniq.psi-header), 文档还是比较详细的，但配置十分繁琐，弄了好长时间，还给作者发邮件，hhh

```json
{
  "psi-header.changes-tracking": {
    "autoHeader": "autoSave",
    "isActive": true,
    "modDate": "@Last Modified time: ",
    "modAuthor": "@Last Modified by:   ",
    "include": [],
    "exclude": ["markdown", "json"],
    "excludeGlob": ["out/**", "src/**/*.xyz"]
  },
  "psi-header.config": {
    "forceToTop": true,
    "blankLinesAfter": 1,
    "author": "gunjianpan",
    "authorEmail": "gunjianpan@pku.edu.cn",
    "license": "Custom"
  },

  "psi-header.lang-config": [
    {
      "language": "python",
      "begin": "",
      "prefix": "# ",
      "end": "",
      "beforeHeader": ["# -*- coding: utf-8 -*-"]
    },
    {
      "language": "shellscript",
      "begin": "",
      "prefix": "# ",
      "end": "",
      "beforeHeader": ["#!/bin/bash"]
    },
    {
      "language": "javascript",
      "begin": "/**",
      "prefix": " * ",
      "end": " */",
      "blankLinesAfter": 2,
      "forceToTop": false
    },
    {
      "language": "typescript",
      "mapTo": "javascript"
    }
  ],
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
  ]
}
```

### 代码编译运行

虽然提供了在 Output 中输出运行结果的插件[`Code Runner`](https://marketplace.visualstudio.com/items?itemName=formulahendry.code-runner)

但很多场景是需要交互式的，(比如说刷 leetcode 🌹🐔

这个时候 就需要配置一下

```json
{
  "code-runner.executorMap": {
    "javascript": "node",
    "perl": "perl",
    "go": "go run",
    "python": "ipython3",
    "java": "cd $dir && javac $fileName && /Library/Java/JavaVirtualMachines/jdk1.8.0_181.jdk/Contents/Home/bin/java '-javaagent:/Applications/IntelliJ IDEA.app/Contents/lib/idea_rt.jar=60957:/Applications/IntelliJ IDEA.app/Contents/bin' -Dfile.encoding=UTF-8 -classpath $dir $fileNameWithoutExt",
    "c": "cd $dir && /usr/bin/gcc $fileName -o $fileNameWithoutExt && open -a Terminal.app $dir$fileNameWithoutExt",
    "cpp": "cd $dir && /usr/bin/g++ -std=c++11 $fileName -o $fileNameWithoutExt && $dir$fileNameWithoutExt"
  }
}
```

### 能像 Intellij IDEA 一样能查 local History

[`Local History`](https://marketplace.visualstudio.com/items?itemName=xyz.local-history)

```json
{
  "local-history.daysLimit": 30,
  "local-history.maxDisplay": 16,
  "local-history.saveDelay": 0,
  "local-history.dateLocale": "en-GB",
  "local-history.exclude": [
    "**/.history/**",
    "**/.vscode**",
    "**/node_modules/**",
    "**/typings/**",
    "**/out/**",
    "**/__pycache__/**",
    "**/.ipynb_checkpoints/**",
    "**/data/**",
    "**/.DS_Store/**",
    "**/checkpoint/**"
  ]
}
```

### Live Share

然后比较推荐的时候 Vscode 的 [Live Share](https://marketplace.visualstudio.com/items?itemName=MS-vsliveshare.vsliveshare), 这是我队友给我推荐的

你可以用 Live share 多人写代码，也可以用来作为远程 Terminal 帮忙调试的媒介

一键召唤神龙

### Latex

Vscode 毕竟是宇宙第一操作系统， 在上面敲 Latex 也是很爽的，配上 Latex 公式神器[Mathpix snipping Tool](https://mathpix.com/)

![image](https://cdn.nlark.com/yuque/0/2019/png/104214/1556736477702-03c5e335-6606-45ed-a1b3-df1c9fcc69ae.png)

![image](https://cdn.nlark.com/yuque/0/2019/png/104214/1556736470215-0431f2cc-039c-4dd9-b8e5-55110c46602a.png)

### Other

- [Monokai Pro](https://marketplace.visualstudio.com/items?itemName=monokai.theme-monokai-pro-vscode), Theme
- [sort lines](https://marketplace.visualstudio.com/items?itemName=Tyriar.sort-lines), import sort
- [polacode](https://marketplace.visualstudio.com/items?itemName=pnp.polacode), 代码图片生成
