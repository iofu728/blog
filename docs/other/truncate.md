---
title: Innodb MySQL中如何优雅的删除大表跑路🏃
date: 2018-10-08 15:47:54
tags: [SQL, Linux]
description: MySQL 删除大表 truncate
---

最近很想写写 MySQL 相关的内容，就从这个话题出发吧

有人说删 MySQL 表谁不会

不就是

```sql
drop table TABLENAME
```

如果在生产环境中，你对一张 TB 级别的大表，敲下这行命令

那么你的主管，大主管，隔壁的大主管 就会气势汹汹的冲向你

其原因是因为当开始 Drop 表的时候，因为`Innodb`支持事务，为保持一致性，会维护一个全局锁

这就导致，这个时候所有关于 MySQL 的操作全部堵在队列中

如果在白天，那 QPS 曲线跌零可是很好看的

当然有些不辞辛苦的 DBA 会选择，大晚上爬起来删表

**先说结论: 先用 ln 建立硬链接，再 drop 表，最后用 truncate 删除索引文件**

## `Innodb` - `MyISAM`

目前一般 MySQL 引擎使用的是`Innodb`

其最大的特点就是支持事务，虽然`Select`性能比`MyISAM`弱一点

### 事务

那么什么是事务？

事务就是一件事，一堆 SQL 组

这些 SQL 要么一起完成，要么一个都不做, 它是一个不可分割的工作单位

事务是并发控制的基本单位，保证了数据的完整

事务满足著名的 ACID 条件

1. `原子性`: 在学习事务时，经常有人会告诉你，事务就是一系列的操作，要么全部都执行，要都不执行，这其实就是对事务原子性的刻画；虽然事务具有原子性，但是原子性并不是只与事务有关系，它的身影在很多地方都会出现

> - 如果操作并不具有原子性，并且可以再分为多个操作，当这些操作出现错误或抛出异常时，整个操作就可能不会继续执行下去，而已经进行的操作造成的副作用就可能造成数据更新的丢失或者错误
> - 其难点在于并行事务的原子性处理
> - MySQL 使用`回滚日志undo log`实现事务的原子性

2. `一致性`: 在事务开始之前和事务结束以后，数据库的完整性没有被破坏
   > - 其实除了 ACID 的一致性，CAP 原则中也有一个一致性
   > - CAP 中的一致性指的是分布式系统中的各个节点中对于同一数据的拷贝有着相同的值
   > - ACID 中一致性指的是数据库的规则，如果 schema 中规定了一个值必须是唯一的，那么一致的系统必须确保在所有的操作中，该值都是唯一的
3. `隔离性`: 数据库允许多个并发事务同时对其数据进行读写和修改的能力，隔离性可以防止多个事务并发执行时由于交叉执行而导致数据的不一致
   > - `RAED UNCOMMITED`: 使用查询语句不会加锁，可能会读到未提交的行`Dirty Read`
   > - `READ COMMITED`: 只对记录加记录锁，而不会在记录之间加间隙锁，所以允许新的记录插入到被锁定记录的附近，所以再多次使用查询语句时，可能得到不同的结果`Non-Repeatable Read`
   > - `REPEATABLE READ`: 多次读取同一范围的数据会返回第一次查询的快照，不会返回不同的数据行，但是可能发生幻读`Phantom Read`
   > - `SERIALIZABLE`: InnoDB 隐式地将全部的查询语句加上共享锁，解决了幻读的问题
   > - Mysql 的隔离性通过共享锁 Shared、互斥锁 Exclusive、时间戳、version 等手段实现
4. `持久性`: 既然是数据库，那么一定对数据的持久存储有着非常强烈的需求，如果数据被写入到数据库中，那么数据一定能够被安全存储在磁盘上；而事务的持久性就体现在，一旦事务被提交，那么数据一定会被写入到数据库中并持久存储起来
   > - MySQL 使用`重做日志redo log`实现事务的持久性

### 其他区别

1. 储存结构

> `MyISAM`：每个`MyISAM`在磁盘上存储成三个文件。第一个文件的名字以表的名字开始，扩展名指出文件类型。.frm 文件存储表定义。数据文件的扩展名为.MYD (MYData)。索引文件的扩展名是.MYI (MYIndex)。
> `InnoDB`：所有的表都保存在同一个数据文件中（也可能是多个文件，或者是独立的表空间文件), `InnoDB`表的大小只受限于操作系统文件的大小，一般为 2GB

2. 存储空间

> `MyISAM`：可被压缩，存储空间较小。支持三种不同的存储格式：静态表、动态表、压缩表
> `InnoDB`：需要更多的内存和存储，它会在主内存中建立其专用的缓冲池用于高速缓冲数据和索引

3. 可移植性、备份及恢复

> `MyISAM`：数据是以文件的形式存储，所以在跨平台的数据转移中会很方便。在备份和恢复时可单独针对某个表进行操作
> `InnoDB`：免费的方案可以是拷贝数据文件、备份`binlog`，或者用 mysqldump，在数据量达到几十 G 的时候就相对痛苦了

4. AUTO_INCREMENT

> `MyISAM`：可以和其他字段一起建立联合索引。引擎的自动增长列必须是索引，如果是组合索引，自动增长可以不是第一列，他可以根据前面几列进行排序后递增
> `InnoDB`：`InnoDB`中必须包含只有该字段的索引。引擎的自动增长列必须是索引，如果是组合索引也必须是组合索引的第一列

5. 表锁差异

> `MyISAM`：只支持表级锁，用户在操作`myisam`表时，select，update，delete，insert 语句都会给表自动加锁，如果加锁以后的表满足 insert 并发的情况下，可以在表的尾部插入新的数据
> `InnoDB`：支持事务和行级锁，是`innodb`的`最大特色`。行锁大幅度提高了多用户并发操作的新能。但是`InnoDB`的行锁，只是在 WHERE 的主键是有效的，非主键的 WHERE 都会锁全表的

6. 全文索引

> `MyISAM`：支持 FULLTEXT 类型的全文索引
> `InnoDB`：不支持 FULLTEXT 类型的全文索引，但是`innodb`可以使用 sphinx 插件支持全文索引，并且效果更好

7. 表主键

> `MyISAM`：允许没有任何索引和主键的表存在，索引都是保存行的地址
> `InnoDB`：如果没有设定主键或者非空唯一索引，就会自动生成一个 6 字节的主键(用户不可见)，数据是主索引的一部分，附加索引保存的是主索引的值

8. 表的具体行数

> `MyISAM`：保存有表的总行数，如果`select count(*) from table;`会直接取出出该值
> `InnoDB`：没有保存表的总行数，如果使用`select count(*) from table;`就会遍历整个表，消耗相当大，但是在加了 wehre 条件后，`myisam`和`innodb`处理的方式都一样

9. CURD 操作

> `MyISAM`：如果执行大量的 SELECT，`MyISAM`是更好的选择
> `InnoDB`：如果你的数据执行大量的 INSERT 或 UPDATE，出于性能方面的考虑，应该使用`InnoDB`表。DELETE 从性能上`InnoDB`更优，但 DELETE FROM table 时，`InnoDB`不会重新建立表，而是一行一行的删除，在`innodb`上如果要清空保存有大量数据的表，最好使用 truncate table 这个命令

10. 外键

> `MyISAM`：不支持
> `InnoDB`：支持

## 开启独立表空间

MySQL5.6.7 之后会默认开启`独立表空间`

在 my.cnf 中，有这么一条配置

```vim
innodb_file_per_table = 1
```

查看表空间状态，用下面的命令

```sql
mysql> show variables like '%per_table';
+-----------------------+-------+
| Variable_name         | Value |
+-----------------------+-------+
| innodb_file_per_table | ON    |
+-----------------------+-------+
```

> 如果`innodb_file_per_table`的 value 值为`OFF`，代表采用的是共享表空间。
> 如果`innodb_file_per_table`的 value 值为`ON`，代表采用的是独立表空间

### 共享表 - 独立表

- 共享表空间：某一个数据库的所有的表数据，索引文件全部放在一个文件中，默认这个共享表空间的文件路径在 data 目录下

  - 默认的文件名为:ibdata1(此文件，可以扩展成多个)。注意，在这种方式下，运维超级不方便。你看，所有数据都在一个文件里，要对单表维护，十分不方便。另外，你在做 delete 操作的时候，文件内会留下很多间隙，ibdata1 文件不会自动收缩。换句话说，使用共享表空间来存储数据，会遭遇 drop table 之后，空间无法释放的问题。

- 独立表空间:每一个表都以独立方式来部署，每个表都有一个.frm 表描述文件，还有一个.ibd 文件。
  - .frm 文件：保存了每个表的元数据，包括表结构的定义等，该文件与数据库引擎无关。
  - .ibd 文件：保存了每个表的数据和索引的文件。
  - 注意，在这种方式下，每个表都有自已独立的表空间，这样运维起来方便，可以实现单表在不同数据库之间的移动。另外，在执行 drop table 操作的时候，是可以自动回收表空间。在执行 delete 操作后，可以通过执行 alter table TableName engine=innodb 语句来整理碎片，回收部分表空间

## 硬链接

假设，`datadir = /data/mysql/`, 另外，有一个 database,名为 bigtest

在数据库 bigtest 中，有一个表，名为 TABLENAME，执行下列命令

```sql
mysql> system ls -l /data/mysql/bigtest/

-rw-r----- 1 mysql mysql          9023  8 18 11:32 TABLENAME.frm
-rw-r----- 1 mysql mysql 2356792000512  8 18 11:32 TABLENAME.ibd
```

现在 TABLENAME.ibd 文件太大，导致删表的时候过慢

那么如何解决这个问题呢，就需要使用硬链接对同一文件再建立一次索引

这个时候 drop 掉 TABLENAME.ibd 文件，那就是秒级

因为 FS 查询该文件还有一个索引，就不会真正的删除这张表，而只是删除这个索引

```sql
mysql> system ln /data/mysql/bigtest/TABLENAME.ibd /data/mysql/bigtest/TABLENAME.ibd.tmp

-rw-r----- 1 mysql mysql          9023  8 18 11:32 TABLENAME.frm
-rw-r----- 2 mysql mysql 2356792000512  8 18 11:32 TABLENAME.ibd
-rw-r----- 2 mysql mysql 2356792000512  8 18 11:32 TABLENAME.ibd.tmp
```

此时 drop 表，就会瞬间结束

```sql
mysql> drop table erp;
Query OK, 0 rows affected (1.03 sec)
```

## truncate

这个时候已经把表删了 MySQL 里面已经没有这张表了 但磁盘并没有释放

磁盘里还有那个 TABLENAME.ibd.tmp 大文件，于是问题转换为如何删除一个大文件而不引起大 IO

同样这个时候不能用 rm 命令，用了的话磁盘 IO 开销飙高, CPU 打满，ssh 都连不上了，那么恭喜你又有:tea:喝了

那用什么呢

答案是`truncate`（其实还有其他一些方法, 但对 IO 影响都比较大）

其实有两个 truncate, 一个是 Linux 下 FS 对文件操作的命令，一个是 MySQL 中对表操作的命令

### FS 的 truncate

truncate 和其字面意思一致，截断

把文件截断成指定大小(注意: 可以是放大也可以是缩小)

附上 truncate 的 Linux 源码，其基本思路就是三次释放间接块，截取 inode

- 直接块，就是 i_zone 中相应保存的就直接是 inode 所使用的磁盘块
- 一级间接块，顾名思义，i_zone 指明的块中存放的不是普通数据，而是块号
  - 因此对一级间接块的释放操作就是读取一级间接块，遍历其中每一个块调用 free_block 进行释放
- 二级间接块就是 i_zone 中存储的是一级间接块的块号
  - 对于二级间接块读取一级间接块后就可以转换为对一级间接块的释放操作
- 同理，三级间接块 i_zone 存储的就是二级间接块的块号，所以释放三级间接块就需要三次递归

truncate 操作则是对 inode 的所有块进行释放，最后设置其大小为 0

```cpp
/*
 * linux/fs/truncate.c
 *
 * (C) 1991 Linus Torvalds
 */

#include <linux/sched.h>  // 调度程序头文件，定义了任务结构task_struct、初始任务0 的数据，
// 还有一些有关描述符参数设置和获取的嵌入式汇编函数宏语句。
#include <sys/stat.h>  // 文件状态头文件。含有文件或文件系统状态结构stat{}和常量。

// 释放一次间接块。
static void free_ind(int dev, int block) {
  struct buffer_head *bh;
  unsigned short *p;
  int i;

  if (!block) return;  // 如果逻辑块号为0，则返回。

  // 读取一次间接块，并释放其上表明使用的所有逻辑块，然后释放该一次间接块的缓冲区。
  if (bh = bread(dev, block)) {
    p = (unsigned short *)bh->b_data;  // 指向数据缓冲区。
    for (i = 0; i < 512; i++, p++)  // 每个逻辑块上可有512 个块号。
      if (*p) free_block(dev, *p);  // 释放指定的逻辑块。
    brelse(bh);                     // 释放缓冲区。
  }
  free_block(dev, block);  // 释放设备上的一次间接块。
}

// 释放二次间接块。
static void free_dind(int dev, int block) {
  struct buffer_head *bh;
  unsigned short *p;
  int i;

  if (!block) return;  // 如果逻辑块号为0，则返回。

  // 读取二次间接块的一级块，并释放其上表明使用的所有逻辑块，然后释放该一级块的缓冲区。
  if (bh = bread(dev, block)) {
    p = (unsigned short *)bh->b_data;  // 指向数据缓冲区。
    for (i = 0; i < 512; i++, p++)  // 每个逻辑块上可连接512 个二级块。
      if (*p) free_ind(dev, *p);  // 释放所有一次间接块。
    brelse(bh);                   // 释放缓冲区。
  }

  free_block(dev, block);  // 最后释放设备上的二次间接块。
}

// 将节点对应的文件长度截为0，并释放占用的设备空间。
void truncate(struct m_inode *inode) {
  int i;

// 如果不是常规文件或者是目录文件，则返回。
  if (!(S_ISREG (inode->i_mode) || S_ISDIR (inode->i_mode)))
    return;
// 释放i 节点的7 个直接逻辑块，并将这7 个逻辑块项全置零。
  for (i = 0; i < 7; i++)
    if (inode->i_zone[i]){  // 如果块号不为0，则释放之。
      free_block (inode->i_dev, inode->i_zone[i]);
      inode->i_zone[i] = 0;
    }
  free_ind (inode->i_dev, inode->i_zone[7]);  // 释放一次间接块。
  free_dind (inode->i_dev, inode->i_zone[8]); // 释放二次间接块。
  inode->i_zone[7] = inode->i_zone[8] = 0;    // 逻辑块项7、8 置零。
  inode->i_size = 0;     // 文件大小置零。
  inode->i_dirt = 1;     // 置节点已修改标志。
  inode->i_mtime = inode->i_ctime = CURRENT_TIME; // 重置文件和节点修改时间为当前时间。
}
```

### SQL 的 truncate

一般说 Sql 的 truncate 会把它和 drop，delete 放在一起对比

我们知道 MySQL 有一系列的日志用于保护数据

尤其是对于写操作，除了传统的 transaction log，另外还有 binlog

这一些 log 日志都是在操作的同时进行书写的

delete 操作时，会把每条数据标记为`已删除`，不可避免的导致了操作十分耗时，且实际上空间并没有被释放 DML

truncate 操作时，把所有数据删除，仅把表结构记录到 transition log 中，很明显这种操作较难恢复，但耗时较少 DDL

drop 表的时候，就跟直接，把表数据和表结构都删除了 DDL

drop 和 truncate 想要恢复也是可以的但不是通过 rollback，而是通过解析 binlog 文件

### 其他方法

1. `重定向`

把空字符重定向到文件中，但 IO 高，io 会跌零

```vim
$ > /data/mysql/bigtest/TABLENAME.ibd.tmp
```

2. `:`/`true`

把 true 值重定向到文件中

```vim
$ : > /data/mysql/bigtest/TABLENAME.ibd.tmp
```

3. `/dev/null`/`dd`/`cp`

```vim
cat /dev/null > access.log
cp /dev/null access.log
dd if=/dev/null of=access.log
```

4. `echo`

```vim
echo "" > access.log
echo > access.log
echo -n "" > access.log
```

## HDFS truncate

Truncate 文件截断在 HDFS 上的表现其实是 block 的截断。传入目标文件，与目标保留的长度(此长度应小于文件原大小)

- 允许用户移除意外写入的数据
- 当写事务发生失败的时候，可以进行回滚，回到之前写入成功的事务状态
- 有能力移除一次失败的写操作而写入的不完整的数据
- 提升 HDFS 对于其它文件系统的支持度

1. 定位到新的截取长度所对应的块，然后把后面多余的块从此文件中进行移除;
2. 找到新长度所对应的 block 块之后，计算此块内部需要移除的偏移量，然后进行删除;

## 参考

1. [『浅入深出』MySQL 中事务的实现](https://draveness.me/mysql-transaction)
2. [MySQL 事务](http://www.runoob.com/mysql/mysql-transaction.html)
3. [MySQL Drop 大表解决方案](https://dbarobin.com/2015/01/15/solution-of-droping-large-table-under-mysql/)
4. [为什么不建议 innodb 使用亿级大表](http://xiaorui.cc/2016/12/08/%E4%B8%BA%E4%BB%80%E4%B9%88%E4%B8%8D%E5%BB%BA%E8%AE%AEinnodb%E4%BD%BF%E7%94%A8%E4%BA%BF%E7%BA%A7%E5%A4%A7%E8%A1%A8/)
5. [MySQL 存储引擎中的 MyISAM 和 InnoDB](https://www.zybuluo.com/phper/note/78781)
6. [SQL 中删除整张表信息 TRUNCATE 和 DELETE 性能比较](http://www.voidcn.com/article/p-xuukgblc-gu.html)
7. [Deleting very large file without webserver freezing](https://serverfault.com/questions/480526/deleting-very-large-file-without-webserver-freezing)
8. [Linux server out of space](https://serverfault.com/questions/366324/linux-server-out-of-space/366327#366327)
