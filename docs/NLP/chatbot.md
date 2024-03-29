---
title: 检索式人工智障识记
date: 2018-11-16 10:12:02
tags: [NLP/Dialogue]
description: 检索式 QA
---

拖了一个多星期了 都快拖到 Final Presentation DDL 了 我这个`懒癌晚期`都看不下去了

好 究竟是道德的沦丧还是人性的扭曲？欢迎来到这一期的`「奇葩说之中华田园犬大解密」`

在了解了[基本的 RNN 家族](/NLP/rnn.md)之后

我们把步子迈得大一点 直接对准目前`检索式` `chatbots`研究前沿

首先 QA 系统分为`任务型`，`非任务型`两大类

`任务型`就是像 Siri 这种，需要识别用户派遣的任务，然后完成相应的任务

而`非任务`则是主要是闲聊机器人，购物客服机器人

`非任务`按 Answer 的生成方式 又可以分为 `检索式` `生成式`

目前工业上落地的(效果好的)就是`检索式`

所以我们为了学术 ~~(找工作)~~ 来研究`检索式`对话 Chatbots

`检索式QA` 和 `生产式QA` 最大的区别 就是 检索式 只需要做`encode` 而生成式不仅仅要 encode 还要`decode`

这个应该很好理解 检索式 只需要 把 query+Context encode 到向量 然后计算 Similarity，取最高的几个

但生成式 encode 计算完之后 还得根据计算值 decode 成语句 返回给用户

这就是他们最大的区别 当然 我们这里讨论的是`检索式`

## Base mind

检索式对话 顾名思义 就是从一堆语料库中 通过`检索` 来`匹配`到相近的对话 从而输出答案

注意 这里有两个关键词 一个是`检索` 另外一个是`匹配`

`检索`就是 检查索引 所以 检索的关键就是把词变成词向量 预处理成 Index

`匹配`就是 根据词向量 计算出一个匹配值 最简单就是计算 Cosine Distance 当然这样效果很一般

于是就有一堆学者提出一堆模型

常规的做法有利用 RNN 家族 获取句、文章粒度的信息

然后 就开始论文串讲了

## 上古时代

话说 盘古还没开天 女娲还没补石 后裔还没射日

那个时候 还没有 Word2vector 更不用说小学五年级就可以学得 TF 对词向量的计算 还都是传统的 Hash 优化思路

这个时候出现了一个名叫 DSSM 的模型[`Po-Sen Huang et al. 2013`][learning deep structured semantic models for web search using clickthrough data](https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/cikm2013_DSSM_fullversion.pdf)

![图片.png | center | 556x500](https://cdn.nlark.com/yuque/0/2018/png/104214/1542345404535-fde510e8-39e7-40b8-a620-b0eeb4b9fba0.png)

这个模型创新点有

1. 利用`wordHash`代替传统词袋模型 从而达到降维效果
   - `word Hash` 就是用把词前后加上`#`，然后每 n 个词做一个切割，比如说`good`->{`#go`, `goo`, `ood`, `od#`}
   - 每个切割分量作为一维向量
   - 因为英文中单词数量级远大于 n 个字母组合的数量级
   - 且这种方案的 Hash 碰撞率较小 3 字母表示仅为`0.0044％`
   - WordHash 可以看做是`Word2Vector`早期的方案
   - 其基本思想每个词之间并非完全正交 然后应该没有那么多独立的维度 所以就可以压缩词向量大小
2. 利用`全神经网络`对句子进行处理得到相对应的句粒度向量
   - 文章利用三个隐藏层进行训练，第一个隐藏层为 WordHash 层有 30K 个节点，第二三层各有 300 个节点，输出层有 128 个节点，并使用随机梯度下降 SGN 训练

## 启蒙运动

随着 word2Vec 的提出 再加上 NN 方法在 NLP 中进一步运用 检索式 QA 有了不错的发展

但回顾之前的 DSSM 模型 在计算出句粒度的向量之后就直接使用 cosine distance 进行计算 Similarity

直观感觉这样算效果不会太好 于是这个时期就有一些学者提出一些改进 Similarity 计算方法的模型

### `MV-LSTM`

就有学者提出由构造对齐矩阵 然后再做池化的方式 计算句粒度之间相似度 的[`MV-LSTM`模型[`Shengxian Wan et al. 2015`]](http://www.aaai.org/ocs/index.php/AAAI/AAAI16/paper/download/11897/12030)

<center><img width="600" src="https://cdn.nlark.com/yuque/0/2018/png/104214/1542351846290-e23d67f2-5c47-4284-9e01-612b9a03ac7d.png"></center>

1. 计算句子间的两两匹配度存入对齐矩阵 从细粒度描述句子间关系
2. 利用`双向LSTM`模型 减少因为 RNN 时序遍历的特性 导致模型结果更偏向于最后几个单词的现象
3. Similarity 不只直接做 cosine 计算 根据模型特性动态调整参数`$s(u,v)=f(u^TM^{[1:c]}v+W_{uv}[u;v])+b)$`
4. 处理最后一步使用多层感知机`MLP`对得到的结果进行压缩和分类 因为效果较好 这个做法在之后的论文中被广泛采用

### `MM`

> MM = Matching Matrix

这个[模型[`Liang Pang et al. 2016`]](http://www.aaai.org/ocs/index.php/AAAI/AAAI16/paper/download/11895/12024)主要是从多个角度 构造对齐矩阵 然后讲多个对齐矩阵 类比图像处理 一起喂入 CNN 中进行 卷积池化操作 算是`交互式QA`的开山之作

<center><img width="600" src="https://cdn.nlark.com/yuque/0/2018/png/104214/1542353262588-eed0a08d-2a37-41d6-8cbb-b03054846889.png"></center>

文章给出了三种对齐函数的计算方式 1. 存在判断: 该单词是否存在于另一个句子中 2. 点积 3. 余弦相似度

<center><img width="700" src="https://cdn.nlark.com/yuque/0/2018/png/104214/1542353290710-66dc00ee-c423-4a23-8c0e-3804b688e66a.png"></center>

将多粒度分析出的对齐矩阵 通过多重卷积 进行训练

<center><img width="400" src="https://cdn.nlark.com/yuque/0/2018/png/104214/1542353318367-9f27cfa9-d6ae-4f94-b502-bb857b3742bf.png"></center>

然后这种多粒度计算词、句之间关系的做法 之后发展成`交互式QA` 现广泛应用于检索式 QA 模型中

### `BiMPM`

> BiMPM = Bilateral Multi-Perspective Matching

在前面学者的基础上 进一步针对多角度句词匹配进行研究 提出[BiMPM 模型[`Zhiguo Wang et al. 2017`]](https://arxiv.org/pdf/1702.03814)

<center><img width="500" src="https://cdn.nlark.com/yuque/0/2018/png/104214/1542354627538-9500438e-7e1b-4f92-872e-5275e76b9df0.png"></center>

文章提出四种匹配方式

1. `Full Matching`: 每个单词 与 需要匹配的句子的最后一个`隐藏层`输出向量进行 Cosine 计算
2. `MaxPooling Matching`: 每个单词 与 需要匹配的句子的`每一个单词`进行 Cosine 计算 取`Maximum`
3. `Attentive Matching`: 每个单词 与 需要匹配的句子的每一个单词行 Cosine 计算 然后用 Softmax 归一化 `作为attention权重` 然后再`加权求和` 得到的结果再做一次 Cosine
4. `Max Attentive Matching`: 每个单词 与 需要匹配的句子的每一个单词行 Cosine 计算 然后用 Softmax 归一化 作为 attention 权重 然后再`取最大值` 得到的结果再做一次 Cosine

<center><img width="600" src="https://cdn.nlark.com/yuque/0/2018/png/104214/1542355478297-e5ad297c-bd25-4528-a833-be0ab27284cd.png"></center>

然后 BiMPM 还加上了双向处理 不仅考虑从 Query 推出 Answer 还考虑到 Answer 推出 Query

## 工业革命

慢慢的大家发现 仅仅从词的角度 去进行检索式 QA 不能达到很好的效果

尤其是在多轮对话中效果并不好 于是能反映多角度关系且特别`Work`(这个很关键)的交互式就越来越流行

### `Multi-view model`

说到交互式 必须 提到这篇论文[Multi-view Response Selection for Human-Computer Conversation [`Xiangyang Zhou et al. 2016`]](http://www.aclweb.org/anthology/D16-1036)

虽然它不算完全使用了交互思想的论文 但算作给交互打开了一些思路

然后 看完这篇 Paper `LongLong Ago` 才发现 这篇论文是我老师写的 ~~（虽然他的名字 藏在最后）~~

![图片.png | center | 556x500](https://cdn.nlark.com/yuque/0/2018/png/104214/1542356643949-b78cc707-3d22-4990-9643-6cc5ce4e7854.png)

我们在研究多轮对话的时候 很简单的一个想法就是把多轮用一些标识符(比如说`_SOS_`)拼接成一句单句 然后这个单句就可以像上面一样计算对齐矩阵

![图片.png | center | 556x500](https://cdn.nlark.com/yuque/0/2018/png/104214/1542356794106-424b4565-3fef-49d6-af19-8411d2afb194.png)

但很显然 这样做 不会有太好的效果

于是这篇 Paper 提出通过多角度 (`Word Level`, `Utterance Level`)

`Utterance`是指利用 CNN 进行卷积池化 得到 Utterance Level 的 embedding squence 再经过一次 Gated RNN (LSTM or GRU)过滤噪声

然后把两个维度得到的结果相加得到 最终的结果

很显然 直接相加得到的结果 不能准确的反映 多维度之间的关系 但多维度的思路对后面的论文很有帮助

### `SMN`

> SMN = Sequential Matching Network

然后 就到了大名鼎鼎的[SMN [`Yu Wu et al. 2017`]](https://arxiv.org/pdf/1612.01627) (ym wuyu dalao)

`SMN` 把多粒度、基于交互的思想运用在多轮对话中

![图片.png | center | 556x500](https://cdn.nlark.com/yuque/0/2018/png/104214/1542358541211-bf819107-ce5f-4085-868c-c5e675aad8bd.png)

和前面的`MM`等模型一样 `SMN`采用了多粒度分析

- 一个对齐矩阵 M1 是直接`Word Embedding` 得到的 对应的就是`Word Pairs`
- 另外一个矩阵 M2 是通过`GRU`计算得到的 对应的是`Segment Pairs`

分别代表词粒度、句粒度

然后经过卷积、池化结合两个粒度的信息

然后再过一层`GRU` 过滤噪声 `GRU`得到的向量进行 Match 就可以获得匹配 Score

> 这种多粒度的做法 保证了即使 CNN 很浅，也能抽取出比较 high-level 的特征，得到高质量的 utterance embedding[9]

这篇文章 还对最后一个 GRU 进行优化 给出了分别利用

1. 最后一个隐藏层结果`$\text{SMN}_{last}$`;
2. 中间每层的带权和`$\text{SMN}_{static}$`;
3. 结合 attention 的一种表示`$\text{SMN}_{dynamic}$`进行匹配的结果

得出 dynamic 效果最优的结论

### `DUA`

之前 我们 分析过 RNNs 家族的一些模型

在刚才的`SMN`模型中 利用了 GRU 获得时序信息

那么如果把 GRU 换成 RNN 的其他模型呢

就有学者提出[DUA 模型[`Zhuosheng Zhang et al. 2018`]](https://arxiv.org/pdf/1806.09102)，把前面 M1, M2 分别换为 GRU, self-attention

![图片.png | center | 556x500](https://cdn.nlark.com/yuque/0/2018/png/104214/1542361352470-4c4da4a9-2c4a-4db9-a234-decb9baf0582.png)

其实 上面这个图画的不好

- 一个对齐矩阵 M1 是通过`GRU`计算得到的 对应的是`Segment Pairs`
- 另外一个矩阵 M2 是先`self-attentation` 然后和 embedding 的结果拼起来 再过一次`GRU`
  - 这里的`slef-attentation` 没有使用 position 所以没有带时序信息 于是用`GRU` 捞一下有关时间的信息

之后的就和`SMN`基本一致 实际效果比`SMN`更好一点

### `DAM`

![图片.png | center | 556x500](https://cdn.nlark.com/yuque/0/2018/png/104214/1542361915086-a0f3f760-c899-45fa-b04e-aac2ab94ec54.png)

前面的`SMN`给了两层对齐矩阵 那么为啥选两层 不选三层 四层 100 层 8848 层呢

于是有 dalao 借助 `transformer` (其实 也就是 `self-attentation` 还记得 Google Brain 那篇风骚的 `Attention is All you need`吧) 提出了[Deep Attention Matching [`Xiangyang Zhou et al. 2018`]](http://www.aclweb.org/anthology/P18-1103)

构造了一些对齐矩阵

1. 原始`word embedding` 矩阵
2. 第一层`Attention`: 多轮 Contetxt 和 Response 每个词
3. 第二层`Attention`: 第一轮结果和新的 Response

重复 2.3H 次 就可以得到 1+2H 层（H 为 Transformer 层数）对齐矩阵

再把这 2H+1 维对齐矩阵 喂到 CNN 中训练

DAM 最核心的地方 在于 2H 层 Attention 的构造 Paper 中给出了具体的解释证明 证明两个 Attention 相互作用

目前`DAM`模型可以获得不错的结果

好 基本上 目前常用的模型 介绍完了 也许写完代码会有新的体会 匿了

**---未完待续 期待下一个篇章---**

## Reference

1. [Learning Deep Structured Semantic Models for Web Search using Clickthrough Data [`Po-Sen Huang et al. 2013`]](https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/cikm2013_DSSM_fullversion.pdf)
2. [A Deep Architecture for Semantic Matching with Multiple Positional Sentence Representations[`Shengxian Wan et al. 2015`]](http://www.aaai.org/ocs/index.php/AAAI/AAAI16/paper/download/11897/12030)
3. [Text Matching as Image Recognition [`Liang Pang et al. 2016`]](http://www.aaai.org/ocs/index.php/AAAI/AAAI16/paper/download/11895/12024)
4. [Bilateral Multi-Perspective Matching for Natural Language Sentences [`Zhiguo Wang et al. 2017`]](https://arxiv.org/pdf/1702.03814)
5. [Multi-view Response Selection for Human-Computer Conversation [`Xiangyang Zhou et al. 2016`]](http://www.aclweb.org/anthology/D16-1036)
6. [Sequential matching network: A new architecture for multi-turn response selection in retrieval-based chatbots [`Yu Wu et al. 2017`]](https://arxiv.org/pdf/1612.01627)
7. [Modeling multi-turn conversation with deep utterance aggregation [`Zhuosheng Zhang et al. 2018`]](https://arxiv.org/pdf/1806.09102)
8. [Multi-Turn Response Selection for Chatbots with Deep Attention Matching Network [`Xiangyang Zhou et al. 2018`]](http://www.aclweb.org/anthology/P18-1103)
9. [小哥哥，检索式 chatbot 了解一下？](https://zhuanlan.zhihu.com/p/44539292)
10. [深度文本匹配发展总结](https://blog.csdn.net/xiayto/article/details/81247461)
