---
title: 试谈语言模型中无监督非结构化知识融入
date: 2020-04-06 19:31:13
tags:
  [
    NLP/LM/(KnowledgeInject#KnowledgeBase),
    NLP/QA,
    ML/(kNN#UnsupervisedLearning),
  ]
description: Unsupervised unstructured Knowledge infusion in LMs
---

[🔫 Reading Group 的 pdf 版本](https://www.yuque.com/preview/yuque/0/2020/pdf/104214/1586187444506-2c27d9ef-d29a-4b2f-9581-479901113e1e.pdf)

> 1. 结构化/纯文本

之前的一系列将知识融入 BERT 的工作大多基于 entity 三元组这种结构化数据.

这就要求有大量且高质量的人工标注(当然我们有 HowNet, WordNet, WikiData), 人工标注必然出现大量噪声, 结构化数据更新周期普遍更长.

MLM 的无监督是否是无监督的极限(当然 ERNIE 2.0 那种偏语法的任务也可以算), 能否有一种无监督或者弱监督的任务/模式 增强原先的预训练语言模型中的知识信息.

> 2. LMs are KBs？

[EMNLP 2019 的这篇文章 Language Models as Knowledge Bases?](https://arxiv.org/abs/1909.01066) 设计了 cloze style 的 Probing 实验(大多是 Commensense 的问答任务)来证明语言模型的知识性.

虽然现在看起来语言模型学到的更多还是共现关系, 对于低频词效果没有那么好, 但所蕴含的知识信息几乎和 KBs 类的方法相近.

除去 RoBERTa 这个异类, 之前的工作显示不 fine-tune 时远低于其他 LMs, fine-tune 了又远高于其他.

想办法增加 LMs 的知识能力还是很有道理的.

> 3. 脚注/引用

在日常书写中, 其实我们会大量使用脚注/引用来解释真实的含义, 辅助读者理解.

对于语言模型来说, 这部分信息是缺失的.

基于以上几点, 这篇文章浅显的介绍一下目前预训练语言模型中无监督知识融入的一些解决方案.

主要介绍以下两篇工作:

1. Generalization through Memorization: Nearest Neighbor Language Models. ICLR 2020
2. REALM: Retrieval-Augmented Language Model Pre-Training.

## _k_ NN-LM

> [Generalization through Memorization: Nearest Neighbor Language Models](https://openreview.net/forum?id=HklBjCEKvH). ICLR 2020

这篇工作是 ICLR2020 的工作, 出发点是利用 _k_ NN 增强长程依赖(这已经不是长程了, 叫跨篇章依赖更合适一点).

<center><img width="750" src="https://cdn.nlark.com/yuque/0/2020/png/104214/1586187950211-30431f66-e154-437e-93ef-3ec3c0ba0b0e.png"></center>

做法很简单. 拿 BERT-base 对数据中的每一个 token 生成一个(上下文表征 k-(其他 LMs 可能是只有上文), 当前词 v) Pair 对, 合成一个很大的集合 N.

当预测时需要获取表征的时候, 计算 N 中每一个 k 与当前词计算得到的表征之间的距离, 此处使用 L2 距离进行计算.

最后预测词关于 x 的条件概率. 由两部分组成, 原先的 LM 概率和 kNN 的概率, 两者插值之后获得最后结果.

模型在训练过程中不 fine-tune 预训练模型参数, 利用 FAISS 来优化检索空间(一种优化版的 LSH).

<center><img width="750" src="https://cdn.nlark.com/yuque/0/2020/png/104214/1586187952486-4027cb66-7bcd-4cf0-94b5-a5b51b6f56d9.png"></center>

主要在 WikiText 103 和 BookCorpus 上做了测试, 其中 WikiText 103 的 baseline 是 Adaptive Input Representations for Neural Language Modeling.

其主要思想是按照词频分成 N 个桶, 桶之间的 embedding size 随着指数减小, 借鉴了 Adaptive Softmax 的想法, 之前是 WikiText103 的 SOTA.

对比 Transformer-XL 的结果, 可以看出 kNN-LM 带来的 ppl 的提升还是很明显的.

直观上来看 ppl 表征的是语言模型概率等可能输出个数, 或者是平均概率下选取到正确输出需要的次数.

kNN 的想法显著的提升 ppl 就可以理解为在语义相近的情况下, 增强了显著的共现模式, 从而减小了等概率个数.

<center><img width="800" src="https://cdn.nlark.com/yuque/0/2020/png/104214/1586187953989-c9b278ed-5fef-4f81-8a0b-0cf2eb4e8ce5.png"></center>

对比拿数据 Fine-tune 和拿数据做 dataStore, 在用 WikiText 103 Fine-tune 模型的基础上用 WikiText 3B 做 dataStore 的效果显著比拿数据 Fine-tune 效果好.

跨领域/zero-shot 的实验中也能发现即使没有在 BookCorpus 上学习过, 只用 BookCorpus 制作 DataStore 蕴含的信息能提升 ppl 14 个点, 虽然和 fine-tune 的结果还有差距.

<center><img width="800" src="https://cdn.nlark.com/yuque/0/2020/png/104214/1586187955170-54fd30eb-e9a1-4b0f-b674-3a31e0094dc4.png"></center>

还测试了 Transformer 结构中不同位置的输出对于最后提升的影响（看起来这个作者有点闲

得到的结果是 FFN 之前 LN 之后这个位置效果最好, 笔者的理解是 MHSA 更关注与当前 sentence 本身, FFN 更关注与上下文的 memory, 不经过 FFN 可以更突出当前句子的信息.

<center><img width="800" src="https://cdn.nlark.com/yuque/0/2020/png/104214/1586187956980-6b8564db-d9d5-4705-b184-d8f3345b1675.png"></center>

当然有人会怀疑 kNN 这种模式是否和 n-gram 类似, 作者对比了 n-gram 和 kNN 的结果, 使用 n-gram 之后 performance 变化不大.

最后讨论了一下显示存储 memory 和隐式存储 memory 两种情况, 这边作者用去掉 Dropout 来模拟隐式存储 memory。 他的论点是 loss 已经降到 0 了说明模型已经蕴含所有必要的知识了. 对比使用 Dropout, 效果差很多.

当然这个问题更多的是一个如何利用 memory, 上面的实验最起码可以证明 Transformer 理论上是具有很强的 memory 能力的.

几点讨论:

1. kNN-LM 的方式本质上来讲还是一种利用检索增强共现模式的知识融入.
2. 需要构建 dataStore 的数据集和测试集之间存在较强的关联度.
3. 对于时间复杂度部分, 作者在 openview 的时候说明大概花费和 fine-tune 差不多的时间, 在 interface 阶段会比纯 Transformer 要慢一点, 大概从 500 tokens per second 降到 60 tokens per second.
4. 目前尚不清楚这种模式是否能在其他下游任务 work, 虽然直观上来感受应该是能增强表征的, 还是需要更多的实验进行验证.
5. 这篇文章中 k 取得是 1024, 是一个比较大的数, 画出来的曲线可以看出随着 k 的增大, ppl 能不断的下降.

## REALM

> [REALM: Retrieval-Augmented Language Model Pre-Training.](https://arxiv.org/abs/2002.08909)

<center><img width="500" src="https://cdn.nlark.com/yuque/0/2020/png/104214/1586187960615-3df26a0f-3916-4ed7-876d-39534251f1ba.png"></center>

这篇的工作是在几位 dalao ACL2019 那篇 [ORQA](https://arxiv.org/abs/1906.00300) 的基础上做的工作. 共一和通讯作者是 BERT 四分之二作者.

这篇文章主要是在 Open domain QA task 上做的工作(毕竟是谷果的核心业务 👍)

大概思路是利用一个隐式的 Retriever 来扩展语料增强语义, 即`$p(y | x)=\sum_{z \in \mathcal{Z}} p(y | z, x) p(z | x)$`

将预测词相对于上下文的条件概率展开成相关篇章基于上下文的概率与预测词相对于上下文和篇章的概率乘积之和.

- 对于预训练模型来说, x 是被 mask 之后的 sentence, y 是预测的被 mask 掉的那些词.
- 对于 Fine-tune 来说, 比如说 open-QA x 就是问句 y 则是答案

对于 Retriever 来说, input 得到的 embed 和 document 得到的 embed 矩阵相乘过一个 softmax 就是 z 相对于 x 的概率输出.

- 具体来说输入 x 的 embed, 是 x 这句话的 CLS 指示符的 BERT representation 输出, 再乘上一个线性矩阵(在 ORQA 中这个矩阵起到缩小维度的作用)
- 文档的 embed 则是将 document 的 title 和 body 拼接起来用 sep 分割, 同样取 CLS 的输出再乘上一个线性矩阵
- 这边考虑两个 Embed 相乘, 感觉更多的预先处理的角度.

`\begin{equation}p(z | x)=\frac{\exp f(x, z)}{\sum_{z^{\prime}} \exp f\left(x, z^{\prime}\right)}\end{equation}`

`\begin{equation}f(x, z)=\text { Embed }_{\text {input }}(x)^{\top} \text { Embed }_{\text {doc }}(z)\end{equation}`

`\begin{equation}\text { Embed }_{input}(x)=\mathbf{W}_{\text {input }} BERT_{\text {CLS }}\left(\text { join }_{\text {BERT }}(x)\right)\end{equation}`

`\begin{equation}\text { Embed }_{\text {doc }}(z)=\mathbf{W}_{\text {doc }} BERT_{\text {CLS }}\left(\text { join }_{\text {BERT }}\left(z_{\text {title }}, z_{\text {body }}\right)\right)\end{equation}`

知识增强编码器的计算分为预训练和微调两个模式

- Pre-trained.
  - j 位置预测为 `$y_j$` 的概率乘积
  - 而 `$y_j$` 在 z, x 下的概率与拼接 x 与 z 的正文部分得到的在 `$Mask_j$` 位置的表征的指数次呈正相关.
- Fine-tune
  - n 个 span 的表征之和
  - span 的表征则为将 x 与 z 的正文部分拼接在一起在 span start end 两个位置的 representations 输出 concat 在一起, 然后过一个 MLP 之和再取指数次.

`\begin{equation} \begin{aligned} p(y | z, x) &=\prod_{j=1}^{J_{x}} p\left(y_{j} | z, x\right) \\ p\left(y_{j} | z, x\right) & \propto \exp \left(w_{j}^{\top} BERT_{MASK(j)}\left(\text { join }_{\mathrm{BERT}}\left(x, z_{\mathrm{body}}\right)\right)\right) \end{aligned} \end{equation}`

当然 z 对于 x 的分布是一个长尾分布, 大部分 z 对于 x 都是没用的, top-K 是一个很显然的思路.
再利用 LSH 这种 MIPS 方法对搜索空间进行优化.
LSH 的思路大概就是高维空间的投影能保留相近的关系, 但投影中相近不能保证高维空间中相近, 所以一般会使用多个 Hash 函数联合判断.
最近 LSH 出镜率还蛮高的, Reformer 之类的都有提到.

因为使用了 LSH, 就需要预计算 document 的 Embed, 但在训练过程中这个 Embed 也会变, 这边就采用了一个延迟更新的想法, 实际中每隔 500step 更新一次 document Embed 参数.
这部分更新的只是 Top-K 的参数.
作者认为经过预训练 Document 的 Embed 已经很好了, 在 Fine-tune 阶段 Document 的 Embed 就固定了不再进行训练了.

<center><img width="500" src="https://cdn.nlark.com/yuque/0/2020/png/104214/1586187962425-9a4993f5-0bc0-4d86-8637-87ac68d15077.png"></center>

然后还加了一些 tricks 上去

1. Span level 的 Mask. 用了在 CoNLL-03 上面 fine-tune 的 BERT-base 作为 chuck 工具来获取 entity 的边界. 后面结果显示这个操作至关重要.(其实觉得 SpanBERT 那个操作有点迷)
2. 考虑到有些 sentence 不需要其他 document 辅助, 在 Document 中增加空 Document.
3. 当 x 句子在检索时, 去除 x 句子所在的 Document, 避免变成单纯的学习到词句匹配.
4. 由上面的描述, 我们可以看出, 这是一个很看重初始化过程的模型.当然也可以理解为就是在 pre-trained 基础上 pre-trained, 看 lr 也是.
   - 对于 Retriever 利用 Inverse Cloze Task (ICT)任务. ICT 任务是将 document 挖去一些句子, 然后判断句子是否属于这个文档. ICT 帮助模型获得除词匹配之外语义匹配的能力.
   - 对于 Knowledge Augment Encoder 来说, 直接使用 BERT-based.

作者除了提出以上模型, 训练方法之外, 还试图解释 Retriever 学习到的内容.

`\begin{equation}\begin{aligned} \nabla \log p(y | x) &=\sum_{z \in \mathcal{Z}} r(z) \nabla f(x, z) \\ r(z) &=\left[\frac{p(y | z, x)}{p(y | x)}-1\right] p(z | x) \end{aligned}\end{equation}`

`$\log p(y|x)$`对 Retriever 参数求偏导可以得到[(这一部分推到可以参考我在 pdf 中手推的过程)](https://www.yuque.com/preview/yuque/0/2020/pdf/104214/1586187444506-2c27d9ef-d29a-4b2f-9581-479901113e1e.pdf)

相当于模型的梯度是向那些加上 z 条件概率变大的样本.
这也很符合直观感受, Retriever 学到的更多的是筛选能提升 performance 的文档的能力.

如果使用 DrQA 的思路, 上式的导数可化作参考样本的梯度.

实验是主要在 Open-QA 三个数据集上做了测试.
相对于强 baseline ORQA 和 T5 的 11b 两个 baseine 都有显著的提升.

![image](https://cdn.nlark.com/yuque/0/2020/png/104214/1586187964608-682b245d-922f-4a60-84c9-8983719af770.png)

Ablation 实验可以看出参数 Fine-tune 影响不是特别大, mask 机制影响特别大, 基本上包括了所有的提升点.
我的理解是 random Mask 容易使得 sentence 失去原本的语义, 从而对 Retriever 产生巨大的影响.

<center><img width="500" src="https://cdn.nlark.com/yuque/0/2020/png/104214/1586187966387-559dd44f-c2d7-4357-870d-10b0c0307fbe.png"></center>

同样的, 设计了一个 RU 指标, 来 probing Retriever 对模型的影响.

`\begin{equation}\mathrm{RU}(z | x)=\log p(y | z, x)-\log p(y | \varnothing, x)\end{equation}`

![image](https://cdn.nlark.com/yuque/0/2020/png/104214/1586187967534-c1b4dc2b-0740-4ca4-8e45-316be2a95080.png)

![image](https://cdn.nlark.com/yuque/0/2020/png/104214/1586187958825-1374ed91-ddbf-4602-9015-7e053ae013d0.png)

几点讨论:

1. 看起来参数初始化对模型的效果影响很大.
2. 隐变量的方式看起来很优雅, 得到两个副产物: retriever 和 文档级的 representations.
3. 注意到 Mask 策略对结果影响很大, 这是一个隐患, 最好能有一个 ORQA + mask 的对比试验.
4. 这是一种利用无监督的方式将非结构化数据中的知识融入到 LMs 中的策略, 看起来比较自然.究竟是结构化的方法更好一点还是非结构化的更好一点呢？
5. 可以通过更换语料来较快的更新语言模型中的信息, 但是对于“Thatcher” for “\_\_ is the prime minister of United Kingdom.”模型还是回答错了.个人的理解这种方式更多的还是增强共现关系的策略, 当然这个时候结构化数据可能就有优势. 我觉得除了三元组的方式之外, 对于实效性很强的, 是不是可以只用最近的语料进行训练, 这样的效果可能会更好一点.

## 总结

弱监督或者无监督拥有更强的泛化能力, 对于知识融入这个问题来说这两篇工作尝试使用 kNN 和隐变量的方式融入非结构化的信息, 具有开创性.

水平有限, 欢迎讨论.

<!-- <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.5.1/katex.min.css"> -->

<!-- <link rel="stylesheet" href="https://cdn.jsdelivr.net/github-markdown-css/2.2.1/github-markdown.css"/> -->
