---
title: nohup
date: 2018-10-02 13:18:43
tags: [Linux]
description: nohup 探究
---

`nohup` = `no hang up`
作用在当用户从终端页面退出时，程序任务仍可以保持运行

那为何nohup可以实现这个功能呢

Ps:这篇可能会比较硬，写(chao)的时候也是头疼的很，感谢山川dalao的[解惑文档](http://note.youdao.com/noteshare?id=c08e1ced9ac5b3d48aa819d65c802c37)

## signal
在讲之前，我们需要对Linux的信号处理体系有一点了解

> Signal是在一种软件体系下对中断的模拟，所以也被称为软中断。

Signal是进程间通信机制中唯一的异步通信机制。

与其他进程间通信方式（管道pipeline、共享内存等）相比，信号所能传递的信息比较粗糙，只是一个整数。
但正是由于传递的信息量少，信号也便于使用和管理，可以用于系统管理相关的任务，例如通知进程终结、中止或者恢复等。

信号可分为[可靠、不可靠，实时、非实时](https://www.ibm.com/developerworks/cn/linux/l-ipc/part2/index1.html)。其主要区别是Unix与后来改进版Linux信号的差别。

进程对信号的响应可分为[忽略、捕捉、缺省](https://www.ibm.com/developerworks/cn/linux/l-ipc/part2/index1.html)三种。

发送信号的主要函数有：[kill()、raise()、 sigqueue()、alarm()、setitimer()以及abort()](https://www.ibm.com/developerworks/cn/linux/l-ipc/part2/index1.html)

每种信号用一个整型常量宏表示，以SIG开头，比如SIGCHLD、SIGINT等，它们在系统头文件中定义。

内核中针对每一个进程都有一张表来保存信号。

在进程`task_struct`结构体中有一个未决信号的成员变量`struct sigpending pending`。

每个信号在进程中注册都会把信号值加入到进程的未决信号集。

当内核需要将信号传递给某个进程时，就在该进程对应的表中写入信号，这样就生成了信号。

* 非实时信号发送给进程时，如果该信息已经在进程中注册过，不会再次注册，故信号会丢失；
* 实时信号发送给进程时，不管该信号是否在进程中注册过，都会再次注册。故信号不会丢失；

信号在从`内核态`切换至`用户态`时，进行处理。

当该进程由用户态陷入内核态，再次切换到用户态之前，会查看表中的信号。如果有信号，进程就会首先执行信号对应的操作，此时叫做执行信号。

从生成信号到将信号传递给对应进程这段时间，信号处于等待状态。

我们可以编写代码，让进程阻塞block某些信号，也就是让这些信号始终处于等待的状态，直到进程取消阻塞unblock或者忽略信号。

## processes

在远程主机上，有两个相关的进程：

1. ssh守护进程（sshd）的一个实例，它将远程程序的输入和输出中继到本地终端;
2. 进程组，用于维护各种bash命令(bash也是一个进程);
  * 每个进程属于一个进程组
    + 同组中的进程作为一个命令管道的一部分，例如`cat file | sort | grep 'word'`将放置在运行`cat(1)，sort(1), grep(1)`的进程组里
  * bash也是一个进程，也属于一个进程组
  * 进程组是会话的一部分, 会话由一个或多个进程组组成
  * 在会话中，最多有一个进程组，称为前台进程组，可能还有许多后台进程组
  * bash将进程从后台移动到前台，从前台移动到后台通过tcsetpgrp(3)
  * 发送到进程组的信号将传递到该组中的每个进程。

## some concept
1. `tty`: 终端设备，Teletypes, 电传打字机
2. `pty`: 伪终端，虚拟终端
3. `pts/ptmx`: pts=pseudo-terminal slave, ptmx=pseudo-terminal master, 对master的操作会反映到slave上
4. `/dev/ttySn`: 串行端口终端。计算机把每个串行端口都看作是一个字符设备
  * 例如，echo test > /dev/ttyS1会把单词”test”发送到连接在ttyS1（COM2）端口的设备上
5. `/dev/pty`: 伪终端是成对的逻辑终端设备，例如/dev/ptyp3和/dev/ttyp3
  * 例如，telnet连接PC，则telnet程序会连接到设备ptyp2(m2)上。此时一个getty程序就应该运行在对应的ttyp2(s2)端口上
  + 当telnet从远端获取了一个字符时，该字符就会通过m2、s2传递给getty程序，而getty程序就会通过s2、m2和telnet程序往网络上返回”login:”字符串信息
6. `/dev/tty`: 控制终端，当前进程的控制终端的设备特殊文件，可以使用命令”ps –ax”来查看进程与哪个控制终端相连
  * shell中，/dev/tty就是使用的终端，设备号(5,0).使用命令”tty”可以查看它具体对应哪个实际终端设备
7. `/dev/ttyn`, /dev/console: 控制台终端

## sshd

首先得明白sshd过程

当sshd接收到shell命令，会创建一对pty(`master pty`, `slave pty`).(不明白的参考上一节)

sshd拥有`master pty`，那么shell会把`slave pty`作为shell程序的`stdin stdout stdeer`

对应的ssh命令就是 `ssh -t root@ip ls`(对主要就是 `-t`)

如果不使用pty, 则sshd会使用pipe作为与shell的关联，shell会把`stdin stdout stderr`变为`pipe`

那么为什么ssh这边的客户端关了之后，服务器运行的命令会关闭呢？

那是因为如果ssh客户端关闭了，`sshd`可以感知的到，则服务器端会把`master pty`关闭。

那么操作系统就会向`slave pty`发送`SIGNUP`信号，默认的信号处理方式就是终止

如果换成`pipe`，那么`sshd`也会关闭`pipe`的一端。如果此时客户端已经关闭，那么会收到一个`SIGNPIPE`信号，默认的处理函数是终止函数，所以只要程序不读写`stdin stdout stderr`那么不会退出

## `nohup`

再说说`nohup`

`nohup`的原理就是假装看不见`SIGNHUP`信号，同时把`stdin`重定向到`/dev/null` 把`stdout` `stderr` 重定向到`nohup.out`(重定向地址可以更改)

但是如果ssh是使用`pipe`方式的, 使用nohup发现没有效果，`stdin`还是`pipe`

那是因为`nohup`里面会对原有的`stdin` 做判断，只有是`istty` 才会把`stdin stdout stderr`替换掉

```bash
nohup command &
```
## `setsid`
换个角度思考，如果我们的进程不属于接受`SIGNHUP`信号的终端的子进程，那么自然也就不会受到 HUP 信号的影响了

`setsid` 就是利用这一点

```bash
setsid command
```
## `&`

如果把"&"放入“()”内之后，会发现所提交的job并不在jobs中,那么这样就能躲过`SIGNHUP`信号

```bash
$ (ping wyydsb.xin &)
$ ps -ef |grep wyydsb.xin
  501 18420 18140   0  6:50PM ttys003    0:00.02 watch curl https://wyydsb.xin
  501 18456 18140   0  6:51PM ttys003    0:00.23 watch -n 5 curl https://wyydsb.xin
  501 20519     1   0  8:46PM ttys005    0:00.01 ping wyydsb.xin
  501 20598 20528   0  8:47PM ttys008    0:00.00 grep --color=auto --exclude-dir=.bzr --exclude-dir=CVS --exclude-dir=.git --exclude-dir=.hg --exclude-dir=.svn wyydsb.xin
```

当然 这个 最好别<font color=#DC143C size=5>作死</font>去试

因为`PID=1`的是内核进程

然后启起来 你就发现`kill`不了 只能 重启了

## `disown`
如果 我们 起命令的时候忘记加nohup或者setsid，然后还想忽略SIGNHUP，只能通过作业调度和 disown 来解决问题了

* `disown -h jobspec`来使某个作业忽略`SIGNHUP`信号
* `disown -ah` 来使所有的作业都忽略`SIGNHUP`信号
* `disown -rh `来使正在运行的作业忽略`SIGNHUP`信号

## `screen`
如果有大量这种命令需要在稳定的后台里运行，如何避免对每条命令都做这样的操作呢？

* `screen -dmS session name` 建立一个处于断开模式下的会话（并指定其会话名）
* `screen -list`  列出所有会话
* `screen -r session name` 重新连接指定会话
* 快捷键`CTRL-a d` 暂时断开当前会话

## `systemd`

当然还可以把bash封装成一个服务运行在Linux上

## 参考

. [Paramiko](http://note.youdao.com/noteshare?id=c08e1ced9ac5b3d48aa819d65c802c37)
. [Why does running a background task over ssh fail if a pseudo-tty is allocated?](https://stackoverflow.com/questions/32384148/why-does-running-a-background-task-over-ssh-fail-if-a-pseudo-tty-is-allocated)
. [ssh command unexpectedly continues on other system after ssh terminates](https://unix.stackexchange.com/questions/39605/ssh-command-unexpectedly-continues-on-other-system-after-ssh-terminates)
. [What causes various signals to be sent?](https://unix.stackexchange.com/questions/6332/what-causes-various-signals-to-be-sent/6337#6337)
. [SIGNAL(7)](http://man7.org/linux/man-pages/man7/signal.7.html)
. [Linux 技巧：让进程在后台可靠运行的几种方法](https://www.ibm.com/developerworks/cn/linux/l-cn-nohup/index.html)
. [Linux环境进程间通信](https://www.ibm.com/developerworks/cn/linux/l-ipc/part2/index1.html)
. [Linux信号(signal)机制](http://gityuan.com/2015/12/20/signal/)







