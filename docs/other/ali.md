---
title: Ali Test
date: 2018-09-21 14:56:01
tags: [Math]
description: Test Latex
---
# No.1

## **A**

本题有两种优惠券活动，分别为每满`60-5`，满`299-60`.

* 对250元的耳机而言，如果不凑单，则优惠4×5=20元，实际花费230元

* 对600元的音箱而言，如果不凑单，则优惠10×5+60=110元，实际花费490元

* 对于一起购买音箱+耳机，如果不凑单，则优惠14×5+60=130元，实际花费720元

 首先，一起分开购买比一起购买划算，因为对于优惠力度更大的299-60，单独购买可能可以使用2次，一起购买只能使用一次。

`$\alpha$`  对于,耳机而言,有:

`
\begin{equation}
   \begin{aligned}
    &\min S_e \\
    & \begin{array}{r@{\quad}l@{}l@{\quad}l}
    s.t.& S_e=S_{eo}-\dfrac{S_{eo}}{60}×5-30×sign(S_{eo}-299)-30\\
    &S_{eo}\ge250
  \end{array}
  \end{aligned}   
\end{equation}
`

* when `$S_{eo}\in[240,299)$`,`$S_e=S_{eo}-20$`,故在`$S_{eo}=250$`时取到最小值`$S_e=230$`
* when `$S_{eo}\in[299,299]$`,`$S_e=S_{eo}-80$`,故在`$S_{eo}=299$`时取到最小值`$S_e=219$`
* when `$S_{eo}\in[300,+\infty]$`,`$S_e=S_{eo}-\dfrac{S_{eo}}{60}×5-60=\dfrac{11S_{eo}}{12}-60$`故在`$S_{eo}=300$`时取到最小值`$S_e=215$`

且当故在`$S_{eo}=300$`时取到最小值`$S_e=215$`

`$\beta$` 同理，对音箱而言，有：

`
\begin{equation}
   \begin{aligned}
    &\min S_v \\
    & \begin{array}{r@{\quad}l@{}l@{\quad}l}
    s.t.& S_v=S_{vo}-\dfrac{S_{vo}}{60}×5-60\\
    &S_{vo}\ge600
  \end{array}
  \end{aligned}   
\end{equation}
`

when `$S_{vo}\in[600,+\infty]$`,`$S_v=S_{vo}-\dfrac{S_{vo}}{60}×5-60=\dfrac{11S_{vo}}{12}-60$`故在`$S_{vo}=600$`时取到最小值`$S_v=490$`

综上所述，总花费=215+490=705元

## **B**

### B.1

当至少一项比A店优惠

* 若耳机更优惠，则需要`$S_{be}\le214$`
  - `$S_{be}=S_{beo}-x-30×sign(S_{eo}-299)-30$`
    * when `$S_{beo}\in[250,299]$`,`$S_{be}=S_{beo}-x$`,故在`$S_{beo}=250$`时取到最小值`$S_{be}=250-x$`
    * when `$S_{beo}\in[299,+\infty]$`,`$S_{be}=S_{beo}-x-60$`,故在`$S_{beo}=299$`时取到最小值`$S_{be}=239-x$`
  - 故`$min(S_{be})=239-x$`, so, `$x\ge25$`
* 若音箱更优惠，则需要`$S_{bv} \le 489$`
  - `$S_{bv}=S_{bvo}-x-60$`
    * when `$S_{bvo}\in[600,+\infty]$`,`$S_{bv}=S_{bvo}-x-60$`,故在`$S_{bvo}=600$`时取到最小值`$S_{be}540-x$`
  - 故`$min(S_{bv})=540-x$`, so, `$x\ge51$`

故，综上所述当 $x\ge25$时，B店至少有一样产品会比A店便宜

### B.2

两项合买的总金额比A店便宜

在当前问题中，仍然是分开购买比一起购买优惠

故，根据B.1中分析所得，$min(S_{be})=239-x$，$min(S_{bv})=540-x$

得到$min(S_{b})=779-2x$, so `$x\ge37.5$`

## **C**

### C.1

因为计算盈利率，假设$p_1\ge c_1$,$p_2\ge c_2$

在分析中假定售价$p_1$为定值，则

`$r_1=P(p_1\le S_1)×(p_1-c_1)=\dfrac{u_1-p_1}{u_1}×(p_1-c_1)$`

所以当`$p_1^*=\dfrac{u_1+c_1}{2}$`时利润$r_1$最大为$r_1^*=\dfrac{c_1^2+u_1^2-2c_1u_1}{4u_1}$

同理当`$p_2^*=\dfrac{u_2+c_2}{2}$`时利润$r_2$最大为$r_2^*=\dfrac{c_2^2+u_2^2-2c_2u_2}{4u_2}$

### C.2

因为$S_1,S_2$为独立同分布，则$S=S_1+S_2$

故求得$S$的概率密度，从而求得$r_{12}$

`$r_{12}=\begin{equation}
\left\{
​             \begin{array}{}
​             \dfrac{1}{2u_1u_2}(u_1+u_2-p_{12})^2(p_{12}-c_{12}), & max(u_1, u_2)\le p_{12} \le u_1+u_2 \\
​             \dfrac{2u_1u_2-p_{12}^2+(p_{12}-min(u_1, u_2))^2}{2u_1u_2}(p_{12}-c_{12}), &  min(u_1, u_2) \le p_{12}\le max(u_1, u_2)\\
​             \dfrac{2u_1u_2-p_{12}^2}{2u_1u_2}(p_{12}-c_{12}), & c_{12}\le p_{12}\le min(u_1, u_2)\\
​             \end{array}
\right.
\end{equation}$`

则`$r_{12}’=\begin{equation}
\left\{
​             \begin{array}{}
​             k_1(p_{12}-(u_1+u_2))(3p_{12}-(2c_{12}+u_1+u_2)), & max(u_1, u_2)\le p_{12} \le u_1+u_2 \\
​             k_2(-4p_{12}+2c_{12}+2max(u_1, u_2)+min(u_1,u_2)), &  min(u_1, u_2) \le p_{12}\le max(u_1, u_2)\\
​             k_3(-3p_{12}^2+2p_{12}c_{12}+2u_1u_2), & c_{12} \le p_{12}\le min(u_1, u_2)\\
​             \end{array}
\right.
\end{equation}$`

可以看出函数$r_{12}$呈现`w`形趋势，故在$\dfrac{2c_{12}+2max(u_1,u_2)+min(u_1,u_2)}{4},\dfrac{2c_{12}+u_1+u_2}{3}$两处可能取到最大值

因为$u_1, u_2$地位相同，不妨设`$u_1<u_2$`

* when `$p_{12} = \dfrac{2c_{12}+2max(u_1,u_2)+min(u_1,u_2)}{4}$`, `$r_{12} = 1+\dfrac{(u_1-2c_{12})^2-4u_2^2}{16u_2}$`
* when `$p_{12} = \dfrac{2c_{12}+u_1+u_2}{3}$`, `$r_{12} = \dfrac{2(u_1+u_2-c_{12})^3}{27u_1u_2}$`

得到$p_{12}^* = \dfrac{2c_{12}+2max(u_1,u_2)+min(u_1,u_2)}{4}$, `$r_{12}^* = 1+\dfrac{(u_1-2c_{12})^2-4u_2^2}{16u_2}$`

### C.3

`\begin{equation}
r_{total}= r_1^*+r_2^*=\dfrac{c_1^2+u_1^2-2c_1u_1}{4u_1} + \dfrac{c_2^2+u_2^2-2c_2u_2}{4u_2}
\end{equation}`

`\begin{equation}
r_{12}^* = 1+\dfrac{(u_1-2c_{12})^2-4u_2^2}{16u_2}
\end{equation}`

单卖和捆绑销售 利润随着$u_1,u_2,c_{12}$等发生改变

# NO.2

## **A**