---
title: ⛵️ Interview Todo List
date: 2020-04-14 14:23:56
tags: [NLP, Interview]
description: Interview Todo List
---

> ⛵️ Interview Todo List

- [The detail of ML](#the-detail-of-ml)
  - [概率图模型](#%e6%a6%82%e7%8e%87%e5%9b%be%e6%a8%a1%e5%9e%8b)
- [信息检索](#%e4%bf%a1%e6%81%af%e6%a3%80%e7%b4%a2)
- [NLP](#nlp)
  - [词向量](#%e8%af%8d%e5%90%91%e9%87%8f)
- [Project](#project)
  - [Nested NER](#nested-ner)
- [Coding](#coding)

## The detail of ML

> [手推笔记](https://www.yuque.com/preview/yuque/0/2020/pdf/104214/1586845709769-b3a7cd85-703b-443a-80b8-26af3a44b35c.pdf)

- [ ] SVM
  - Laplace
  - SMO: sequence minimal optimization
    - 违背 KKT 程度最大的
      - KKT: 拉格朗日乘子
      - 最小化 f(x) 所以导数 f==0 => 在 g(x) <= 0
    - 样本间隔最大的
  - 核函数
  - 软间隔
  - Hinge
  - 结构风险最小化算法 (L2)
- [ ] Decision Tree
  - 划分选择: 信息增益 ID3, 增益率 C4.5, 基尼 CART
  - 剪枝: 预剪枝, 后剪枝
  - 连续值: 二分划分
  - 缺失值: 非缺失值信息增益\*rou
  - AdaBoost
    - 前一个分类器分类错的 会被加强
    - 权值
  - GBDT
    - 梯度 误差负梯度
    - 残差版本: 以残差为 目标函数
    - Loss 均方差
  - XGBoost
    - 很多 CART
    - 回归树
    - 目标函数(第 n 个树的目标) 带上 正则项(叶子 + 打分^2)
    - GB 是一阶导 用到二阶导
    - 分位数
  - 随机森林 采样
    - 随机抽取样本 有放回
    - 抽取属性 m <<M 然后再分裂
    - 没有剪枝
    - 好处: 平衡误差
  - LightGBM
    - leaf-wise / level-wise
    - 支持类别特征，不需要进行独热编码处理
    - 直方图遍历
- [ ] LDA：
  - doc-topic, topic-word
  - 吉布斯采样, Dirichlet 分布
- [ ] LSI: 潜语义索引
  - SVD 前 k
- [ ] LSH: 局部敏感哈希
  - 分桶 MinHash(映射到低维 仍保持相似性)
  - REFORMER: Attention should focus on too much.
- [ ] Jaccard 相似度(雅卡尔): 交并集
- [ ] TF-IDF
- [ ] 朴素贝叶斯
  - 属性条件独立假设
  - 概率分布估计
- [ ] EM
  - 参数推隐变量的期望
  - 由隐变量的期望, 观测值极大似然估计参数
- Sigmoid Vs Softmax
- 朴素贝叶斯
- Boosting/Bagging/Stacking
- 优化器
  - Adam
  - RMSprop
  - AdaFactor
- KNN/ K-means
- SoftMax 求导
  - diag(softmax(x)) - softmax(x)softmax(x)T
- LR DT SVM 区别
- 梯度下降 牛顿法(2 阶导-Hessian 矩阵的逆 \* 1 阶导)
  - sqrt
- 正则化
  - 拉普拉斯
  - 岭回归 最小二乘法 逆 平滑操作
  - L1 稀疏
  - L2 权重衰减
  - 证明
    - 优化角度
      - 条件
    - 梯度角度
    - 概率角度
      - Laplace
      - Gausses
- AUC
  - FP% vs TP%
- GNN
- 指针网络
- 半监督
  - self-training
  - co-training
- Meta-learning
- Multi-task

### 概率图模型

> [手推](https://www.yuque.com/preview/yuque/0/2020/pdf/104214/1586845719539-9b32d025-28d8-4519-89e3-627b0d2b1221.pdf)

- [ ] HMM
  - 分词 SBME
  - 新词发现
  - P(y|x) = P(x|y)P(y)\*C
- MEMM
  - 最大熵马尔科夫模型
  - 二元
  - 归一化为局部概率和的乘积 - CRF 全局概率和
  - 可并行化
  - 简化 Seq2Seq decoder
  - 存在 label bias
  - 双向 MEMM
- [ ] CRF
  - 无向概率图模型.
  - 隐变量与观测值之间的特征关系 + 当前隐变量与前后的隐变量
  - 二元展开
  - 条件概率转换为观测值与二元隐变量之间的某种表达形式之和
  - = 一族 一元条件概率 和 二元函数(非条件概率，联合概率比上两个一阶条件概率的乘积) 相乘
  - 线性 CRF 假设后面那个二阶函数为与观测值无关的 仅与二元变量有关的函数(即状态转移函数)
  - L = -logP = - sumH - sumG + logZ
  - Z(t+1) = Z(t)G H(t+1)(|x)
  - 维特比: 到达该状态所有路径概率最大

## 信息检索

- Lucene

## NLP

### 词向量

- CBOW & SG
  - negative sample
  - hiercial softmax
- Glove
  - LSA: SVD
  - 相对概率
- ELMO
- BERT
  - MLM
  - The effect of random Mask
- XLNet
  - 排列 Mask
  - Context Mask
  - 相对位置编码
  - Recurrent
- RoBERTa
  - 动态 Mask
  - BBPE
- AlBERT
  - 分解
  - SOP
  - Dropout
- ELECTRA
  - Discriminator
  - w/o Mask

* Attention
* RNN & GRU & LSTM
* LN
* Sentence Embedding

- LaserTagger
- 平滑

## Project

### Nested NER

- [ ] Relation Work
  - Translation-based
  - layer
  - MRC
- Focal Loss
- Dice Loss
- Overlapping example:
  - blood in stomach and overlying lac.

## Coding

1. atoi
2. 判断二叉查找树
3. 最小覆盖字串
4. 大数集合 A 和 B 求交集
5. T 个数找重复最多的 10 个
6. 最长公共子串
7. 旋转字符串
8. 计数排序
9. 字符串包含
10. 最长回文子串 dp[i][j] for jj in (2, M + 1): for b in range(M - jj + 1): Manacher
11. k 小
12. 2-sum
13. 3-sum
14. 和为 n 的多个数 背包
15. 最大连续和 currNum maxSum
16. 跳台阶 t_n = t_n-1 + t_n-2
17. 三色排序
18. 完美洗牌 O(N) O(1) 走圈
19. KMP
20. 旅行商
