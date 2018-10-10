---
pageClass: custom-page-class
---

# Frequent  Pattern

作为Data mining 的第一篇 先来讲讲频繁模式

频繁模式是推荐算法的基础

主要解决的是从一堆数据中挖掘出频繁的组合模式

举个简单的例子

可能买了Mac的人，过几天会去买贴膜
可能买考研英语书的人，过几天会去买考研数学书

如何在大量数据中找到可能相关的几个问题，称之为Frequent Pattern

频繁程度通过支持度、置信度两个参数来衡量

`A->B support`: 即模式A, B出现频率
`A->B configure`: 即模式A发生情况下B发生的概率

## Item Sets

Item Sets指的是假设不考虑数据之间的顺序

### Apriori

我们可以得出
* 如果一个集合是频繁集，那么它的所有子集都是频繁集
* 如果一个集合不是频繁集，那么它的所有超集都不会是频繁集

根据这一点，Agrawal & Srikant 在94年提出了著名的Apriori算法

**主要思想**就是从大小1开始遍历可能频繁集k
当满足V*所有*集合*子集*都在之前计算过的频繁集k中，且出现次数满足频繁要求
则V为k+1频繁集

伪代码:
```vim
Ck: Candidate itemset of size k
Lk : Frequent itemset of size k

L1 = {frequent items};
for (k = 1; Lk !=; k++) do begin
     Ck+1 = candidates generated from Lk;
    for each transaction t in database do
       increment the count of all candidates in Ck+1
    that are contained in t
    Lk+1  = candidates in Ck+1 with min_support
    end
return k Lk;
```
举个简单的例子
![图片.png | center | 556x200](https://cdn.nlark.com/yuque/0/2018/png/104214/1539169922048-59e323a1-3185-4758-a4bb-1545710eb589.png "")

但Apriori也有一些缺点
1. 多次读取数据，复杂度高
2. n较大，可能的取值较多

Apriori也有一系列改进算法，比如说用hash存储可能的取值，做剪枝等等

### FP-tree

仔细想一下上述算法的实现过程

一层层扩展，从大小为1开始，到2，再到k，到k+1

是不是很像BFS

那么我们不免想是不是会有类似DFS的算法

Jiawei Han, Jian Pei 在2000年提出FP-tree算法

通过构造前缀树来实现类似深度搜索的算法

先把所有集合按字母出现频次逆序排列，筛选出现频次小于min_support值的项

然后找所有DB中所有满足当前前缀abc的项，DB|abc

依次遍历

算法通过前缀树Trie实现

举个简单的例子

![图片.png | center | 556x200](https://cdn.nlark.com/yuque/0/2018/png/104214/1539172271916-e70b4f05-5382-4c82-ba27-8ffa189886d8.png "")

## Sequences

刚才说到的Item Sets中间的数据为无序的，但实际中，很多频繁集是在特定顺序下才成立的

Sequence主要研究的就是带有顺序的情况, 把每次操作的项放在集合Si中，集合S1, S2, ...,Sn组成序列集

同样求在最低支持度下所有的频繁集

### GSP

Join Phase在96年提出类似Apriori的算法GSP

和Apriori唯一的差别就是如何计算子集

现在GSP中的集合S为集合的集合

定义S的子集C满足
1. Ci为Si的非空子集, 当i∈[2, n-1]
2. Ci为Si的子集, 当i==1 | i==n

![图片.png | center | 556x200](https://cdn.nlark.com/yuque/0/2018/png/104214/1539186873976-297a4f7f-6496-42c6-aabd-d8454b8d38a3.png "")

### PrefixSpan

PrefixSpan 全称为Prefix-Projected Pattern Growth

前缀投影就是后缀Suffix，那么什么是前缀和后缀呢

定义 `<a(abc)(ac)d(cf)>`的前缀、后缀为

|Prefix|Suffix|
|-|-|
|`<a>`|`<(abc)(ac)d(cf)>`|
|`<aa>`|`<(_bc)(ac)d(cf)>`|
|`<ab>`|`<(_c)(ac)d(cf)>`|

PrefixSpan的思路就是

从a开始遍历所有满足min_support的前缀

然后对后缀检查是否满足min_support，若所有项都满足，则保留满足项

然后依次合并前缀项，递归遍历

![图片.png | center | 556x200](https://cdn.nlark.com/yuque/0/2018/png/104214/1539174965480-557e6b25-58cb-4b59-96fd-899ff8b13c51.png "")

## Tree patterns

当前面的集合推广到数结构

解决的主要是类似于网站链接的场景

### 范围编码

思考这么一个问题

有一颗树 如何判断是否是节点A是不是节点B的祖先

一般一点的办法就是以A为root节点，向下遍历，如果遍历到B则说明A是B的祖先

但这样很显然当树的规模比较小的时候还可以，但一旦树结构复杂时，就会接近O(n), 尤其是需要多次查找时

有人就想出一个O(1)的算法

先 先序遍历 一次树，第一次遍历到该节点时记录时间为Tleft, 再次到节点记为Tright

用区间[Tleft, Tright]表示该树的祖孙关系

当A节点的区间为Ka，B节点的区间为Kb时
* 若Kb属于Ka，则A为B的祖先
* 若Kb∩Ka=∅，则A, B为广义兄弟

![图片.png | center | 556x200](https://cdn.nlark.com/yuque/0/2018/png/104214/1539185414835-02aa7ecb-2b5e-46cc-bd87-d58ff4547e74.png "")

只要遍历一次建立区间索引之后，再次确认节点间的祖孙关系只需O(1)

比较懒 今天就先写到这里吧 明天继续
(未完待续)



