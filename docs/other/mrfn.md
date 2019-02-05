---
title: 浅谈多轮检索式对话最近的两篇SOTA-『MRFN』&『IMN』
date: 2019-02-05 14:21:12
tags: [NLP, QA, Machine Learn]
description: MRFN IMN
---
> 新年第一天更博 显得很有 `仪式感（破音~）` （虽然已经断更一个月了 捂脸）
> 祝各位`NLPer`, 各位`dalao` 在新的一年里灵感爆棚 投的offer全中 万肆如意 新年玉快

新年第一天 日常网上冲浪 竟然发现`MRFN`终于被放出来了 啊 啊 啊~~

这篇论文我从去年十月一直等到现在

在这期间中不乏有Bert这种神器爆出来

但并没有打消我对这篇SOTA的期待

`IMN` 则是上个月中科院几位博士在arXiv在线发表的一篇论文 主要是被数据吓坏了 有、厉害🙇

粗粗看 可能觉得这两篇文章没什么关系 一个是多粒度fusion 一个是类似于Bert的深层次网络处理

但仔细思考 IMN dot 之后的结构与`MRFN`的FLS有异曲同工的作用 `不负责的猜测` FLS的设计思路会成为今后一段时间follow的点

PS: 以上两篇paper 都承诺开源code ~~(虽然repository里面都没有code😂)~~ 之后会跟一下code 看一下具体效果

> 概括一下 MRFN
> 1. 在原来SMN DAM 两粒度 基础上提出三粒度6种表示
> 2. 提出多表示匹配-合并(Matching-Aggregation)的三种策略
> 3. 使用大量实验验证各个表示的作用，验证context轮次、平均对话长度变化时各个表示的作用情况
> 4. 提出的多表示匹配-合并策略可推广到其他模型 并在SMN中进行试验
> 5. 比DAM快1.9x的训练速度
>
> IMN
> 1. EMbedding层加入character-EMbedding 解决OOV
> 2. EMbedding层后接类似ELMo思路的BiLSTM(paper中 这个结构最work)
> 3. dot之后做两个粒度的分析

## `MRFN`

> MRFN = Multi-Representation Fusion Network

`MRFN`是严睿老师组里陶重阳博士，小冰组徐粲学长，武威dalao去年的工作 论文发表在`WSDM2019`上

全文看下来 包括Motivation，实验设计都给我一种很舒服的感觉 感觉一切都顺理成章 一气呵成

事实上 去年十月底 在`EMNLP2018`的tutorial上严老师和武威dalao就已经把`MRFN`的结果秀出来了

之后徐学长回来分享的时候也提到这篇论文 但论文一直没放出来

### `Motivation`

这篇文章的Motivation是建立在最近几年多轮检索式对话基于的面向交互的思想

回想一下从Multi-view引入交互，到SMN完全基于交互，再到DAM多层交互

交互的粒度越多越work已经是大家的共识了

但如何更好的设计各个粒度之间的层次关系 减少不必要的性能浪费

作者提出把粒度划分为`word`, `short-term`, `long-term`三个粒度6种表示
1. `Word`
    + `character EMbedding`: 利用字符级别的CNN（n-gram）解决typos/OOV的问题
        - 思路和[小夕dalao总结的调小fastText窗口大小解决OOV思路](https://www.zhihu.com/question/265357659/answer/578944550)一致
    + `Word2Vec`: 这里很简单的用了word2Vec 很显然用ELMo Bert等会有更好的效果 当然效率上面就不太划算
2. `Contextual`
    + `Sequential`: 借用`GRU`的结构实现句子中间子串信息的获取
        - RNN能保留短距离词之间的关系 相对于`sub-sequential`
    + `Local`: 利用`CNN`获取N-gram的信息
        - CNN中卷积和池化 相对于获取中心词周围`N-gram`的信息
3. `Attention-based`
    + `self-Attention`
    + `cross-Attention`

### `Model`
但怎么把这些粒度有效的融合在一起

回想一下SMN在CNN之后才将`word`和`short-term`两个粒度的信息融合在一起

![image](https://cdn.nlark.com/yuque/0/2019/png/104214/1549370813808-3b407478-88cc-484e-a105-31e9bec4c618.png)

很自然的想到 如果在之前/之后做fuse效果会怎么样？

这个思路 就很像[NIPS14年那篇讨论是应该先dot还是应该先做CNN的paper](http://www.hangli-hl.com/uploads/3/1/6/8/3168008/hu-etal-nips2014.pdf)

作者就提出前中后三种`fusion`策略

![image](https://cdn.nlark.com/yuque/0/2019/png/104214/1549370840387-18e191f1-c844-466f-936c-ae66e231d488.png)

其中左侧是之前设计的6钟表示

`U`->`U*`的过程是简单的把多个矩阵拼接成一个矩阵

$U^*_i \in R^{d^* \times n_i}(d^*=\sum d_k)$

而`fusion`则是利用类似`CNN`的公式

$t_{i,j}=f(\hat{e_{i,j}},\bar{e_{i,j}})=ReLU(W_p[(\hat{e_{i,j}}-\bar{e_{i,j}}) \odot \hat{e_{i,j}}-\bar{e_{i,j}});\hat{e_{i,j}} \odot \bar{e_{i,j}}]+b_p)$

其中

$w_{j,k}^i=V_a^T tanh(W_a[\hat{e_{i,j}\oplus \hat{e_{r,k}}]+b_a})$

$\alpha_{j,k}^i=\frac{exp(\omega_{j,k}^i)}{\sum(exp(\omega_{j,k}^i))}$

$\bar{e_{i,j}}=\sum{\alpha_{j,k}^i}\hat{e_{r,k}}$

$\odot$ 就是Hadamard dot (或者叫element-wise multiplication)

之后就跟上`GRU`和`MLR`得到相应的score值

### `Experiment`

本文做了大量的实验 羡慕MSRA有用不完的机器 呜呜呜

1. 先是对比之前存在的一些模型

![image](https://cdn.nlark.com/yuque/0/2019/png/104214/1549375167463-6165224b-a84d-473e-8fe9-fa55147fac9a.png)

可以看出`FLS`效果比`DAM`提升比较显著 即使是 `FIS`在Dubbo数据集上也比DAM略微好一点

2. 然后还做了把模型结构中各个部分去掉之后的一些结果

![image](https://cdn.nlark.com/yuque/0/2019/png/104214/1549373911507-ed243c9b-3ec3-4774-8233-aa07ae943a50.png)

可以看出`Contextual`两个部分效果略有重叠导致了去除其一掉点不会太多 总的来说`Contextual`在模型中提点最大

3. 还做了模型拓展性方面的实验 把`fusion`三策略移到`SMN`也得到了不错的结果

![image](https://cdn.nlark.com/yuque/0/2019/png/104214/1549375170102-58cb3433-3ac6-41a9-96ab-2138301bee44.png)

4. 最后还探究了多轮对话Context轮次 对话长度变化时各个表示的作用占比情况

![image](https://cdn.nlark.com/yuque/0/2019/png/104214/1549375166993-e660570b-56e8-4f44-83cc-114e1dac986b.png)

全篇看下来 对于一个做系统出身的出身来看 十分舒服 可以说是比较`Science` 得到的结果也比较`significantly`

## `IMN`

> IMN = Interactive Matching Network

相对而言 `IMN` 论文写得有点随意 取名字也有、😶(不是喷 吐槽一下)

![image](https://cdn.nlark.com/yuque/0/2019/png/104214/1549375125045-08bf3e93-7918-45bd-bc71-625352895e1b.png)

同样 IMN的作者也想到了用`character`来减缓OOV的问题

创新点在于 EMbedding层之后用了一个类似`ELMo`的处理策略 来获取Sentence之间的信息

~~（当然 如果现在来做 用Bert做同样的事情可能会更好）~~

除了上述的idea之外 作者还在dot完之后分成两个粒度做处理

仔细一想 这和MRFN的FLS本质上是一种思路 把fusion的过程往后推迟

![image](https://cdn.nlark.com/yuque/0/2019/png/104214/1549375169785-e0698714-ccfd-4a8f-a94f-29fb5f117e90.png)

然后这个result确实厉害 `ym dalao`

## `References`
1. [Multi-Representation Fusion Network for Multi-turn Response Selection in Retrieval-based Chatbots. Chongyang Tao et al. WSDM2019.](https://dl.acm.org/ft_gateway.cfm?id=3290985&ftid=2038017&dwn=1&CFID=48199586&CFTOKEN=fd4f6dfb8820cbf2-214D0EB6-AEAD-530A-88B454E3E573F7AF)
2. [Interactive Matching Network for Multi-Turn Response Selection in Retrieval-Based Chatbots. Jia-Chen Gu et al. 2019](https://arxiv.org/pdf/1901.01824)

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.5.1/katex.min.css">

<link rel="stylesheet" href="https://cdn.jsdelivr.net/github-markdown-css/2.2.1/github-markdown.css"/>
