---
title: 如何给码农👨‍💻‍的Mac开光
date: 2018-12-25 16:12:25
tags: [Operations/Configuration]
description: some configuration skills for mac
---

> **Update 19.5.3** Vscode 配置攻略（都是血和泪换来的）真香
> **Update 19.5.1** 教程对应的脚本 和 docker 版 [`zsh.sh`](https://github.com/iofu728/zsh.sh)已经上线了

> 人人都说 Mac 好
> 那么 有一台程序员 👨‍💻‍ 必备的 Mac 的我们 应该如何配置 Terminal 舞装 💃 我们的 Mac 呢

Ps: `Ubuntu|Centos` 配置`Terminal`思路与 Mac 相同 只是`brew` -> `apt-get|yum` or 源码安装
PPS: 在这里特别感谢带我入门的`山川dalao` 🙇

**友情提醒: 按照教程配置下来 即使熟练起码也要`1h`以上 maybe 可以先`收藏`🤗**

> Update fzf usage from @PegasusWang
> 必须提一下 以前一直都以为`fzf`只能在 Mac 上用 原来连 Win 都支持 那 必须强推这个神器了 `2019.01.13`
> 详见[Fzf 大法好](#fzf)

考虑到文章 有点长了 还是 在这 放个`导航`吧

[[toc]]

## zsh.sh

插个队介绍下 [`zsh.sh`](https://github.com/iofu728/zsh.sh), 大致来说就是这篇文章配置的脚本工具及其 docker 版本 🤺

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

## `Motivation`

这篇文章 的`Motivation` 主要是 因为 在生活中 总有 一些 friends 问我

> ”为啥 我们 都是 Mac 怎么感觉你的 高端一点“
> 我总是 笑着 回答 我这个 是 `真Mac`

<center><img width="250" src="https://cdn.nlark.com/yuque/0/2019/png/104214/1547038574539-8b19fc46-2c47-4b80-89ed-c664fe2def42.png"></center>

实际上 这些 只是 `配置`的问题 配置好的 Mac 比 Win 好的 不是 一点点

之所以 说 Mac 最适合 程序员 👨‍💻‍ 一个是因为 基于`Unix` 天生适合开发 二是 工具生态比较多样 相较于 Win 更`精致`

当然 `配置` 只是 为了 更高效的 work 本质上 是没什么玩意的 关键是养成 习惯 提高效率

当然 由于篇幅的原因 只能 讲一些 我觉得 最能提高工作效率的 工具 🙇**_欢迎 大神 补充_**

## `Terminal`

> iTerm2 + zsh + fzf

### Why is `iTerm2`

Terminal 是 进入 Unix 的 入口

但 MacOs 自带的 Terminal 在 功能上 不够强大 一般都会用`iTerm` 替代

`Advantage`:

- 🤓 可定制化 Hotkey, 一键召出 iTerm2 (不再需要 ⌘+Tab 或者 通过 spotlight 切换)
- 快捷的组合键
  - ⌘+Shift+E 召唤`时间线`
  - ⌘+Option+b `时光机`
  - ⌘+T 新 Tab
  - ⌘+D 水平分屏
  - ⌘+← 切换 Tab / ⌘+Option+← 切换分屏

总之 就是 `好看` `好用`

来看下效果图

![图片.png | center | 556x500](https://cdn.nlark.com/yuque/0/2019/png/104214/1547708084027-378e0f4c-480d-4a5b-ae2e-f90edb3171bf.png)

### `zsh`

关于 Bash 的配置 我的想法 就是 只要 `好看` `好用`就行 hhh👵 参考[为什么说 zsh 是 shell 中的极品？](https://www.zhihu.com/question/21418449)

zsh 的配置 主要 的 功能 是 `命令高亮`（识别 命令 正确性）`拓展性高` 支持 命令补全 et al.

这里的 `高亮` 是克制的 是为了 高效 不是 为了 `酷炫`

在这里 我配置了 `brew` `zsh` `oh-my-zsh` `zsh-autosuggestions` `zsh-syntax-highlighting`

具体步骤的 参考链接 见下面 👇 的注释

```bash
# install Command Line Tools
$ xcode-select --install

# install software manager homebrew(maybe very slowly - you can use cellular)
$ /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

# change mirror to tuna
$ cd "$(brew --repo)"
$ git remote set-url origin https://mirrors.tuna.tsinghua.edu.cn/git/homebrew/brew.git
$ cd "$(brew --repo)/Library/Taps/homebrew/homebrew-core"
$ git remote set-url origin https://mirrors.tuna.tsinghua.edu.cn/git/homebrew/homebrew-core.git

# install zsh & change bash -> zsh
$ brew install zsh git
$ chsh -s /bin/zsh

# install oh-my-zsh
$ sh -c "$(curl -fsSL https://raw.github.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"

# syntax highlighting
$ git clone https://github.com/zsh-users/zsh-syntax-highlighting.git $ZSH_CUSTOM/plugins/zsh-syntax-highlighting
$ echo "source \$ZSH_CUSTOM/plugins/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh" >> ${ZDOTDIR:-$HOME}/.zshrc

# zsh-autosuggestions
$ git clone git://github.com/zsh-users/zsh-autosuggestions $ZSH_CUSTOM/plugins/zsh-autosuggestions

# configure system set in ~/.zshrc
$ vim ~/.zshrc

# https://github.com/robbyrussell/oh-my-zsh/wiki/themes
# https://github.com/robbyrussell/oh-my-zsh/wiki/External-themes
ZSH_THEME="avit"  # zsh theme like 'ys' refer web👆
plugins=(
    git
    docker
    zsh-autosuggestions  # autosuggestions
)

# alias
alias dkst="docker stats"
alias dkpsa="docker ps -a"
alias dkimgs="docker images"
alias dkcpup="docker-compose up -d"
alias dkcpdown="docker-compose down"
alias dkcpstart="docker-compose start"
alias dkcpstop="docker-compose stop"
alias setproxy="export ALL_PROXY=socks5://127.0.0.1:1086"  # terminal proxy
alias unsetproxy="unset ALL_PROXY"

export HOMEBREW_NO_AUTO_UPDATE=true                        # no update when use brew

source $ZSH_CUSTOM/plugins/zsh-autosuggestions/zsh-autosuggestions.zsh
source $ZSH_CUSTOM/plugins/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh

# end of edit ~/.zshrc
$ source ~/.zshrc
```

### `fzf`

> fzf = fuzzy finder

是一个用 Go 写的功能爆炸强的插件 ~~(每次我一用 fzf 别人都会投来异样的目光 👹)~~

`fzf` 的主要功能有 `查找文件` `历史命令查询` `快速进入目录`

我用 fzf 相当于 一个 `代码粘贴本` + `快速cd` + `预览文件`工具

![图片.png | center | 556x500](https://cdn.nlark.com/yuque/0/2019/gif/104214/1547377408923-14fca5e3-8b23-4c9c-8821-c07a0df90212.gif)

左侧是`Ctrl+R`历史命令查询 👏(支持模糊匹配) 右侧是`^\`(默认`Alt+C` 可 DIY)快速进入目录 回车之后 直接进入
PS: 官方文档给的基本操作是 `cd **`+`Tab`生成列表+`Enter`生成命令+`Enter`执行 快捷键可以把 4 步变成两步 还是很 Nice 的 👻

下面给出 Mac 和 Ubuntu 的配置 Code

```bash
# for Mac
# install fd & fzf
$ brew install fd fzf

# bind default key-binding
$ /usr/local/opt/fzf/install
$ source ~/.zshrc

# alter filefind to fd
$ vim ~/.zshrc
export FZF_DEFAULT_COMMAND='fd --type file'
export FZF_CTRL_T_COMMAND=$FZF_DEFAULT_COMMAND
export FZF_ALT_C_COMMAND="fd -t d . "

$ source ~/.zshrc

# Ctrl+R History command; Ctrl+R file catalog
# if you want to DIY key of like 'Atl + C'
# maybe line-num is not 66, but must nearby
$ vim /usr/local/opt/fzf/shell/key-bindings.zsh
- 66 bindkey '\ec' fzf-cd-widget
+ 66 bindkey '^\' fzf-cd-widget

$ source /usr/local/opt/fzf/shell/key-bindings.zsh
```

```bash
# for Ubuntu
# install fzf & bind default key-binding
$ git clone --depth 1 https://github.com/junegunn/fzf.git ~/.fzf
$ ~/.fzf/install
$ source ~/.zshrc

# install fd, url from https://github.com/sharkdp/fd/releases
$ wget https://github.com/sharkdp/fd/releases/download/v7.2.0/fd_7.2.0_amd64.deb
$ sudo dpkg -i fd_7.2.0_amd64.deb

# alter filefind to fd
$ vim ~/.zshrc
export FZF_DEFAULT_COMMAND='fd --type file'
export FZF_CTRL_T_COMMAND=$FZF_DEFAULT_COMMAND
export FZF_ALT_C_COMMAND="fd -t d . "

$ source ~/.zshrc

# Ctrl+R History command; Ctrl+R file catalog
# if you want to DIY key of like 'Atl + C'
# maybe line-num is not 64, but must nearby
$ vim ~/.fzf/shell/key-bindings.zsh
- 64 bindkey '\ec' fzf-cd-widget
+ 64 bindkey '^\' fzf-cd-widget

$ source ~/.fzf/shell/key-bindings.zsh
```

#### `Preview`

特别介绍一下 Preview 功能

我们知道在 Unix 环境下 我们要看文件的时候 必须一个个打开 当文件数量较大的场景

比如说 我们调了 10 个参数 做了 20 组实验 每组实验拿到 30 轮结果 这时候 一个个 vim 开 怕不是要吐了 这时候你是不是开始怀念有 GUI 的世界

当然 你可以写个 bash 脚本 把所有的文件合到一个文件 然后 只看一个 file 就行了

fzf 给出了另外一个`炫酷`的解决方案

利用`fzf --preview` 完成对文件的预览 详见上节右侧视频

```bash
# set alias
$ vim ~/.zshrc
alias pp='fzf --preview '"'"'[[ $(file --mime {}) =~ binary ]] && echo {} is a binary file || (highlight -O ansi -l {} || coderay {} || rougify {} || cat {}) 2> /dev/null | head -500'"'"
alias oo='fzf --preview '"'"'[[ $(file --mime {}) =~ binary ]] && echo {} is a binary file || (highlight -O ansi -l {} || coderay {} || rougify {} || tac {}) 2> /dev/null | head -500'"'"  # flashback
$ source ~/.zshrc
```

设置完别名之后 利用 `pp` 即可完成文件的预览 `oo` 用于倒叙预览文件 在一些流数据文件中比较方便

还有 dalao 利用 fzf 做 git branch 更改比较的预览 更多的酷炫的功能详见 [fzf Document](https://github.com/junegunn/fzf)

### `vim`

vim 配置的必要性 想来不用说了

当然 最重要的是熟练运用 vim 的快捷键

vim 不只是一个文本编辑器 它的功能 和 sublime 基本一致 只要配置的好 一样神器

vim 也有它自己的包管理器`:PlugInstall` [参考 Vim Plugin Manager](https://github.com/junegunn/vim-plug)

```bash
# At first of all, we shoudld install vimrc, the ultimate configuration of Vim
# Ref https://github.com/amix/vimrc
$ git clone --depth=1 https://github.com/amix/vimrc.git ~/.vim_runtime
$ sh ~/.vim_runtime/install_awesome_vimrc.sh
```

其实 简单的配置 到这里 就结束了 但 比如说 你想要有可以鼠标控制光标 等 功能 就需要继续配置了

```vim
$ vim ~/.vimrc
set runtimepath+=~/.vim_runtime
set nocompatible               " 去掉有关vi一致性模式，避免以前版本的bug和局限
set nu!                        " 显示行号
set history=1000               " 记录历史的行数
set autoindent                 " vim使用自动对齐，也就是把当前行的对齐格式应用到下一行(自动缩进）
set cindent                    " cindent是特别针对 C语言语法自动缩进
set smartindent                " 依据上面的对齐格式，智能的选择对齐方式，对于类似C语言编写上有用
set tabstop=4                  " 设置tab键为4个空格，
set ai!
set showmatch                  " 设置匹配模式，类似当输入一个左括号时会匹配相应的右括号
set guioptions-=T              " 去除vim的GUI版本中得toolbar
set vb t_vb=                   " 当vim进行编辑时，如果命令错误，会发出警报，该设置去掉警报
set ruler                      " 在编辑过程中，在右下角显示光标位置的状态行
set incsearch
set mouse=a                    " 鼠标控制光标

source ~/.vim_runtime/vimrcs/basic.vim
source ~/.vim_runtime/vimrcs/filetypes.vim
source ~/.vim_runtime/vimrcs/plugins_config.vim
source ~/.vim_runtime/vimrcs/extended.vim

try
  source ~/.vim_runtime/my_configs.vim
catch
  endtry

call plug#begin('~/.vim/plugged')   " 设置完:PlugInstall 参考 https://github.com/junegunn/vim-plug

call plug#end()

let g:seoul256_background = 236     " theme
silent! colo seoul256
```

**特别注意 配置完之后 一定不要 `source ~/.vimrc`**

source 是用来令 sh 生效的 vimrc 并不是 so 只需要配置好 放在那就行了 你下次 进入 vim 的时候 就知道 配置对不对了

再送大家一些在 brew 中我觉得特别好用的包

```vim
$ mycli -u root -h localhost       # mysql client
$ tree -I '__pycache__|venv|data'  # product file tree without 'venv' 'data' '__'
```

## Vscode

> **VSCode 真香**
>
> **VSCode 真香**
>
> **VSCode 真香**

<center><img width="300" src="https://cdn.nlark.com/yuque/0/2019/gif/104214/1556892046025-2a0af4ce-a131-4164-91de-8bdd607e18e0.gif"></center>

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

这里用到的是`Formatting Toggle` + `Prettier`这个插件，支持的文件类型还是比较多的，比如给 markdown 表格自动格式化，这还是挺酷炫的

![image](https://cdn.nlark.com/yuque/0/2019/gif/104214/1556736489258-0dd9ae24-bda1-4e4d-b2aa-f5af581f763e.gif)

```json
{
  "formattingToggle.activateFor": ["formatOnSave"],
  "editor.formatOnSave": true,
  "files.autoSave": "onFocusChange"
}
```

### File Header

这个用了`psioniq File Header`, 文档还是比较详细的，但配置十分繁琐，弄了好长时间，还给作者发邮件，hhh

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

虽然提供了在 Output 中输出运行结果的插件`Code Runner`

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

`Local History`

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

然后比较推荐的时候 Vscode 的 Live Share, 这是我队友给我推荐的

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

## Alfred

`Alfred` 是一个优于自带的 spotlight 的 搜索工具

比较喜欢它的 `粘贴板` 和 `workflow拓展`

### `Clipboard`

比如说 我之前 从某个网站上面 复制了 一个文本 但我现在 只记得 关键词 想找下 复制的内容 这个时候 就很 nice 了 只需要 ⌘+Option+C 和我们平时复制的快捷键 几乎一模一样

这样效率 提升 挺明显的

![图片.png | center | 556x500](https://cdn.nlark.com/yuque/0/2019/png/104214/1547036437451-e3ce1e14-5e5b-47c2-9f3a-519059356536.png)

~~在哪下载 maybe [xclient](http://xclient.info) 不要说 我告诉你的~~

### `workflow`

`workflow` 相当于 iOS 的的`Shortcuts捷达`

通过 提前 设置好 程序流程 然后 主要 相应的命令就能启动

- [有道翻译](https://github.com/wensonsmith/YoudaoTranslate)

因为用了有道智云的 API 相对于单机版的 yd 精度提升很高 (支持句粒度的 Translation)

当然 需要去智云注册 然后配置一下

![图片.png | center | 556x500](https://cdn.nlark.com/yuque/0/2019/png/104214/1547030914904-bc56f564-f7f9-48ed-b12e-748508bc6d66.png)

- [AlfredMagic](https://github.com/CoderMageFox/alfredMagic)

比较好用的就是变量名翻译

妈妈再也不怕 我想不出 变量名了 还支持 React/Vue/mdn 文档查询 `StackOverflow` 查询

![图片.png | center | 556x500](https://cdn.nlark.com/yuque/0/2019/png/104214/1547031044390-c22a00ef-3742-4cc2-a3a6-7034a4978cf1.png)

## Sublime

[`Sublime License` 需要的自取](http://appnee.com/sublime-text-3-universal-license-keys-collection-for-win-mac-linux/)

除了 `Java`是在 IntelliJ `IDEA` 里写的 毕竟打 jar 那个参数 有点多

`sublime`又轻又好用 为啥不用呢

有 dalao 问我为啥不用 VsCode 主要是不好看(~~不直接说 丑 不是 留点面子吗~~) 换了好几个配色 找不到 自己看的顺眼的

反正我用起来 `sublime` 好用的多

![图片.png | center | 556x500](https://cdn.nlark.com/yuque/0/2019/png/104214/1547036345011-227c4b1d-7dd4-4b8b-8d5d-eb6d4650461e.png)

1. 敲 c 特别友好 一键 for 一键 class
2. 配置之后 可以保存时 自动 调整格式
3. c 编译方便 Ctrl+B

Tools->Build System -> New Build System

copy 以下 保存为 c++.sublime-build

```vim
{
  "cmd": ["bash", "-cpp", "g++ -std=c++11 '${file}' -o '${file_path}/${file_base_name}' && open -a Terminal.app '${file_path}/${file_base_name}'"],
  "working_dir":  "$file_path",
  "file_regex": "^(..[^:]*):([0-9]+):?([0-9]+)?:? (.*)$",
  "selector": "source.c, source.c++",
}
```

然后在 Tools->Build System 选择刚才设置的 c++

附上 Preferences

```vim
{
    "auto_find_in_selection": true,
    "bold_folder_labels": true,
    "color_scheme": "Packages/Color Scheme - Default/Mariana.sublime-color-scheme",
    "default_line_ending": "unix",
    "dpi_scale": 1.0,
    "draw_minimap_border": true,
    "ensure_newline_at_eof_on_save": true,
    "fade_fold_buttons": false,
    "font_face": "Microsoft YaHei Mono",
    "font_size": 13,
    "highlight_line": true,
    "highlight_modified_tabs": true,
    "ignored_packages":
    [
        "SublimeTmpl",
        "Vintage"
    ],
    "save_on_focus_lost": true,
    "theme": "Default.sublime-theme",
    "translate_tabs_to_spaces": true,
    "trim_automatic_white_space": true,
    "trim_trailing_white_space_on_save": true,
    "update_check": false,
    "word_wrap": "true"
}
```

## Other

其他有趣的 Software，比如说:

- `Path Finder`: 文件管理器
  ![图片.png | center | 556x500](https://cdn.nlark.com/yuque/0/2019/png/104214/1547034513313-b879fca9-eee1-4d61-9cf3-62c810118244.png)
- `Pdf Expert`: pdf 阅读器 可以直接按原有样式修改文本
  ![图片.png | center | 556x500](https://cdn.nlark.com/yuque/0/2019/png/104214/1547036482232-6fe8ef65-f2c1-4c41-9b3f-12e4acda4745.png)
- `Vanilla`|[`dozer`](https://github.com/Mortennn/Dozer): 菜单栏折叠 `感谢@iveevil su dalao推荐dozer`
- `Things`: 一个 Todo list 工具 可以考虑结合[Alfred 的 workflow 使用](https://github.com/xilopaint/alfred-things)
  ![图片.png | center | 556x500](https://cdn.nlark.com/yuque/0/2019/png/104214/1547036998132-f818ba53-88fb-4d20-93ae-a8efd3dd6444.png)
- `Contexts`: 窗口切换管理
  ![图片.png | center | 556x500](https://cdn.nlark.com/yuque/0/2019/png/104214/1548228993728-6d4d93b9-1f09-4db7-a43e-063c9575ecd7.png)
- `Typora`: 显式 Mardown 编辑器
  ![图片.png | center | 556x500](https://cdn.nlark.com/yuque/0/2019/png/104214/1548229136266-b4aa62e5-8f6b-49cf-992c-6bb23b578adf.png)
- `Magnet|Moom`: 分屏工具
- `ShadowsocksX-NG`: [load from GitHub](https://github.com/shadowsocks/ShadowsocksX-NG/releases), [node from portal.shadowsocks.nu](https://portal.shadowsocks.nu/aff.php?aff=15601) 这个 不需要多说(~~逼乎、CSDN、简书都发不了~~)

## QA

1. what is the benefit of `PDF Expert` with `Preview`?

> Q@Carlos Ouyang:
> 我觉得 pdf expert 比不上原生的 preview 啊？
> pdf 我一直都只是看，做做标记，根本不需要改原文，原生的就能完成我的需求
> 而且 preview 占用的系统资源极低，我打开一个 1000 多页的 pdf，expert 占用内存 1.13g，preview40 多 m
> 快速滑动的时候，preview 能看到闪动的文字，expert 变成了马赛克样式的背景图，等到速度放慢下来了 才会恢复成文字
> 主要是想了解一下，expert 还有我不知道的优点吗?

> A@gunjianpan:
>
> 1. **高清晰度的截图** 尤其是你需要 copy 一些 paper 上的 画的比较复杂的图 它能保证足够高的还原度 这个在做 paper 整理的时候 用的比较多 注意这个 copy 过来是 png 做 PPT 特别给力
> 2. **内部跳转** 回跳按钮 当 paper 内部有章节引用 或者 你想查一下注脚引用的 paper 可以方便的来回切换 不用怕找不到原来看到哪里了
> 3. **更方便的标注** 菜单切换更简洁 尤其是和 touch bar 一起用
> 4. pdf expert 更出名的可能还是它的**编辑功能** 包括图片编辑 保持原文样式编辑
> 5. 至于**占用资源**这件事情 开多确实 占内存 但你要相信 MacOs 的内存管理呀 我跑程序的时候 内存飙到 120GB 都正常使用 如果你长久不用它会帮你放到 swap 区的 我开 pdf expert 差不多 占 1G 如果内存是 8G 的可能会有点难受
> 6. 然后那个快速 滑动 的情况 我刚才试了一下 只要足够快 两个都会显示不出来 只不过 pdf expert 显示的是背景马赛克 preview 显示的是灰底 毕竟都要渲染的 另外 如果你那么快拉 pdf 还不如 用 go to; PDF Expert 的 goto 就在右下角 特别方便
>    这是 我 使用下来的感受 不知道 能不能 回答你的问题

2. How do you makre video

> Q@gunjianpan:
> 哇 要吐槽一下 Mac 的 Pr
> 本来想学校土豪买了 Adobe 全家桶
> 没想到 会用的这么累
>
> 1. 用`Gifox`录屏 这个产生的 Gif 大小比较小
> 2. 用 Pr 做字幕
> 3. 然后就发现保存的 Gif 大小 爆炸了 即使用`imageOptim`(使用`gifsicle`引擎的 software 实证表明效果比命令行敲`gifsicle`要好) 也要 18MB
> 4. 就想能不能先转 mp4 再转 gif 用了好多软件 后来发现`ffmpeg`最好用 (`brew install; ffmpeg -i xxx.mp4 xxx.gif`)
> 5. 生成的 gif 再过一遍`imageOptim`就能用了 心累

🙇**_欢迎 大神 补充_**
