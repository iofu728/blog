---
title: 『HDFS』伪分布式Hadoop集群
date: 2018-10-07 15:43:00
tags: [hadoop]
description: hadoop 伪分布式
---

本文是[『Hadoop』MapReduce 处理 日志log(单机版)](/other/mapreduce.md)的旭文, maybe还有后续

在搭建环境的时候发现很难搜到合适的教程，所以这篇应该会有一定受众

伪分布式就是**假分布式**，假在哪里，假就假在他只有一台机器而不是多台机器来完成一个任务,
但是他模拟了分布式的这个过程，所以伪分布式下Hadoop也就是你在一个机器上配置了hadoop的所有节点

但伪分布式完成了所有分布式所必须的事件

伪分布式Hadoop和单机版最大的区别就在于需要配置**HDFS**

## HDFS
`HDFS = Hadoop Distributed File System`

当数据量超过单个物理机器上存储的容量，管理跨越机器的网络存储特定操作系统被称为分布式文件系统，HDFS就是这样一种系统

HDFS集群主要由 NameNode 管理文件系统 Metadata 和从机 DataNodes 存储的实际数据

NameNode = Hadoop Master， DataNodes = Hadoop Slave

* NameNode: NameNode即系统的主站
  - 其维护所有系统中存在的文件和目录的文件系统树和元数据
* DataNode : DataNodes作为从机，每台机器位于一个集群中，并提供实际的存储，它负责为客户读写请求服务

HDFS中的读/写操作运行在一个个块中，块作为独立的单元存储

之前我们提到这些块都是逻辑上划分的，只是用一个索引记录块的始末，并未真正的划分块

在Hadoop 1.x中block默认size=64M，而Hadoop 2.x中默认size改为128M

如果想重新定义`block.size`
```vim
$ vim etc/hadoop/hdfs-site.xml

# add
    <property>
        <name>dfs.block.size</name>
        <value>20971520</value> # 其中该值为字节B数，且需要满足>1M=1048576=1024×1024, 且能被512整除
    </property>
```

HDFS是可容错的，可伸缩的，易于扩展，高可用的

## HDFS读操作

HDFS这个系统除了主机和从机之外，还包括client端，file system

![图片.png | center | 556x200](https://cdn.nlark.com/yuque/0/2018/jpeg/104214/1538918814787-4ea53425-95fb-4d44-a824-b3f9235e113f.jpeg "")

当客户端想读取一个文件的时候，客户端需要和NameNode节点进行交互，因为它是唯一存储数据节点元数据的节点

NameNode规定奴隶节点的存储数据的地址跟位置

客户端通过NameNode找到它需要数据的节点，然后直接在找到DataNode中进行读操作

考虑到安全和授权的目的，NameNode给客户端提供token，这个token需要出示给DateNote进行认证，认证通过后，才可以读取文件

由于HDFS进行读操作的时候需要需要访问NameNode节点，所以客户端需要先通过接口发送一个请求，然后NameNode节点在返回一个文件位置

在这个过程中，NameNode负责检查，该客户端是否有足够的权限去访问这组数据？

如果拥有权限，NameNode会将文件储存路径分享给该客户端，与此同时，namenode也会将用于权限检查的token分享给客户端

当该客户端去数据节点读文件的时候，在检查token之后，数据节点允许客户端读特定的block. 一个客户端打开一个输入流开始从DataNode读取数据，然后，客户端直接从数据节点读取数据

如果在读取数据期间datanodes突然废了，这个客户端会继续访问Namenode, 这是NameNode会给出这个数据节点副本的所在位置

## HDFS写操作

![图片.png | center | 556x200](https://cdn.nlark.com/yuque/0/2018/png/104214/1538919255500-ac260c8b-73c3-4496-afab-d7f4c024d858.png "")

我们知道读取文件需要客户端访问Namenode. 相似的写文件也需要客户端与NameNode进行交互，NameNode需要提供可供写入数据的奴隶节点的地址

当客户端完成在block中写数据的操作时，这个奴隶节点开始复制自身给其他奴隶节点，直到完成拥有n个副本(这里的n为副本因子数)

当复制完成后，它会给客户端发一个通知，同样的这个授权步骤也和读取数据时一样

当一个客户端需要写入数据的时候，它需要跟NameNode进行交互，客户端发送一个请求给NameNode, NameNode同时返回一个可写的地址给客户端

然后客户端与特定的DataNode进行交互，将数据直接写入进去。当数据被写入和被复制的过程完成后，Datanode发送给客户端一个通知，告知数据写入已经完成

当客户端完成写入第一个block时，第一个数据节点会复制一样的block给另一个DataNode, 然后在这个数据节点完成接收block之后，它开始复制这些blocks给第三个数据节点

第三个数据节点发送通知给第二个数据节点，第二个数据节点在发送通知给第一个数据节点，第一个数据节点负责最后通知客户端

不论副本因子是多少，客户端只发送一个数据副本给DataNode, DataNode完成后续所有任务的复制工作

所以，在Hadoop中写入文件并不十分消耗系统资源，因为它可以在多个数据点将blocks平行写入

## HDFS 配置

```vim
# 修改为主机名
$ vim etc/hadoop/slaves
# 添加主机名
$ vim /etc/hosts
```
```vim
# create folder
$ mkdir -p /usr/local/hadoop/tmp
# 修改temp地址
$ vim etc/hadoop/core-site.xml

    <property>
        <name>hadoop.tmp.dir</name>
        <value>file:/usr/local/hadoop/tmp</value>
        <description>Abase for other temporary directories.</description>
    </property>
    <property>
        <name>fs.defaultFS</name>
        <value>hdfs://localhost:9000</value> ## localhost填主机名->主机名也是一个坑
    </property>
```
```vim
# create folder
$ mkdir -p /usr/local/hadoop/dfs/name
$ mkdir -p /usr/local/hadoop/dfs/data
# 修改分布式储存配置
$ vim etc/hadoop/hdfs-site.xml
<configuration>
    <property>
        <name>dfs.replication</name>
        <value>10</value> ## node数
    </property>
    <property>
        <name>dfs.block.size</name>
        <value>20971520</value> ## block.size
    </property>
   <property>
    <name>dfs.namenode.name.dir</name>
    <value>file:///usr/local/hadoop/dfs/name</value>
   </property>
   <property>
    <name>dfs.datanode.data.dir</name>
    <value>file:///usr/local/hadoop/dfs/data</value>
   </property>
   <property>
    <name>dfs.permissions</name>
    <value>false</value>
   </property>
</configuration>
```
```vim
# yarn 配置，注意所有localhost为主机名，需保持一致
$ vim etc/hadoop/yarn-site.xml
<configuration>
   <property>
    <name>yarn.resourcemanager.admin.address</name>
    <value>localhost:8033</value>
   </property>
   <property>
    <name>yarn.nodemanager.aux-services</name>
    <value>mapreduce_shuffle</value>
   </property>
   <property>
    <name>yarn.nodemanager.aux-services.mapreduce_shuffle.class</name>
    <value>org.apache.hadoop.mapred.ShuffleHandler</value>
   </property>
   <property>
    <name>yarn.resourcemanager.resource-tracker.address</name>
    <value>localhost:8025</value>
   </property>
   <property>
    <name>yarn.resourcemanager.scheduler.address</name>
    <value>localhost:8030</value>
   </property>
   <property>
    <name>yarn.resourcemanager.address</name>
    <value>localhost:8050</value>
   </property>
   <property>
    <name>yarn.resourcemanager.scheduler.address</name>
    <value>localhost:8030</value>
   </property>
   <property>
     <name>yarn.resourcemanager.webapp.address</name>
     <value>localhost:8088</value>
   </property>
   <property>
    <name>yarn.resourcemanager.webapp.https.address</name>
    <value>localhost:8090</value>
   </property>
</configuration>
```
完成上述配置之后，需要对FS进行相应的格式化操作

```vim
hdfs namenode -format
hdfs getconf -namenodes
```

然后就可以启动hdfs了

```vim
$ bash sbin/start-all.sh
```

启动之后可以通过Jbs命令查看进程

也可以通过http://ip:50070进入HDFS的前端进行文件管理


## 报错FAQ
1. Hadoop 3.1.1版本在bash sbin/start-dfs.sh会报[bash v3.2+ is required. Sorry.](https://segmentfault.com/q/1010000015478820)

  这个没法解决，搜了好多都没有答案，把包换成2.9.1就好了
  PS: 记得把所有环境变量，软链接都改一遍

2. [bash sbin/start-dfs.sh报](https://stackoverflow.com/questions/48129029/hdfs-namenode-user-hdfs-datanode-user-hdfs-secondarynamenode-user-not-defined)
```vim
Starting namenodes on [localhost]
ERROR: Attempting to operate on hdfs namenode as root
ERROR: but there is no HDFS_NAMENODE_USER defined. Aborting operation.
```
配置环境变量
```vim
$ vim ~/.zshrc
export HDFS_NAMENODE_USER="root"
export HDFS_DATANODE_USER="root"
export HDFS_SECONDARYNAMENODE_USER="root"
export YARN_RESOURCEMANAGER_USER="root"
export YARN_NODEMANAGER_USER="root"
$ source ~/.zshrc
```
3. [localhost: Error: JAVA_HOME is not set.](https://stackoverflow.com/questions/14325594/working-with-hadoop-localhost-error-java-home-is-not-set)

```vim
$ vim etc/hadoop/hadoop-env.sh
export JAVA_HOME=/etc/local/java/xxx ## 绝对路径
```

4. [command not found](https://stackoverflow.com/questions/38030730/start-all-sh-start-dfs-sh-command-not-found)

```vim
$ vim ~/.zshrc
PATH=$PATH:/usr/local/hadoop/sbin
$ source ~/.zshrc
```

5. [Incorrect configuration: namenode address dfs.namenode.rpc-address is not configured](https://stackoverflow.com/questions/23719912/incorrect-configuration-namenode-address-dfs-namenode-rpc-address-is-not-config)

```vim
$ export HADOOP_CONF_DIR = $HADOOP_HOME/etc/hadoop
$ echo $HADOOP_CONF_DIR
$ hdfs namenode -format
$ hdfs getconf -namenodes
$ etc/hadoop/start-all.sh
```

6. [adoop Mapreduce Error Input path does not exist: hdfs://localhost:9000/user/log/input"](https://stackoverflow.com/questions/32179761/hadoop-mapreduce-error-input-path-does-not-exist-hdfs-localhost54310-user-hd)

hdfs系统和外部文件系统不同步，需要手动把文件传进去, hdfs有一套类似于外部文件系统的fs命令
```vim
$ hadoop fs -mkdir -p /user/log/input
$ hadoop fs -put <datafile>  /user/log/input
```

文件也可以在http://ip:50070中查看

![图片.png | center | 556x200](https://cdn.nlark.com/yuque/0/2018/png/104214/1538923613086-7b258284-0dc9-4d90-9482-a9a9bda8ab1b.png "")

7. [hadoop fs 命令](https://segmentfault.com/a/1190000002672666)

```vim
$ hadoop fs -ls  /
$ hadoop fs -put < local file > < hdfs file >
$ hadoop fs -moveFromLocal  < local src > ... < hdfs dst >
$ hadoop fs -copyFromLocal  < local src > ... < hdfs dst >
$ hadoop fs -get < hdfs file > < local file or dir>
```

## 性能对比

单机版
```vim
    Reduce input groups=1
        Reduce shuffle bytes=14
        Reduce input records=1
        Reduce output records=1
        Spilled Records=2
        Shuffled Maps =1
        Failed Shuffles=0
        Merged Map outputs=1
        GC time elapsed (ms)=33
        Total committed heap usage (bytes)=291282944
    Shuffle Errors
        BAD_ID=0
        CONNECTION=0
        IO_ERROR=0
        WRONG_LENGTH=0
        WRONG_MAP=0
        WRONG_REDUCE=0
    File Input Format Counters
        Bytes Read=2977
    File Output Format Counters
        Bytes Written=18
spend:21559ms
```
伪分布-1节点，block.size=10M
```vim
        Map input records=180
        Map output records=180
        Map output bytes=1080
        Map output materialized bytes=14
        Input split bytes=106
        Combine input records=180
        Combine output records=1
        Reduce input groups=1
        Reduce shuffle bytes=14
        Reduce input records=1
        Reduce output records=1
        Spilled Records=2
        Shuffled Maps =1
        Failed Shuffles=0
        Merged Map outputs=1
        GC time elapsed (ms)=31
        Total committed heap usage (bytes)=287883264
    Shuffle Errors
        BAD_ID=0
        CONNECTION=0
        IO_ERROR=0
        WRONG_LENGTH=0
        WRONG_MAP=0
        WRONG_REDUCE=0
    File Input Format Counters
        Bytes Read=2941
    File Output Format Counters
        Bytes Written=6
spend:23277ms
```
伪分布-10节点，block.size=20M
```vim
ted successfully
18/10/07 22:51:57 INFO mapreduce.Job: Counters: 35
    File System Counters
        FILE: Number of bytes read=683924
        FILE: Number of bytes written=8139284
        FILE: Number of read operations=0
        FILE: Number of large read operations=0
        FILE: Number of write operations=0
        HDFS: Number of bytes read=281872252
        HDFS: Number of bytes written=181666
        HDFS: Number of read operations=181
        HDFS: Number of large read operations=0
        HDFS: Number of write operations=88
    Map-Reduce Framework
        Map input records=180
        Map output records=180
        Map output bytes=1080
        Map output materialized bytes=14
        Input split bytes=106
        Combine input records=180
        Combine output records=1
        Reduce input groups=1
        Reduce shuffle bytes=14
        Reduce input records=1
        Reduce output records=1
        Spilled Records=2
        Shuffled Maps =1
        Failed Shuffles=0
        Merged Map outputs=1
        GC time elapsed (ms)=39
        Total committed heap usage (bytes)=287825920
    Shuffle Errors
        BAD_ID=0
        CONNECTION=0
        IO_ERROR=0
        WRONG_LENGTH=0
        WRONG_MAP=0
        WRONG_REDUCE=0
    File Input Format Counters
        Bytes Read=2941
    File Output Format Counters
        Bytes Written=6
spend:24229ms
```

总的来说因为在一台机子上, 伪分布性能并没有提升

但跑起来 我那台破服务器 内存就跌零了 恐怖😱

![图片.png | center | 556x200](https://cdn.nlark.com/yuque/0/2018/png/104214/1538926799174-cc52d4c4-49d6-47d6-8de0-9b171ef81684.png "")

![图片.png | center | 556x200](https://cdn.nlark.com/yuque/0/2018/png/104214/1538926853109-db4dc1ff-6d3c-4c1d-97bb-b26ea818b696.png "")

不充钱怎么变得强大

## 参考

1. [Hadoop HDFS入门](https://www.yiibai.com/hadoop/hdfs_beginners_guide.html)
2. [Hadoop HDFS 教程（一）介绍](https://www.jianshu.com/p/8969eb90a59d)
3. [Hadoop伪分布式集群搭建](https://www.jianshu.com/p/1352ce8c8d73)





