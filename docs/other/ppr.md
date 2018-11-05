---
pageClass: custom-page-class
---

# PPR

首先我们应该对[什么是PageRank](/other/pageranks.md)有了一定概念 没有的话请点👈

$PR(u) =\alpha \sum\limits_{v \in N_{in}(u)}^N \dfrac{1}{N_{out}(v)}PR(v) + (1-\alpha) \dfrac{1}{n}$

$\vec{PR}^{l \cdot T}=\alpha ^l\vec{PR}^{0\cdot T}P^l+\dfrac{1-\alpha}{n}\vec{1}^T(\alpha^{l-1}\cdot P^{l-1}+\cdot \cdot \cdot+\alpha P + I)$

PageRank相对于站在上帝视角进行评价所有节点的重要程度值

必须遍历所有网络上的节点才能进行计算

实际上我们并不知道互联网有多大 也没法从全局的视角评价所有节点

于是就有学者提出PPR

跟我念 `PPAP` `PPAP` `PPR`

> PPR = Personal Page Rank value

以个人节点角度出发 计算PageRank值

$PPR_s(u) =\alpha \sum\limits_{v \in N_{in}(u)}^N \dfrac{1}{N_{out}(v)}PPR_s(v) + (1-\alpha) \dfrac{1}{n}$

PPR的值都是基于某一个节点s的，这样的话就可以从两个方面对PPR进行研究

* 给定一个Source S, 返回所有节点关于s的PPR值
* 给定一个Source S, 返回Top-K节点关于s的PPR值
    + 当然在之前的研究当中Top-K就是把所有节点的PPR值计算一遍 然后再  直到去年吧 嗯（我们稍后分析）
    + 对于这种问题 如果PPR值比较小，那么对他估计误差较大 就不是特别重要（当然不能误差到Top-K）

当然 在计算PPR的时候 还是需要进行递归计算的

递归就需要边界

* $|\tilde{\pi}(s,t)-\pi(s,t)|\le\epsilon\pi(s,t)$

* $\pi(s,t)\le\delta$ (一般而言 $\delta = O(1/n)$)

* 举个栗子, 在选Top-3的时候

    $\pi(s,v_1)=0.45 ,\pi(s,v_2)=0.2, \pi(s,v_3)=0.18, \pi(s,v_4)=0.17, \epsilon=0.1, \delta=0.01$

    在$\tilde{\pi}(s,v_1)=0.45,\tilde{\pi}(s,v_2)=0.2, \tilde{\pi}(s,v_4)=0.18$时，有

    $|\tilde{\pi}(s,v_4)-\pi(s,v_4)|\le0.1\pi(s,v_4), |\pi(s,v_4)-\pi(s,v_3)|\le0.1\pi(s,v_3)$

    不再care top-K后面的排序和值是否是对的

当然PPR的有极强的工业应用场景

比如说鹅厂的王牌游戏-王者荣耀的好友推荐就是基于PPR的
