---
title: 预训练模型中的可插拔式知识融入-利用Adapter结构
date: 2020-03-08 03:06:06
tags: [NLP, Knowledge]
description: Injecting Knowledge into Language Models using Adapter
---

> 这些天冲浪 🏄 了一下 Arxiv，粗翻了一下二月之后 public 的 NLP 文章(有很大一部分是准备投 ICML 的)。  
> 也拜读了 张驰原 dalao 的新作《Exploring the Memorization-Generalization Continuum in Deep Learning》. (实验真的做的很漂亮,但感觉有点 data-special 不知道能不能推广到 NLP)

今天来讨论一下段楠老师和周明老师的这篇[《K-Adapter: Infusing Knowledge into Pre-Trained Models with Adapters》][1]

## Adapter

为了讲清楚这篇文章，我们先来看下什么是 Adapter

[Parameter-Efﬁcient Transfer Learning for NLP.][2] ICML 2019.

### Motivation

在这个 large pre-trained 模型盛行的时代，Fine-tune 可谓是再正常不过的操作。  
但实际上 Fine-tune 是一个代价很大的操作，虽然它一般能带来很好的效果。  
试想一下，虽然我们用了 Adam 来随机采样一些 train data 来估计全局的梯度，用了很小的 lr.  
但实际上在每一个 batch 中,对于庞大的预训练模型的每一个参数我们都需要更新.  
每一个 epoch, 还得存储所有被更新的参数, 完全没有复用性, 这是很低效的。  
对于低资源的移动端或者高用户特异性的服务提供商 Pass, 这个问题尤为突出。

除了这一点之外:

1. Cloud Service (Pass)
2. 使用 Multi-task 来 fine-tune 时, 如果增加新的任务，则需要重新训练过所有之前的子任务(需要相应的数据).
3. 而使用 连续学习则会在 re-training 的时候遗忘之前学到的知识.
4. 希望能在尽可能减少参数的情况下, 提高性能,接近 Multi-task 的结果.

### Detail

![image](https://cdn.nlark.com/yuque/0/2020/png/104214/1583687915650-b21f5a3f-9316-4208-924f-b19d2d42b800.png)

于是一个很直观的想法, 能不能把最后的 task-special layer 放到模型中间，然后冻住预训练模型参数.

1. 每一个 Transformer 结构都有两个 Adapter 模块, 嵌在 LN 之前. 12 × 2
2. 预训练的 Bert 参数固定(Attention, FFN, 除了 Layer Normalization 参数不固定)
3. 每个 Adapter 由两个 FFN, 一个非线性函数组成, 和一个残差连接组成.
4. 残差连接用于保证参数随机初始化时，模型输出与预训练模型输出一致.
5. 这样一个 Adapter 模型需要 (dm+m) + (dm+d)参数
6. 而因为 LN 输入发生了较大的变化，在这里对 LN 的参数也进行 fine-tune, 实际上这部分参数量很小($y=\frac{x - \mathrm{E}[x]}{ \sqrt{\mathrm{Var}[x] + \epsilon}} * \gamma + \beta$)
7. 故总共一层 Transformer 需要增加(2dm+3d+m), 这部分与 m 有关, 但总的参数量大概是预训练模型总参数量的 3%左右。

### Experiments

在模型的最后一层接一个线性层, 在分类任务 GLUE 和一些额外的分类任务上测试，基本上结果很接近 Fine-tune 的结果.

![image](https://cdn.nlark.com/yuque/0/2020/png/104214/1583687916632-d71e72b2-4464-4f06-a686-49180400f39e.png)

当然只在比较简单的 Classify Task 上测试, 说服力没有那么强。

#### Parameters

既然两者结果很接近 是不是 Fine-tune 实际上并不需要更新那么多参数也能有那么好的结果呢？

这部分对比两个 baseline:

1. 只 Fine-tune Top N 层 Transformer 的参数.
2. 只更新 LN 的参数(Ablation)

![image](https://cdn.nlark.com/yuque/0/2020/png/104214/1583687918228-d6bfedd6-11e4-44b4-b223-f828f0b8026d.png)

1. 当我们减少 Fine-tune 层数的时候, 模型的准确率急剧下降;
2. 而 Adapter 则具有很好的鲁棒性.
3. Fine-tune LN 参数基本没用

#### Does every Adapter layers are significant?

实际上，我们一口气给 24(BERT large)个 Transformer Layer 都加上了 Adapter, 那是不是每一个 Adapter 都很重要？

![image](https://cdn.nlark.com/yuque/0/2020/png/104214/1583687919843-7b516431-6189-4064-9274-fe0cec01bbb5.png)

上述 Ablation 实验结果,我们可以发现:

1. 去除单层 Adapter 基本上对结果没有影响;
2. 低层，尤其是 0-4 层对结果影响不大;
3. 低层蕴含的信息更多是任务通用的，而高层更多是任务特殊的知识;
4. 初始化参数的方差不能过大.

除此之外，还测试了

1. 增加 BN/LN
2. 增加每个 Adapter 的层数
3. 更改不同的激活函数

等等修改，但是发现结果基本没有影响

### PALs

[BERT and PALs: Projected Attention Layers for Efﬁcient Adaptation in Multi-Task Learning.][3] ICML 2019.

同期还有一篇工作也是想尽可能减少 Fine-tune 时参数的更新量, 其将 Task-special Layer 移至 Transformer 两个 LN 之间。

![image](https://cdn.nlark.com/yuque/0/2020/png/104214/1583687921365-9b3a2dc1-0dab-4101-9ee3-f7f13f2e747a.png)

通过先投影到到一个小维度，再连接 Attention 或者其他结构来完成 Fine-tune 的任务.

CS224n 2019 Final Project 中有两位同学对上述两种方法在 SQuAD 2.0 上做了相应的测试, 结果显示 PALs 结果掉的有点多, 而 Adapter-BERT 结果很接近 Fine-tune 结果.

![image](https://cdn.nlark.com/yuque/0/2020/png/104214/1583687923678-ccb105a0-e6b6-4aaf-ac31-ad7673a24c35.png)

## K-Adapter

而这篇文章更侧重于改进预训练过程中 Multi-task 这个过程

![image](https://cdn.nlark.com/yuque/0/2020/png/104214/1583687925114-7c896c24-8723-48f9-95e6-692cbe49d187.png)

### Motivations

1. 预训练模型中嵌入知识信息是很有必要的.
   1. 基于无监督学习的大规模预训练模型更倾向于学习共现信息，而忽略了低频但重要的知识信息。
   2. 在推理任务上效果较差, (Not, reasoning task)
2. Multi-task 会造成知识遗忘, 而且参数计算代价是巨大的
   1. 先前的 KB-based 的 pre-trained LM 大多是基于 multi-task 的
   2. 当融合多种知识的时候 multi-task 代价大，也容易遗忘之前学习过的任务

### Details

所以针对上述问题，本文提出了一个 Adapter-based 的模型来解决上述问题.  
通过并行的 Adapter 层来获得不同类型的知识信息，最后通过 concatenate 来输出，互不影响.

![image](https://cdn.nlark.com/yuque/0/2020/png/104214/1583687926871-16a50202-1515-4910-a63e-cdb6ec4b9535.png)

1. 相对于前面的 Adapter 结构, K-Adapter 将 Transformer 结构直接嵌入到 Adapter Layer 中。
2. 位置结构发生了变化, Adapter-BERT 是直接改造 Transformer 结构，每个 Transformer Layer 都有两个 Adapter Layer; 而 K-Adapter 则将 Adapter 独立出来与 Pre-trained model 平行操作，通过 Concatenate 传递信息, 也不是每层都配有 Adapter Layer, 本文中是在 RoBERTa Large 的第 0, 11, 23 层之后增加有 Adapter 层。
3. 需要的参数量 3(FFN + Transformer) = 3(2dm + d +m) + (3m^2 + m^2 + 8m^2 + 2m)) = 47M 远小于 RoBERTa Large 模型中 16355M 的参数量.
4. 相同的 skip-connect 为了初始化时的一致性(Concatenate 传递了 Transformer 的输出)
5. Concatenate 前一 Adapter 的输出和当前层 Transformer 的输出作为当前 Adapter 的输入. (Concatenate 在这里会造成维度不一致，既然之后都是线性层，用加也是等效的，还能降低参数量)
6. 单个 knowledge task 的输出是最后一个 Adapter 的输出和最后一个 Transformer 输出 Concatenate 在一起, 记为 O_k.
7. 当有多个 Knowledge 一起融入时, Concatenate 每个 Knowledge 输出的结果 Concate(O_1, O_2, ...).
8. 这篇文章使用了两种 Adapter: 事实 Adapter, 语言 Adapter
9. 事实 Adapter 训练一个关系分类任务。通过判断三元组中 entity 是否存在相应关系来学习关系的知识。数据集是过滤 entity 出现小于 50 次的 T-RE-rc. 因为 Entity 长度不一，利用 Pooling 来对齐. 该任务训练 5epochs, Batch size 为 128.
10. 语言 Adapter 则是完成预测依存关系中父节点 index 这个任务。数据集是利用 Stanford Parser 标注的 Book Corpus。因为是 token-level 的任务，最后过一个线性层输出到相应的分类。该任务训练 10epochs, Batch size 为 256

### Baselines

实验对比了最近提出的一些列将知识融入预训练模型的方法.

![image](https://cdn.nlark.com/yuque/0/2020/png/104214/1583687929342-0b913e67-bcfc-4a9b-9869-9f9718a3aa71.png)

1. ERNIE: 对齐 WikiData 中的三元组到 Wikipedia 的句子中, 将用 TransE 预训练的 entity 信息加入到对应的 token 中.
2. LIBERT: 增加 Lexical Relation Classification(LRC)任务，判断上下谓词.
3. SenseBERT: Mask token 使其预测相应的词及其对应的 supersense(类似一个 POS 再加上细粒度的 entity)
4. KnowBERT: 交替训练 BERT 和 Entity Link 任务(freeze)
5. WKLM: 将实体替换为 WikiData 中相同类型的其他实体.
6. BERT-MK: 结构与 ERNIE 相同, 将 TransE 替换为 GATs.

### Experiment

相对于之前那篇 Adapter-BERT, 这篇的实验设计更能说明学习到知识的能力，实验结果也好于之前的工作(原先只是想接近 Fine-tune, 现在是超越)

1. 细粒度实体类型预测

细粒度对于学习到词的表征要求提高了不少，需要模型能分辨出上下文结构对词义造成的差异.

![image](https://cdn.nlark.com/yuque/0/2020/png/104214/1583687927935-a0195a98-d678-4cd8-aaf8-9c5091bd2ead.png)

2. 常识 QA 和开放域 QA

印象里,RoREATa 在常识问答中比 BERT Large 能高 10 多个点，对比 Multi-task 的结果虽然提升不是很大,但还是有明显的提升.

![image](https://cdn.nlark.com/yuque/0/2020/png/104214/1583687930982-e33e5549-331e-4d70-bb60-0785d37bae7a.png)

1. 关系分类

![image](https://cdn.nlark.com/yuque/0/2020/png/104214/1583687932523-e0575150-672e-4633-b1c9-1096d8585135.png)

4. 刺探实验: LAMA(常识性填空问答)

![image](https://cdn.nlark.com/yuque/0/2020/png/104214/1583687934134-84bcc45d-ac20-47a2-a67f-90d0135f18e1.png)

虽然比 RoBERTa 提升明显，但结果低于 BERT Large.
文中解释到, 主要是因为 RoBERTa 使用 byte-level 的 BPE, 而 BERT 使用 char-level 的 BPE.(但为什么之前都都好，就只有这个任务上会)

## References

1. [K-Adapter: Infusing Knowledge into Pre-Trained Models with Adapters.][1]
2. [Parameter-Efﬁcient Transfer Learning for NLP.][2] ICML 2019.
3. [BERT and PALs: Projected Attention Layers for Efﬁcient Adaptation in Multi-Task Learning.][3] ICML 2019.
4. [BERT-A: Fine-tuning BERT with Adapters and Data Augmentation. CS224n 2019 FP.][4]
5. [ERNIE: Enhanced Language Representation with Informative Entities.][5] ACL 2019.
6. [Informing Unsupervised Pretraining with External Linguistic Knowledge.][6]
7. [Sensebert: Driving some sense into bert.][7]
8. [Knowledge Enhanced Contextual Word Representations.][8] EMNLP 2019.
9. [Pretrained Encyclopedia: Weakly Supervised Knowledge-Pretrained Language Model.][9] ICLR 2020.
10. [Integrating Graph Contextualized Knowledge into Pre-trained Language Models.][10]

[1]: https://arxiv.org/abs/2002.01808
[2]: https://arxiv.org/abs/1902.00751
[3]: https://arxiv.org/abs/1902.02671
[4]: http://web.stanford.edu/class/cs224n/reports/default/15848417.pdf
[5]: https://arxiv.org/abs/1905.07129
[6]: https://arxiv.org/abs/1909.02339
[7]: https://arxiv.org/abs/1908.05646
[8]: https://arxiv.org/abs/1909.04164
[9]: https://arxiv.org/abs/1912.09637
[10]: https://arxiv.org/abs/1912.00147
