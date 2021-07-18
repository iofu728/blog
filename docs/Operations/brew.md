---
title: brew | brew cask | yum | apt-get
date: 2018-10-07 06:10:52
tags: [Operations]
description: 包管理器概述
---

用过 Mac 的肯定 或多或少的 用过 brew 这个命令

在我之前的印象里 这个命令就好像
Ubuntu 里的 apt-get
Centos 里的 yum

都是属于那种 Linux 下包管理器

那他们之间有什么区别呢？

**先下结论:**
源码包安装: brew
二进制包安装: yun | apt-get

## 源码安装

首先回顾一下什么是源码安装

从命令上来看源码安装一般形式如下:

```bash
wget https://xxx.com/latest.tar.gz
tar -zxvf latest.tar.gz -C /usr/src
cd /usr/src/xxxx
./configure
make && make install
```

wget tar 应该是显而易见的，分别代表下载和解压命令

### ./configure

那么 configure 是一个怎样的命令

```vim
#!/bin/sh
SUFFIX=""
DRYRUN="false"
VERBOSE="false"
EXE=""
THERE=`dirname $0`

# pick up any command line args to config
for i
do
case "$i" in
-d*) options=$options" --debug";;
-t*) DRYRUN="true" VERBOSE="true";;
-v*) VERBOSE="true";;
-h*) DRYRUN="true"; cat <<EOF
Usage: config [options]
 -d     Build with debugging when possible.
 -t     Test mode, do not run the Configure perl script.
 -v     Verbose mode, show the exact Configure call that is being made.
 -h     This help.

Any other text will be passed to the Configure perl script.
See INSTALL for instructions.

EOF
;;
*)  i=`echo "$i" | sed -e "s|'|'\\\\\\''|g"`
    options="$options '$i'" ;;
esac
...
```

可以看出实际上 configure 是一个 shell 脚本，一般这个脚本都很长，目前看到最小的也有 1k 行

其主要作用就是检查编译环境，是否满足编译条件，是否有需要的预装软件

如果条件一切正常 则会生成 MakeFile 文件 供下一步 make 使用

当然有些包的 configure 文件可能只是一个重定向文件，真正的 sh 藏在 bootstrap 文件中

```vim
#!/bin/sh
cmake_source_dir=`cd "\`dirname \"$0\"\`";pwd`
exec "${cmake_source_dir}/bootstrap" "$@"
```

```bash
$ ./configure
checking whether to enable maintainer-specific portions of Makefiles... no
checking whether make supports nested variables... yes
checking whether to enable debug build options... no
checking whether to enable compiler optimizer... (assumed) yes
checking for path separator... :
checking for sed... /bin/sed
checking for gcc... gcc
```

configure 运行结束之后会

- 由 MakeFile.in 生成 MakeFile 文件
- 由 config.h.in 生成 config.h 文件
- config.log 日志文件
- config.cache 提高下一次 configure 的速度 需要-C 才生成
- config.status 实际调用编译工具构建软件的 shell 脚本

![图片.png | center | 556x200](https://cdn.nlark.com/yuque/0/2018/png/104214/1538880946361-2fb09cb3-c74d-4dad-ad69-72e197c63272.png)

make - 即利用 gcc 对.h 文件进行编译 输出可执行文件

然后利用 make install 则是进行软链接之类的操作，把安装得到的可执行文件，放到合适的位置

### autoconf

实际上这一套体系叫做 GNU build system

是为了跨平台安装 而提出的 以提高代码的可移植性

作为一个底层码农肯定体会过配置环境的艰辛

对于软件开发者 为了适配所有环境写出的编译 sh 那肯定更加困难

> Unix 系统的分支复杂度很高，不同的商用版或开源版或多或少都有差异。这些差异主要体现在：系统组件、系统调用。我们主要将 Unix 分为如下几个大类：IBM-AIX HP-UX Apple-DARWIN Solaris Linux FreeBSD

为了规避写繁琐的 shell 脚本，有人开发了 autoconf 和 automake 这样的工具

autoconf 通过编写 configure.ac 来 configure 脚本

这个时候 configure.ac 就好写很多

```vim
AC_PREREQ([2.63])
AC_INIT([st], [1.0], [zhoupingtkbjb@163.com])
AC_CONFIG_SRCDIR([src/main.c])
AC_CONFIG_HEADERS([src/config.h])

AM_INIT_AUTOMAKE([foreign])


# Checks for programs.
AC_PROG_CC
AC_PROG_LIBTOOL

# Checks for libraries.

# Checks for header files.

# Checks for typedefs, structures, and compiler characteristics.

# Checks for library functions.

AC_CONFIG_FILES([Makefile
                 src/Makefile
                 src/a/Makefile
                 src/b/Makefile])
AC_OUTPUT
```

AC\_开头的类似函数调用一样的代码，实际是一些被称为“宏”的调用

这里的宏与 C 中的宏概念类似，会被替换展开

m4 是一个经典的宏工具，autoconf 正是构建在 m4 之上，可以理解为 autoconf 预先实现了大量的，用于检测系统可移植性的宏，这些宏在展开后就是大量的 shell 脚本

所以编写 configure.ac 只要对这些宏熟练掌握就可以了，成本较手写 shell 省事很多

GNU 还有很多生硬的内容，本文就点到为止，有需要的可以继续查阅相关资料

### brew

brew 是开发者为了在没有 GNU build system 下的情况下为了更好的跨平台安装 开发的一个包管理工具

和其他使用二进制包的依赖包管理工具不同的是

brew 是基于源码包管理

也是先遍历一遍依赖列表

先安装依赖包

最后安装所需包

安装时执行`./configure && make && make install`

### brew cask

brew cask 则是 brew 的一个扩展包

brew 主要面向命令行程序

brew cask 主要面向图形化程序

把这些程序用 brew cask 管理

使之也能用命令行进行方便的安装和卸载

## 二进制包安装

二进制包指的是已经经过编译好的，一般只需建立软链接，或者 rebuild 的代码包

一般二进制包的包名会较源码包长 会包含运行环境等相关信息

根据不同规范可以分为.rpm 包和.deb 包

### RPM

`RPM = RedHat Package Manager`

一开始是由 Red Hat 开发，之后被广泛采用的一种包管理策略

其主要思想就是把编译之后的文件及所需要的软件名称打包，安装时只需要去检查是否满足安装条件，无需编译，即可安装

其包名满足

```vim
%{NAME}-%{VERSION}-%{RELEASE}.%{ARCH}.rpm

NAME: rpm包名字
VERSION: rpm包版本号(主版本号.次版本号.测试号)
RELEASE: rpm包编译发布次数(第几次编译发布)
ARCH: cpu架构(比如i386和x86_64，i386兼容x86_64，noarch的代表一些列脚本)

比如nginx-1.4.0-24.x86.rpm，nginx-1.4.0-24.x86_64.rpm
```

### YUM

YUM 是基于 rpm 的包管理容器, 是一种 CS 架构的软件, **解决了包之间依赖的问题**

Server 端先对程序包进行分类后存储到不同 repository 容器中

再通过收集到大量的 rpm 的数据库文件中程序包之间的依赖关系数据, 把对应的依赖关系和所需文件存在说明文件(.xml 格式)里, 放在本地的 repodata 目录下供 Client 端取用

而 Cilent 端通过 yum 命令安装软件时发现缺少某些依赖性程序包, Client 会根据本地的配置文件(`etc/yum.repos.d/*.repo`)找到指定的 Server 端,

从 Server 端 repo 目录下获取说明文件 xxx.xml 后存储在本地`/var/cache/yum`中方便以后读取

通过`xxx.xml`文件查找到需要安装的依赖性程序包在 Server 端的存放位置

再进入 Server 端 yum 库中的指定 repository 容器中获取所需程序包, 下载完成后在本地实现安装

### apt-get

在介绍 agt-get 之前 先介绍下 dpkg

`dpkg = Debian package manager`

其余 rpm 原理几乎相同，使用文本文件作为数据库来维护系统中软件信息，包括文件清单, 依赖关系, 软件状态等,通常在`/var/lib/dpkg`目录下

在 status 文件中存储软件状态和控制信息

在 info 目录下备份控制文件， 并在`info/.list`文件中记录安装文件清单, 在`info/.mdasums`中保存文件的 MD5 码

那么 apt-get 就相当于中的 rpm 的 yum

做的是自动化获取安装包依赖的工作

`apt-get update` 过程

```vim
1. 执行apt-get update
2. 程序分析/etc/apt/sources.list
3. 自动连网寻找list中对应的Packages/Sources/Release列表文件，如果有更新则下载，存入/var/lib/apt/lists/目录
4. 然后 apt-get install 相应的包 ，下载并安装
```

`apt-get install` 过程

```vim
1. 扫描本地存放的软件包更新列表，找到最新版本包
2. 进行包依赖检查，找到所有需要的依赖包
3. 从源中下载相应的包并解压，建立软链接
```

## 参考

1. [brew 和 brew cask 有什么区别？](https://www.zhihu.com/question/22624898)
2. [apt-get 原理解析](jianshu.com/p/b2eed75b9855)
3. [深入理解 yum 工作原理](http://www.firefoxbug.com/index.php/archives/2777/)
4. [rpm 包制作](http://www.firefoxbug.com/index.php/archives/2776/)
5. [Linux 软件安装管理之——RPM 与 YUM 详解](https://www.jianshu.com/p/d021380f6d02)
6. [概念：GNU 构建系统和 Autotool](http://www.pchou.info/linux/2016/09/16/gnu-build-system-1.html)
