---
title: 数一数Linux中有多少种线程同步策略-『Linux 源码解析（二）』
date: 2019-03-24 16:11:31
tags: [Linux/Thread]
description: Linux 线程同步
---

本来这篇应该是上周发的，拖延症又犯了 🙈

上一篇主要讨论了[Linux 线程的调度算法](https://wyydsb.xin/Linux/schedule.html)

这篇来谈谈线程间的同步问题，暂时不包括`IPC(InterProcess Communication)`问题，IPC 还是很有趣的。

有趣的事情就要慢慢品对吧，留到下次再来谈 🌚（主要准备不过来 hhh 太真实了）

<center><img width="150" src="https://cdn.nlark.com/yuque/0/2019/png/104214/1553443429332-c9e3790c-cc68-446b-87a2-a9c2645f679a.png"></center>

PS: 以下解析的 Linux kernel 版本号为`4.19.25`

> Thread synchronization

## Motivation

为什么线程之间需要同步？

一个原因，同一个父进程下的所有子线程共享同一个 PC，同一个寄存器，同一个共享库(同一片天空)

所以当多个子线程同时对同一个变量进行操作的时候，就很有可能出现热点，甚至错误情况，这就是同步问题。

另外一个原因，很多时候线程之间执行情况实际上是有一定顺序的，下一个线程需要知道上一个线程有没有完成执行任务。

当然线程权限没有那么大，这些事情都是调度程序来做的，但线程有感知上一个线程完成与否的需求，这就是互斥问题。

所以，总的而言，线程同步主要解决的是同步互斥问题。

至于怎么解决，常见的套路主要是在栈中设立一个原子变量，通过抢占这个全部变量实现同步互斥。

具体而言，有`互斥量mutex`, `锁Lock`, `读写锁rwlock`, `条件变量Condition`, `屏障Barrier` etc.

## Souce code

> 这一部分代码比较多，有些还比较晦涩，Linux kernel4 以后的代码相较于 2.× 版本还有比较大的改动
> 然后在工程中，这一部分还是很有用的，比如所有线程安全都是基于互斥量这个概念实现的，再比如说写个 redis 锁 etc.
> 掌握这部分会对你维护多线程问题有所帮助！！！

Linux 的线程同步机制和 Nachos 中使用的机制(信号量，锁，条件变量)基本一致。采用了互斥量 mutex，条件变量，信号量，读写锁。

### `Mutex`

Linux 下通过声明一个 Mutex 的类来实现互斥量的实现。另外还声明了一个`ww_mutex`(wound/wait)来避免死锁

Linux kerenal 中关于 Mutex struct 的代码在`<include/linux/mutex.h>`中

```c
struct mutex {
        atomic_long_t           owner;     // mutex 获得的owner ID
                                           // 若==0, 则mutex未被占用;
                                           // 若> 0, 则mutex被此ownerId占用，
                                           // 只能由当前owner解mutex
        spinlock_t              wait_lock; // 自旋锁类型
#ifdef CONFIG_MUTEX_SPIN_ON_OWNER
        struct optimistic_spin_queue osq;  /* Spinner MCS lock */
#endif
        struct list_head        wait_list; // 等待队列
#ifdef CONFIG_DEBUG_MUTEXES
        void                    *magic;
#endif
#ifdef CONFIG_DEBUG_LOCK_ALLOC
        struct lockdep_map      dep_map;
#endif
};
```

上面的 struct 用一个原子变量`owner`来实现 mutex 的互斥效果, 这里已经和 kernel 2.× 版本不一样了。

当 owner 为 0 时，表示这个 mutex 还未被占用。当 mutex 不为零的时候，只能由 id == owner 的线程解除占用

另外定义了一个`wait_list`用于存储被 sleep 的 thread

这部分代码和 nachos 中 Semaphore 的设计基本一致

而具体实现 mutex 的代码位于`<kernel/locking/mutex.c>`中

`__mutex_init`函数主要做一些变量声明和初始化的工作。

```c
void
__mutex_init(struct mutex *lock, const char *name, struct lock_class_key *key)
{
        atomic_long_set(&lock->owner, 0);   // init atomic 变量 owner
        spin_lock_init(&lock->wait_lock);   // init 自旋锁类型变量
        INIT_LIST_HEAD(&lock->wait_list);   // init 等待队列变量
#ifdef CONFIG_MUTEX_SPIN_ON_OWNER
        osq_lock_init(&lock->osq);
#endif
        debug_mutex_init(lock, name, key);
}
```

以加锁为例，调用的的是 mutex_lock 函数。

```c
void __sched mutex_lock(struct mutex *lock)
{
        might_sleep();                       // 打印堆栈 debug sleep

        if (!__mutex_trylock_fast(lock))     // atomic获得owner, 如果能
                __mutex_lock_slowpath(lock); //
}
EXPORT_SYMBOL(mutex_lock);
#endif
```

其中，might_sleep()是一个全局 Linux API，主要用于在中断时候，debug 打印 context 堆栈，这个 API 在后面被广泛使用。

`__mutex_trylock_fast(lock)` 是一个去获取 lock 的 owner 的函数，如果能获取则返回 true

```c
static __always_inline bool __mutex_trylock_fast(struct mutex *lock)
{ww_acquire_ctx
        unsigned long curr = (unsigned long)current;
        unsigned long zero = 0UL;
        if (atomic_long_try_cmpxchg_acquire(&lock->owner, &zero, curr))  // 获取owner
                return true;
        return false;
}
```

如果有权限获取 owner 则

```c
static noinline void __sched
__mutex_lock_slowpath(struct mutex *lock)
{
        __mutex_lock(lock, TASK_UNINTERRUPTIBLE, 0, NULL, _RET_IP_);  // 调用__mutex_lock
}
```

然后再嵌套调用，不知道是为了什么，写了那么多层（可能是有别的地方 复用到了）

```c
static int __sched
__mutex_lock(struct mutex *lock, long state, unsigned int subclass,
             struct lockdep_map *nest_lock, unsigned long ip)
{
        // 调用__mutex_lock_common
        return __mutex_lock_common(lock, state, subclass, nest_lock, ip, NULL, false);
}
```

然后就到了 Linux 真正处理 mock_lock 的地方

```c
static __always_inline int __schedw
__mutex_lock_common(struct mutex *lock, long state, unsigned int subclass,// lock TASK_UNINTERRUPTIBLE 0
                    struct lockdep_map *nest_lock, unsigned long ip,      // NULL _RET_IP_
                    struct ww_acquire_ctx *ww_ctx, const bool use_ww_ctx) // NULL false
{
        struct mutex_waiter waiter;
        bool first = false;
        struct ww_mutex *ww;     // ww = wound/wait mutex 用于死锁检验
        int ret;

        might_sleep(); // 一样的去打印context的堆栈

        ww = container_of(lock, struct ww_mutex, base); // 获得ww_mutex
        if (use_ww_ctx && ww_ctx) {                     // mutet_lock进不到这个,ww_mutex_lock有可能进
                if (unlikely(ww_ctx == READ_ONCE(ww->ctx))) // ww_mutex获得的ctx和需要的ctx对比
                        return -EALREADY;

                /*
                 * Reset the wounded flag after a kill. No other process can
                 * race and wound us here since they can't have a valid owner
                 * pointer if we don't have any locks held.
                 */
                if (ww_ctx->acquired == 0)   // 如果ww_ctx没有被获得 则重设wounded 位
                        ww_ctx->wounded = 0;
        }

        preempt_disable();  // 设置不可抢占
        mutex_acquire_nest(&lock->dep_map, subclass, 0, nest_lock, ip); // 检查mutex 需要的条件

        if (__mutex_trylock(lock) ||                                  // 尝试上lock
            mutex_optimistic_spin(lock, ww_ctx, use_ww_ctx, NULL)) {  // 尝试上乐观锁
                /* got the lock, yay! */
                lock_acquired(&lock->dep_map, ip);                    // 上lock
                if (use_ww_ctx && ww_ctx)                             // ww_mutex_lock时
                        ww_mutex_set_context_fastpath(ww, ww_ctx);    // 设置上下文path
                preempt_enable();                                     // 解除不可抢占
                return 0;
        }
        spin_lock(&lock->wait_lock); // 对等待队列上自旋锁
        /*
         * After waiting to acquire the wait_lock, try again.
         */
        if (__mutex_trylock(lock)) {                                 // 那再试试呗 hhh
                if (use_ww_ctx && ww_ctx)
                        __ww_mutex_check_waiters(lock, ww_ctx);

                goto skip_wait;
        }

        debug_mutex_lock_common(lock, &waiter); // 掉一下debug模式下mutet_lock_common

        lock_contended(&lock->dep_map, ip);     // 去等锁

        if (!use_ww_ctx) {                      // mutex_lock时候
                /* add waiting tasks to the end of the waitqueue (FIFO): */
                __mutex_add_waiter(lock, &waiter, &lock->wait_list); // 加到wait_queue


#ifdef CONFIG_DEBUG_MUTEXES
                waiter.ww_ctx = MUTEX_POISON_WW_CTX;
#endif
        } else {
                /*
                 * Add in stamp order, waking up waiters that must kill
                 * themselves.
                 */
                ret = __ww_mutex_add_waiter(&waiter, lock, ww_ctx); // 加到ww_mutex的wait_queue
                if (ret)
                        goto err_early_kill;

                waiter.ww_ctx = ww_ctx;
        }

        waiter.task = current;

        set_current_state(state);  // 设置state
        for (;;) {                // 做了一个自旋操作 retry lock
                /*
                 * Once we hold wait_lock, we're serialized against
                 * mutex_unlock() handing the lock off to us, do a trylock
                 * before testing the error conditions to make sure we pick up
                 * the handoff.
                 */
                if (__mutex_trylock(lock))  // 等到了
                        goto acquired;

                /*
                 * Check for signals and kill conditions while holding
                 * wait_lock. This ensures the lock cancellation is ordered
                 * against mutex_unlock() and wake-ups do not go missing.
                 */
                if (unlikely(signal_pending_state(state, current))) { // if state不对
                        ret = -EINTR;
                        goto err;
                }

                if (use_ww_ctx && ww_ctx) {  // 如果是ww_mutex 且 wait_queue 有需要被kill掉的
                        ret = __ww_mutex_check_kill(lock, &waiter, ww_ctx);
                        if (ret)
                                goto err;
                }

                spin_unlock(&lock->wait_lock); // 解自旋锁
                schedule_preempt_disabled();   // 解除不可抢占

                /*
                 * ww_mutex needs to always recheck its position since its waiter
                 * list is not FIFO ordered.
                 */
                if ((use_ww_ctx && ww_ctx) || !first) {
                        first = __mutex_waiter_is_first(lock, &waiter);
                        if (first)
                                __mutex_set_flag(lock, MUTEX_FLAG_HANDOFF);
                }

                set_current_state(state); // update state
                /*
                 * Here we order against unlock; we must either see it change
                 * state back to RUNNING and fall through the next schedule(),
                 * or we must see its unlock and acquire.
                 */
                if (__mutex_trylock(lock) || // 再试一次
                    (first && mutex_optimistic_spin(lock, ww_ctx, use_ww_ctx, &waiter)))
                        break;

                spin_lock(&lock->wait_lock);
        }
        spin_lock(&lock->wait_lock);
acquired:
        __set_current_state(TASK_RUNNING);

        if (use_ww_ctx && ww_ctx) {
                /*
                 * Wound-Wait; we stole the lock (!first_waiter), check the
                 * waiters as anyone might want to wound us.
                 */
                if (!ww_ctx->is_wait_die &&
                    !__mutex_waiter_is_first(lock, &waiter))
                        __ww_mutex_check_waiters(lock, ww_ctx);
        }

        mutex_remove_waiter(lock, &waiter, current); // 从等待队列中remove
        if (likely(list_empty(&lock->wait_list)))
                __mutex_clear_flag(lock, MUTEX_FLAGS); // 清除flag

        debug_mutex_free_waiter(&waiter);

skip_wait:
        /* got the lock - cleanup and rejoice! */
        lock_acquired(&lock->dep_map, ip);

        if (use_ww_ctx && ww_ctx)
                ww_mutex_lock_acquired(ww, ww_ctx);

        spin_unlock(&lock->wait_lock); // cleanup
        preempt_enable();
        return 0;

err:
        __set_current_state(TASK_RUNNING);
        mutex_remove_waiter(lock, &waiter, current);
err_early_kill:
        spin_unlock(&lock->wait_lock);
        debug_mutex_free_waiter(&waiter);
        mutex_release(&lock->dep_map, 1, ip);
        preempt_enable();
        return ret;
}
```

上面的`__mutex_common`被`mutex_lock`，`ww_mutex_lock`两个函数复用

`use_ww_ctx` && `ww_ctx`这两个变量就是用来判断到底是被哪个函数复用了

然后函数很多逻辑都是为了减少等待时间，用了多次自旋锁进行等待，直到多次尝试之后还不能上锁的时候才真正去 sleep 等待

这样的操作虽然可能会增大单次上锁时间，但相比交换上下文 Context 的代价肯定是很省了

#### `自旋锁 spinlock`

自旋锁，就是一种反复重试的锁，因为实际生产过程中，经常会有稍微等一等这个互斥量就解除的情况

所以自旋锁在工程中用处还是很大的，很多 java 程序都要写 spinlock

Spinlock 相关代码在`<include/linux/spinlock_api_smp.h>`中

```c
static inline int __raw_spin_trylock(raw_spinlock_t *lock)
{
        preempt_disable(); // 设置不可抢占
        if (do_raw_spin_trylock(lock)) {  // 尝试获得自旋锁
                spin_acquire(&lock->dep_map, 0, 1, _RET_IP_); // 获得自旋锁
                return 1;
        }
        preempt_enable(); // 接触不可抢占
        return 0;
}
```

其中 spin_acquire 定义在`<include/linux/lockdep.h>`

```c
#define spin_acquire(l, s, t, i)                lock_acquire_exclusive(l, s, t, NULL, i)
#define lock_acquire_exclusive(l, s, t, n, i)           lock_acquire(l, s, t, 0, 1, n, i)
```

而 lock_acquire()实现的代码在`<kernel/locking/lockdep.c>`

```c
void lock_acquire(struct lockdep_map *lock, unsigned int subclass,
                          int trylock, int read, int check,
                          struct lockdep_map *nest_lock, unsigned long ip)
{
        unsigned long flags;

        if (unlikely(current->lockdep_recursion)) // 如果锁的递归深度标志位!=0
                return;

        raw_local_irq_save(flags); // 刷一下flags到disk
        check_flags(flags); // 检查flag

        current->lockdep_recursion = 1; // 互斥
        trace_lock_acquire(lock, subclass, trylock, read, check, nest_lock, ip); // 追踪锁获得 打印日志
        __lock_acquire(lock, subclass, trylock, read, check,
                       irqs_disabled_flags(flags), nest_lock, ip, 0, 0);  // lock acquire
        current->lockdep_recursion = 0; // 解除互斥
        raw_local_irq_restore(flags); // 再刷一下flags
}
EXPORT_SYMBOL_GPL(lock_acquire);
```

然后具体实现的时候，调用到`__lock_acquire()`

```c
static int __lock_acquire(struct lockdep_map *lock, unsigned int subclass,
                          int trylock, int read, int check, int hardirqs_off,
                          struct lockdep_map *nest_lock, unsigned long ip,
                          int references, int pin_count)
{
        struct task_struct *curr = current;
        struct lock_class *class = NULL;
        struct held_lock *hlock;
        unsigned int depth;
        int chain_head = 0;
        int class_idx;
        u64 chain_key;

        if (subclass < NR_LOCKDEP_CACHING_CLASSES)
                class = lock->class_cache[subclass]; // 找到cache
        /*
         * Not cached?
         */
        if (unlikely(!class)) {
                class = register_lock_class(lock, subclass, 0); // 注册lock
                if (!class)
                        return 0;
        }
        atomic_inc((atomic_t *)&class->ops); // 原子操作获得class 操作符
        if (very_verbose(class)) {
                printk("\nacquire class [%px] %s", class->key, class->name);
                if (class->name_version > 1)
                        printk(KERN_CONT "#%d", class->name_version);
                printk(KERN_CONT "\n");
                dump_stack();
        }
        depth = curr->lockdep_depth;  // init depth

        if (DEBUG_LOCKS_WARN_ON(depth >= MAX_LOCK_DEPTH)) // stack深度溢出
                return 0;

        class_idx = class - lock_classes + 1;

        if (depth) {
                hlock = curr->held_locks + depth - 1;
                if (hlock->class_idx == class_idx && nest_lock) {
                        if (hlock->references) {
                                /*
                                 * Check: unsigned int references:12, overflow.
                                 */
                                if (DEBUG_LOCKS_WARN_ON(hlock->references == (1 << 12)-1)) // 2^12 - 1
                                        return 0;

                                hlock->references++;
                        } else {
                                hlock->references = 2;
                        }

                        return 1;
                }
        }

        hlock = curr->held_locks + depth;
        if (DEBUG_LOCKS_WARN_ON(!class))
                return 0;
        hlock->class_idx = class_idx; // 记录hlock信息
        hlock->acquire_ip = ip;
        hlock->instance = lock;
        hlock->nest_lock = nest_lock;
        hlock->irq_context = task_irq_context(curr);
        hlock->trylock = trylock;
        hlock->read = read;
        hlock->check = check;
        hlock->hardirqs_off = !!hardirqs_off;
        hlock->references = references;
#ifdef CONFIG_LOCK_STAT
        hlock->waittime_stamp = 0;
        hlock->holdtime_stamp = lockstat_clock();
#endif
        hlock->pin_count = pin_count;

        if (check && !mark_irqflags(curr, hlock))
                return 0;

        /* mark it as used: */
        if (!mark_lock(curr, hlock, LOCK_USED))
                return 0;

        if (DEBUG_LOCKS_WARN_ON(class_idx > MAX_LOCKDEP_KEYS)) // 又溢出了
                return 0;

        chain_key = curr->curr_chain_key;
        if (!depth) {
                /*
                 * How can we have a chain hash when we ain't got no keys?!
                 */
                if (DEBUG_LOCKS_WARN_ON(chain_key != 0))
                        return 0;
                chain_head = 1;
        }

        hlock->prev_chain_key = chain_key;
        if (separate_irq_context(curr, hlock)) {
                chain_key = 0;
                chain_head = 1;
       }
        chain_key = iterate_chain_key(chain_key, class_idx);
        curr->curr_chain_key = chain_key;
        curr->lockdep_depth++;
        check_chain_key(curr);
        return 1;
}
```

`__lock_acquire()`被`spin_lock` 和 `mutex_lock`两个 class 调用

实际上它的操作对象不是对单一 class 加锁，是对一个锁类的加锁

这里为了降低 lockdep 的搜索消耗，用了一个 cache

对于那些反复加放锁的部分有不小的性能上的提升

- `读写锁rwlock`

读写锁的主要目的就是实现某一种状态的并发性

- `条件变量 Condition`

条件变量则是为了实现线程的批处理，一个个 batch 执行，定义了单个唤醒 & 广播唤醒两种方式

- `屏障 barrier`

屏障的作用就很像两阶段锁协议，第一阶段只能等待，第二阶段只能运行

当未达到屏障约定的上限时，通过条件变量实现进入 wait_queue

当达到屏障上限的时候，通过广播一次性唤醒
