---
title: 如何给码农👨‍💻‍的Mac开光
date: 2018-12-25 16:12:25
tags: [Bash]
description: some configuration skills for mac
---

> `惊闻`全球第一例UI攻击 于今日🎄 爆发
> 无数网站 的按钮 被套上了 奇奇怪怪的 缺口[如何看待 antd 圣诞节彩蛋事件？](https://www.zhihu.com/question/306858501)
> So `GUI`是靠不住的 `TUI` 才是王道
> 那么 有一台程序员👨‍💻‍必备的Mac的我们 应该如何配置Terminal 舞装💃我们的Mac呢

Ps: Ubuntu 基本思路与Mac相同 只是`brew` -> `apt-get`
PPS: 在这里特别感谢带我入门的`山川dalao` 🙇

> 这篇文章 的`Motivation` 主要是 因为 在生活中 总有 一些 friends 问我
> '为啥 我们 都是 Mac 怎么感觉你的 高端一点'
> 我总是 笑着 回答 我这个 是 `高级Mac`
> 实际上 这些 只是 配置的问题 配置好的 Mac 比 Win 好的 不是 一点点
> 当然 `配置` 只是 为了 更高效的work 本质上 是没什么玩意的 关键是养成 习惯 提高效率

当然 由于篇幅的原因 只能 讲一些 我觉得 最能提高工作效率的 工具 欢迎 大神 补充

## zsh

> iTerm2 + zsh + fzf

Terminal 是 进入 Unix的 入口

但MacOs 自带的 Terminal 在 功能上 不够强大 一般都会用`iTerm` 替代

Advantage:
* 🤓可定制化Hotkey, 一键召出iTerm2 (不再需要⌘+Tab 或者 通过spotlight切换)
* 快捷的组合键
    + ⌘+Shift+E 召唤时间线
    + ⌘+T 新Tab
    + ⌘+D 水平分屏
    + ⌘+← 切换Tab / ⌘+shift+← 切换分屏

总之 就是 `好看` `好用`

先来看下效果图

![图片.png | center | 556x500](https://cdn.nlark.com/yuque/0/2018/png/104214/1545723661379-d9058300-82e4-4286-a4e2-15d7f5abedee.png "")

关于Bash 的配置 我的想法 就是 `好看` 第一 `好用`也第一 hhh👵

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
$ brew install zsh git autojump
$ chsh -s /bin/zsh

# install on-my-zsh
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
    zsh-autosuggestion  # autosuggestion
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

iTerm2 相较于 Terminal 我个人工具 最大的区别 就是可以设置快捷键 一键召唤

> Preferences -> Keys -> Hotkey

再送大家一些在terminal中我觉得特别好用的包
```vim
$ mycli -u root -h localhost       # mysql client
$ tree -I '__pycache__|venv|data'  # product file tree without 'venv' 'data' '__'
```

### fzf-zsh

`fzf` 是一个`查找文件` `历史命令查询` `快速进入目录` 插件
`fzf-zsh` 是fzf 在zsh中的一个应用

![图片.png | center | 556x500](https://cdn.nlark.com/yuque/0/2018/gif/104214/1545833258538-a74c08bd-6007-4fc2-b36a-c4dd2f140959.gif "")

左侧是`Ctrl+R`历史命令查询👏(支持间断匹配) 右侧是`^\`(默认`Alt+C`)快速进入目录 回车之后 直接进入

```bash
# install fd
$ brew install fd

# install fzf
$ git clone https://github.com/junegunn/fzf.git $ZSH_CUSTOM/plugins/fzf
$ ${ZSH}/custom/plugins/fzf/install --bin

# install fzf-zsh
$ git clone https://github.com/Wyntau/fzf-zsh.git $ZSH_CUSTOM/plugins/fzf-zsh

$ vim ~/.zshrc
plugins=(
    fzf-zsh        # add that
)

export FZF_DEFAULT_COMMAND='fd --type file'
export FZF_CTRL_T_COMMAND=$FZF_DEFAULT_COMMAND
export FZF_ALT_C_COMMAND="fd -t d . "

# end of edit ~/.zshrc
$ source ~/.zshrc

# Ctrl+R History command; Ctrl+R file catalog
# if you want to DIY key of like 'Atl + C'
$ vim ~/.oh-my-zsh/custom/plugins/fzf/shell/key-bindings.zsh
66 bindkey '^\' fzf-cd-widget
```
## vim

vim 配置的必要性 想来不用说了

当然 最重要的是熟练运用 vim的快捷键

vim不只是一个文本编辑器 它的功能 和 sublime基本一致 只要配置的好 一样神器

vim也有它自己的包管理器`:PlugInstall` [参考 Vim Plugin Manager](https://github.com/junegunn/vim-plug)

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
colo seoul256
```

**特别注意 配置完之后 一定不要 `source ~/.vimrc`**

source 是用来令sh生效的 vimrc并不是 so 只需要配置好 放在那就行了 你下次 进入vim的时候 就知道 配置对不对了

## Alfred

`Alfred` 是一个优于自带的spotlight 的 搜索工具

比较喜欢它的 `粘贴板` 和 `有道词典功能`

比如说 我一次性 复制了 10项 然后 切换窗口后 可以在这个窗口内 不断的 粘贴

这样效率 提升 挺明显的

![图片.png | center | 556x500](https://cdn.nlark.com/yuque/0/2018/png/104214/1545835212225-9300d76d-2933-4215-8454-49c4585ca7c2.png "")

在哪下载 maybe [xclient](http://xclient.info)

## Sublime

除了 Java是在IntelliJ IDEA 里写的 毕竟打jar那个参数 有点多

sublime又轻又好用 为啥不用呢

![图片.png | center | 556x500](https://cdn.nlark.com/yuque/0/2018/png/104214/1545830736293-6bb13041-6150-4adb-a7b0-ee4d7417c09e.png "")

1. 敲c特别友好 一键for 一键class
2. 配置之后 可以保存时 自动 调整格式
3. c编译方便 Ctrl+B

Tools->Build System -> New Build System

copy以下 保存为c++.sublime-build
```vim
{
  "cmd": ["bash", "-cpp", "g++ -std=c++11 '${file}' -o '${file_path}/${file_base_name}' && open -a Terminal.app '${file_path}/${file_base_name}'"],
  "working_dir":  "$file_path",
  "file_regex": "^(..[^:]*):([0-9]+):?([0-9]+)?:? (.*)$",
  "selector": "source.c, source.c++",
}
```
然后在Tools->Build System选择刚才设置的c++

附上Preferences
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

其他有趣的Software，比如说:
* `Path Finder`: 文件管理器
* `Pdf Expert`: pdf 阅读器 可以直接按原有样式修改文本
* `Vanilla`: 菜单栏折叠
* `ShadowsocksX-NG`: [load from GitHub](https://github.com/shadowsocks/ShadowsocksX-NG/releases), [node from portal.shadowsocks.nu](https://portal.shadowsocks.nu/aff.php?aff=15601)






