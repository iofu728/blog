---
title: 试谈Linux下的线程调度-『Linux 源码解析（一）』
date: 2019-03-10 17:10:10
tags: [Linux]
description: Linux 线程调度
---

开学之后，作息一直很`局促`，喘不过气来

借着高操这门课，应该会把Linux源码好好读一读

今天先借胆来谈一下Linux下的线程调度策略

PS: 以下解析的Linux kernel版本号为`4.19.25`

> Thread schedule

## Motivation

首先，`为什么`要有线程调度这种东西

主要是因为人民日益增长的`CPU需求`和同落后的`I/O速度`之间的矛盾

为了不让没准备好的CPU上战场，也为了降低进程之间的通信成本

设计了一套线程状态体系，从`三状态`，`五状态`，到`七状态`

于是因为线程带上了这些状态，就需要根据状态对线程进行一系列的操作

一开始想的挺好的，把线程按状态分堆之后，各个状态应该井然有序的工作

但事实上，随着工业技术的发展，线程数量已经到了一个十分恐怖的数量，

如何公平的调度，更高效的调度，这成为了设计OS的一个难点

传统的线程调度算法有`SJF(短作业优先)`，`SRTN(最短剩余时间优先)`, `HRRN(最高响应比优先)`, `RR(轮转)`, `HPF(优先级)`等等

这些算法都有自己的有点，也有自己的缺点

## CFS

Linux使用的是`带时间片`的`动态优先级抢占式`调度模式, 被称之为公平调度CFS的算法

利用nice值+实时优先级+时间片共同维护线程的优先级

而这个优先级队列，也就是就绪态队列，Linux是用`红黑树`来维护的
(回想一下Java的`CurrentHashMap`和Linux kernel的`schedule`都是维护红黑树，所以DS要学学好呀)

Linux中对nice的处理和Unix不太一样

在Unix中如果有两个同nice值的进程，那么他们都将分配到一半的时间片，一般为5ms的时间，在这段时间内CPU完全属于占用的进程

理想状态下线程调度应该实现均衡划分任务，对待相同优先级的进程应该是共同使用这段时间片10ms，各占有CPU一半的能力

于是Linux就提出公平算法CFS，通过计算所有就绪态进程的需要CPU时间，计算出一个总的CPU需要时间

根据这个CPU时间去尽可能根据各个进程的实际需要来进行分配，而原来在Unix中直接当做优先级的nice值现在用于分配各个进程实际使用权重的标准

其具体的计算公式见右weight = 1024/(1.25^nice)

可以发现，这样的转换能保证各个进程间权重比与nice的差值之间保持一致

这样就能减小原来在Unix中单纯使用nice值进程权重划分造成的权重与nice值绝对大小有较大关系的情况

## Souce code

CFS的具体实现细节，需要对Linux kernel的源码进行阅读

通过对Linux kernel4.19.25代码的阅读，发现Linux关于线程调度的代码大致可分为`时间记录`，`进程选择`，`调度器入口`，`睡眠唤醒`，`抢占`五部分

其中有关`等待态`的操作主要针对`红黑树`进行操作，有关`挂起态`的主要是`链表`的操作

### 时间记录

调度器需要记录当前调度周期内，进程还剩下多少时间片可用。

Linux中的调度器实体class定义于`<include/linux/sched.h>`文件中。

```c
struct sched_entity {
        /* For load-balancing: 负责使得调度尽量均衡的模块 */
        struct load_weight          load; // 优先级
        unsigned long               runnable_weight; // 就绪态中的权值
        struct rb_node              run_node; // 红黑树节点
        struct list_head            group_node; // 所在进程组
        unsigned int                on_rq; // 是否在红黑树队列中

        u64                         exec_start; // 线程开始时间
        u64                         sum_exec_runtime; // 线程总运行时间
        u64                         vruntime; // 虚拟运行时间
        u64                         prev_sum_exec_runtime; // 上个调度周期总运行时间

        u64                         nr_migrations;

        struct sched_statistics     statistics;
};
```

上面的代码中有一项叫做`vruntime`，直译就是虚拟运行时间，简单的理解可以认为是带权的运行时间，利用一个权值来控制时间的快慢(好像有点恐怖 🐸)

CFS利用vruntime来记录当前进程运行时间以及还需要运行的时间。其源码位于`<kernel/sched/fair.c>`
```c
/*
 * Update the current task's runtime statistics.
 */
static void update_curr(struct cfs_rq *cfs_rq)
{
        struct .sched_entity *curr = cfs_rq->curr;
        u64 now = rq_clock_task(rq_of(cfs_rq));
        u64 delta_exec;

        if (unlikely(!curr))
                return;
        // 获得最后一次Switch Thread至今耗时
        delta_exec = now - curr->exec_start;
        if (unlikely((s64)delta_exec <= 0))
                return;

        curr->exec_start = now; // 更新开始执行时间

        schedstat_set(curr->statistics.exec_max,
                      max(delta_exec, curr->statistics.exec_max));

        curr->sum_exec_runtime += delta_exec;
        schedstat_add(cfs_rq->exec_clock, delta_exec);

        curr->vruntime += calc_delta_fair(delta_exec, curr); // 计算vruntime
        update_min_vruntime(cfs_rq);

        if (entity_is_task(curr)) {
                struct task_struct *curtask = task_of(curr);

                trace_sched_stat_runtime(curtask, delta_exec, curr->vruntime);
                cgroup_account_cputime(curtask, delta_exec);
                account_group_exec_runtime(curtask, delta_exec);
        }

        account_cfs_rq_runtime(cfs_rq, delta_exec);
}
```

上述函数计算当前进程的已执行时间，存放于变量delta_exec，然后调用函数calc_delta_fair更新vruntime值

而计算好的vruntime值将会在后面用作FindNextToRun函数的判断。

### Next进程选择

选择NextThread是调度算法的核心。在Linux中，通过计算vruntime值来实现CFS算法。

在Linux中利用红黑树来维护可运行进程的队列。红黑树因为其自平衡的特性，在这个变vruntime的场景下特别适用，而且红黑树维护代价，遍历代价都比较低。

在这个红黑树上存储了Linux系统中所有可运行的进程，每个节点的值就是他们的vruntime值，那么这棵红黑树上最小的节点，就是其最左节点。

维护进程等待队列，就是对红黑树进行插入，删除操作

这一部分搜索红黑树寻找最小节点的代码也在`<kernel/sched/fair.c>`中。

![image](https://cdn.nlark.com/yuque/0/2019/png/104214/1552237622433-026b48b5-8312-4cf7-a3ba-cff18e9f2c0c.png?x-oss-process=image/resize,w_1492)

可以看出其维护了一些规则，比如说以前换出去过的进程优先级比较好，刚入队的进程需要单独比较一下（vruntime值可能还没有更新）。

就绪态进程队列的新增相对于红黑树插入新的节点。这一部分代码位于`<kernel/sched/fair.c>`的enqueue_entity函数中。

![image](https://cdn.nlark.com/yuque/0/2019/png/104214/1552237622440-32ad50ac-5fef-4c43-a6bd-2d612f8f908d.png?x-oss-process=image/resize,w_1492)

从上面的代码可以看出queue_entity()函数主要用于更新vruntime，队列信息等等。真正做红黑树插入的逻辑实际上在__queue_entity()函数中。

![image](https://cdn.nlark.com/yuque/0/2019/png/104214/1552237440869-122b85ce-960e-46f4-af56-a09f4bc68c7a.png?x-oss-process=image/resize,w_1492)

和插入相似的还有从队列中删除节点，这个就不再赘述。

### 调度器入口

Linux在实现进程调度的时候提供了一个统一的调度器入口，在这个入口中选择最高优先级的调度类，每个调度类拥有自己的进程队列，相对于一个多队列调度算法。

关于调度器入口的代码定义在`<kernel/sched/core.c>`，以优先级为序，依次检查每个调度类中的进程队列。

![image](https://cdn.nlark.com/yuque/0/2019/png/104214/1552237440888-cf98a8df-a30e-4119-8109-23c6debc0782.png?x-oss-process=image/resize,w_1492)

### 睡眠&唤醒

在Linux中进程的挂起态，分为两种，一种是能收到信号signal，一种是忽略signal。和就绪态用红黑树来维护不一样，这里的挂起态队列用一个简单的链表结构来实现。

具体来说是利用wait_queue_head的结构来构造一个等待队列。
```c
struct wait_queue_head {
        spinlock_t             lock; // 自旋锁保持一致性
        struct list_head       head;
};
```

挂起态和就绪态的转换涉及到红黑树出树+链表入队，链表出队+红黑树插入，部分代码和上面所述的就绪态队列维护一致

### 抢占

Linux的线程调度是可抢占的，在实际操作过程中抢占的现象十分普遍

比如说在Linux系统上开了一个vim编辑器，然后又在后台跑了一个shell命令，因为交互的实时性需要，你在vim中编辑的时候，就发生了抢占现象。

![image](https://cdn.nlark.com/yuque/0/2019/png/104214/1552237366707-27df9f98-52a1-4e47-92d5-0ec114915692.png?x-oss-process=image/resize,w_1492)


