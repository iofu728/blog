---
title: LeetCode 总结
date: 2020-08-24 20:50:00
tags: [Coding/PAT]
description: LeetCode key points record
---

- [动态规划](#动态规划)
  - [一维 dp](#一维-dp)
  - [二维 dp](#二维-dp)
  - [区间 dp](#区间-dp)
  - [三维 dp](#三维-dp)
  - [树形 dp](#树形-dp)
  - [背包问题](#背包问题)
  - [公车上下车问题/差分数组](#公车上下车问题-差分数组)
  - [状态压缩 Dp (可跳过)](#状态压缩-dp-可跳过)
- [字符串处理](#字符串处理)
  - [栈](#栈)
  - [计算器](#计算器)
  - [字符串匹配](#字符串匹配)
  - [前缀树 (可跳过)](#前缀树-可跳过)
- [遍历、DFS、贪心](#遍历、dfs、贪心)
  - [遍历](#遍历)
  - [贪心](#贪心)
  - [DFS, 记忆化 DFS](#dfs-记忆化-dfs)
- [队列](#队列)
- [树](#树)
- [链表](#链表)
  - [并查集](#并查集)
- [图](#图)
  - [拓扑排序](#拓扑排序)
  - [最小生成树](#最小生成树)
  - [最短路径](#最短路径)
- [数学题](#数学题)
  - [运算(算数，位)](#运算-算数，位)
  - [线段, 集合](#线段-集合)
  - [平面几何](#平面几何)
  - [函数, 递推关系式](#函数-递推关系式)
  - [组合](#组合)
  - [三色问题](#三色问题)
- [指针](#指针)
- [空间 O(1)](#空间-o-1)
- [数据结构](#数据结构)
- [匹配问题](#匹配问题)

## 动态规划

### 一维 dp

#### [LeetCode 300. 最长上升子序列](https://leetcode-cn.com/problems/longest-increasing-subsequence/)

二维 dp 可以解决这个问题 dp[长度][长度], 但复杂度是 `$O(n^2)$`

利用二分查找优化效率

替换的思路，把当前的上升序列存在 dp 中. nums = [11, 9, 2, 5, 8, 7, 9]

1. dp = [11]
2. dp = [9] # 替换 11 为 9
3. dp = [2] # 替换
4. dp = [2, 5] # dp[-1] < num
5. dp = [2, 5, 8]
6. dp = [2, 5, 7]
7. dp = [2, 5, 7, 9]

O(nlogn)

```python
class Solution:
    def lengthOfLIS(self, nums: List[int]) -> int:
        N = len(nums)
        dp, res = [0] * N, 0
        for ii in nums:
            left, right = 0, res
            while left < right:
                mid = (left + right) // 2
                if dp[mid] < ii:
                    left = mid + 1
                else:
                    right = mid
            dp[left] = ii
            if right == res:
                res += 1
        return res
```

#### [LeetCode 673. 最长递增子序列的个数](https://leetcode-cn.com/problems/number-of-longest-increasing-subsequence/)

同 300 我们也可以采用类似二分查找的想法, 只不过此时需要记录以 num 结尾的可能个数

```python
from collections import defaultdict
class Solution:
    def findNumberOfLIS(self, nums: List[int]) -> int:
        N = len(nums)
        if not N:
            return 0
        dp, total = [], []
        for num in nums:
            index = len(dp) - 1
            if not dp or num > dp[-1]:
                dp.append(num)
                total.append(defaultdict(int))
            else:
                while index >= 0 and dp[index] >= num: # 可改二分
                    index -= 1
                dp[index + 1] = num
            if index + 1 == 0:
                total[index + 1][num] += 1
            else:
                # print(index, total)
                total[index + 1][num] += sum([v for k, v in total[index].items() if k < num])
        return sum(total[-1].values())
```

#### [LeetCode 712. 两个字符串的最小 ASCII 删除和](https://leetcode-cn.com/problems/minimum-ascii-delete-sum-for-two-strings/)

> 求使得两个字符串相同所需要的最小删除 ASCII 和.

dp[ii 位置以后][jj位置以后] 所需要的最小删除和

1. 初始化. `\begin{equation}dp[k][m] = sum(ord(ii)), dp[N][k] = sum(ord(ii))\end{equation}`
2. 若 `\begin{equation}s1[ii] == s2[jj], dp[ii][jj] = dp[ii + 1][jj + 1]\end{equation}`
3. 否则，则需要求 `\begin{equation}min(s1[ii]+ dp[ii + 1][jj], s2[ii] + dp[ii][jj + 1])\end{equation}`

```python
class Solution:
    def minimumDeleteSum(self, s1: str, s2: str) -> int:
        N, M = len(s1), len(s2)
        dp = [[0] * (M + 1) for _ in range(N + 1)]
        for ii in range(N - 1, -1, -1):
            dp[ii][M] = dp[ii + 1][M] + ord(s1[ii])
        for jj in range(M - 1, -1, -1):
            dp[N][jj] = dp[N][jj + 1] + ord(s2[jj])
        for ii in range(N - 1, -1, -1):
            for jj in range(M - 1, -1, -1):
                if s1[ii] == s2[jj]:
                    dp[ii][jj] = dp[ii + 1][jj + 1]
                else:
                    dp[ii][jj] = min(dp[ii + 1][jj] + ord(s1[ii]), dp[ii][jj + 1] + ord(s2[jj]))
        return dp[0][0]
```

#### [LeetCode 5500. 乘积为正数的最长子数组长度](https://leetcode-cn.com/problems/maximum-length-of-subarray-with-positive-product/)

> 求乘积为正最长子数组长度.

需要考虑为 0 或者转负时，都需要去更新 res

```python
class Solution:
    def getMaxLen(self, nums: List[int]) -> int:
        N = len(nums)
        dp = [[0] * 2 for _ in range(N + 1)]
        res = 0
        for ii in range(N):
            if nums[ii] > 0:
                dp[ii + 1][0] = dp[ii][0] + 1
                dp[ii + 1][1] = dp[ii][1] + 1 if dp[ii][1] else dp[ii][1]
            elif nums[ii] < 0:
                dp[ii + 1][0] = dp[ii][1] + 1 if dp[ii][1] else 0
                dp[ii + 1][1] = dp[ii][0] + 1
                res = max(dp[ii][0], res)
            else:
                res = max(dp[ii][0], res)
        return max(dp[N][0], res)
```

#### [LeetCode 931. 下降路径最小和](https://leetcode-cn.com/problems/minimum-falling-path-sum/)

> 一行选一个数，只能相邻列。求最小下降和.

和金字塔一样，自底向上 dp

```python
class Solution:
    def minFallingPathSum(self, A: List[List[int]]) -> int:
        dp = A[-1]
        N = len(A)
        for ii in range(N - 2, -1, -1):
            # print(ii, dp)
            tmp = dp.copy()
            for jj in range(N):
                tmp[jj] = A[ii][jj] + min(dp[max(jj - 1, 0): jj + 2])
            dp = tmp
        return min(dp)
```

#### [LeetCode 1105. 填充书架](https://leetcode-cn.com/problems/filling-bookcase-shelves/)

> 有一堆书(长宽), 给定一个书架(限定宽度), 求最小高度

dp[ii] 存放截止当前书 最小高度

从 ii 出发拓展，看这层最多能放下几本书, `\begin{equation}dp[ii] = min(dp[ii], dp[jj - 1] + h) jj\end{equation}` 为最多这层能塞下的左边界, h 为这层的最大高度

```python
class Solution:
    def minHeightShelves(self, books: List[List[int]], shelf_width: int) -> int:
        N = len(books)
        dp = [10**9 + 7] * (N + 1)
        dp[0] = 0
        for ii in range(1, N + 1):
            h, jj, tmp = 0, ii, 0
            while jj > 0:
                tmp += books[jj - 1][0]
                if tmp > shelf_width:
                    break
                h = max(h, books[jj - 1][1])
                dp[ii] = min(dp[ii], dp[jj - 1] + h)
                jj -= 1
        return dp[-1]
```

#### [LeetCode 96. 不同的二叉搜索树](https://leetcode-cn.com/problems/unique-binary-search-trees/)

> 求 1,2,3,...,n 范围内的数组组成的不同二叉搜索树个数

`\begin{equation}G[n] = \sum_i^n(G[i-1] * G[n-i])\end{equation}`
`$G[n]$` 表示长度为 n 的数组有几个不同的二叉搜索树

```python
class Solution:
    def numTrees(self, n: int) -> int:
        G = [0] * (n + 1)
        G[0] = 1
        G[1] = 1
        for ii in range(2, n + 1):
            G[ii] = sum([G[jj - 1] * G[ii - jj] for jj in range(1, ii + 1)])
        return G[-1]
```

#### [LeetCode 376. 摆动序列](https://leetcode-cn.com/problems/wiggle-subsequence/)

> 求最长摆动序列。交替增减

如果 `$nums[ii] > nums[ii - 1]$`
那么上升序列 = 下降序列 + 1
而下降序列则不能增加保持原状

同理

```python
class Solution:
    def wiggleMaxLength(self, nums: List[int]) -> int:
        N = len(nums)
        if N <= 1:
            return N
        pre_a, pre_b = 1, 1
        for ii in range(1, N):
            if nums[ii] > nums[ii - 1]:
                pre_b = pre_a + 1
            elif nums[ii] < nums[ii - 1]:
                pre_a = pre_b + 1
        return max(pre_a, pre_b)
```

#### [LeetCode 1388. 3n 块披萨](https://leetcode-cn.com/problems/pizza-with-3n-slices/)

> 有 3n 块披萨，每次选一块，邻居两块则会被别人拿，求你拿到披萨的最大值

打家劫舍，隔着一个位拿披萨

```python
class Solution:
    def maxSizeSlices(self, slices: List[int]) -> int:
        def once(s: list):
            N = len(s)
            M = (N + 1) // 3
            dp = [[0] * (M + 1) for _ in range(N + 1)]
            for ii in range(1, N + 1):
                for jj in range(1, M + 1):
                    dp[ii][jj] = max(dp[ii - 1][jj], (dp[ii - 2][jj - 1] if ii - 2 >= 0 else 0) + s[ii - 1])
            return dp[N][M]
        return max(once(slices[1:]), once(slices[:-1]))
```

### 二维 dp

#### [LeetCode 1035. 不相交的线](https://leetcode-cn.com/problems/uncrossed-lines/)

> 顺序写下两行数字，求不相交的连线最多能有几条.

乍一看，DFS 枚举. 实际上还是最长公共子序列的问题. 既然不相交意味着保持相同的顺序.

```python
class Solution:
    def maxUncrossedLines(self, A: List[int], B: List[int]) -> int:
        N, M = len(A), len(B)
        dp = [[0] * (M + 1) for _ in range(N + 1)]
        for ii in range(1, N + 1):
            for jj in range(1, M + 1):
                if A[ii - 1] == B[jj - 1]:
                    dp[ii][jj] = dp[ii - 1][jj - 1] + 1
                else:
                    dp[ii][jj] = max(dp[ii - 1][jj], dp[ii][jj - 1])
        return dp[N][M]
```

#### [LeetCode 1301. 最大得分的路径数目](https://leetcode-cn.com/problems/number-of-paths-with-max-score/)

> 给定一个正方形，从右下角开始移动，每次只能向上、向左、左上。遇到”X“停止，求最长路径和，最长路径数.

dpScore[n][n] 记录最长路径和
dpNum[n][n] 记录最长路径数量

```java
class Solution {
    int MODS = 1000000007;
    int[][] dpScore;
    int[][] dpNum;
    int n;

    public int[] pathsWithMaxScore(List<String> board) {
        n = board.size();
        dpScore = new int[n][n];
        dpNum = new int[n][n];
        for (int[] ii: dpScore){
            Arrays.fill(ii, -1);
        }
        dpScore[n-1][n-1] = 0;
        dpNum[n-1][n-1] = 1;
        for (int i=n-1; i>=0; --i){
            for (int j=n-1;j>=0; --j){
                if(i==n-1 && j == n-1){
                    continue;
                }
                if(board.get(i).charAt(j) != 'X'){
                    update(i, j, i + 1, j);
                    update(i, j, i, j + 1);
                    update(i, j, i + 1, j + 1);
                    if (dpScore[i][j] != -1){
                        dpScore[i][j] += ((board.get(i).charAt(j) == 'E' ? 0 : (board.get(i).charAt(j) - '0')));
                    }
                }
            }
        }
        if (dpScore[0][0] == -1){
            return new int[]{0, 0};
        }
        return new int[]{dpScore[0][0], dpNum[0][0] % MODS};

    }
    public void update(int x, int y, int u, int v){
        if (u >= n || v >= n || dpScore[u][v] == -1){
            return;
        }
        if (dpScore[u][v] > dpScore[x][y]){
            dpScore[x][y] = dpScore[u][v];
            dpNum[x][y] = dpNum[u][v];
        } else if (dpScore[u][v] == dpScore[x][y]){
            dpNum[x][y] = (dpNum[x][y] + dpNum[u][v]) % MODS;
        }
    }
}
```

#### [LeetCode LCP 19. 秋叶收藏集](https://leetcode-cn.com/problems/UlBDOe/)

> 将 ry 组成的字符串分为 ryr 三个部分，不要求每个部分数量相同，求转化成该 pattern 最少需要多少步

dp[ii][3] # 0 - r , 1 - y, 2 - r

```python
class Solution:
    def minimumOperations(self, leaves: str) -> int:
        N = len(leaves)
        dp = [[0] * 3 for _ in range(N)]
        dp[0][0] = leaves[0] == "y"
        dp[0][1] = dp[0][2] = dp[1][2] = float("inf")
        for ii in range(1, N):
            dp[ii][0] = dp[ii - 1][0] + (leaves[ii] == "y")
            dp[ii][1] = min(dp[ii - 1][:2]) + (leaves[ii] == "r")
            dp[ii][2] = min(dp[ii - 1][1:]) + (leaves[ii] == "y")
        return dp[-1][2]
```

#### [LeetCode 403. 青蛙过河](https://leetcode-cn.com/problems/frog-jump/)

> 给定一组石子，青蛙只能通过这些到达对岸，且每次跳跃的距离只能是上一次 k, k + 1, 或者 k - 1.

记录每次到达该节点可最后一步的距离.

```python
class Solution:
    def canCross(self, stones: List[int]) -> bool:
        N = len(stones)
        dp = [set() for _ in range(N)]
        dp[0].add(0)
        for ii in range(N):
            a = stones[ii]
            for jj in range(ii):
                now = a - stones[jj]
                if now - 1 in dp[jj] or now in dp[jj] or now + 1 in dp[jj]:
                    dp[ii].add(now)
        return len(dp[-1]) > 0
```

#### [LeetCode 5815. 扣分后的最大得分](https://leetcode-cn.com/problems/maximum-number-of-points-with-cost/)

> 给定一个 M\*N 的矩阵，每一行取一个数，使得 `$\sum F[i] - abs(i - j)$`其中`$i,j$`是相邻两行选取字符的下角标

`\begin{equation}dp[i][j] = points[i][j] + \max (dp[ii - 1][k] - |k - j|)\end{equation}`

整体复杂度`$O(nm^2)$`

化简，

`\begin{equation} dp[i][j]=\left\{\begin{array}{ll} \text{points}[i][j]-j+\max dp[i-1][k]+k, & k \leq j \\ \text { points }[i][j]+j+\max dp[i-1][k]-k, & k>j \end{array}\right. \end{equation}`

可以通过维护 left max 和 right max 将复杂度降低值`$O(nm)$`

```python
class Solution:
    def maxPoints(self, points: List[List[int]]) -> int:
        M, N = len(points), len(points[0])
        dp = points[0]
        for ii in range(1, M):
            tmp = list(dp)
            left, right = -inf, -inf
            for jj in range(N):
                left = max(left, dp[jj] + jj)
                right = max(right, dp[N - jj - 1] - (N - jj - 1))
                tmp[jj] = max(left - jj + points[ii][jj], tmp[jj])
                tmp[N - jj - 1] = max(right + (N - jj - 1) + points[ii][N - jj - 1], tmp[N - jj - 1])
            dp = tmp
        return max(dp)
```

### 区间 dp

#### [LeetCode 87. 扰乱字符串](https://leetcode-cn.com/problems/scramble-string/)

> 每个字符串都可以用一个二叉树表示，求给定的另外一个字符串是否是当前字符串所属的二叉树交换某两个子树构成的.

dp[i][j] 表示 i->j 区间的

1. 没交换 s1 == t1, s2 == t2
2. 交换 s1 == t2, s2 == t1

```python
class Solution:
    def isScramble(self, s1: str, s2: str) -> bool:
        N, M = len(s1), len(s2)
        if s1 == s2:
            return True
        if N != M or sorted(s1) != sorted(s2):
            return False
        for ii in range(1, N):
            if (self.isScramble(s1[:ii], s2[:ii]) and self.isScramble(s1[ii:], s2[ii:])) or (self.isScramble(s1[:ii], s2[-ii:]) and self.isScramble(s1[ii:], s2[:-ii])):
                return True
        return False
```

#### [LeetCode 5. 最长回文子串](https://leetcode-cn.com/problems/longest-palindromic-substring/)

> 求最长回文子串

dp[i][j] i->j 为回文情况
因为连续正序遍历

### 三维 dp

#### [LeetCode 1320. 二指输入的的最小距离](https://leetcode-cn.com/problems/minimum-distance-to-type-a-word-using-two-fingers/)

> 给定一个字符串，按顺序分成两组，使得两组移动距离之和最小

dp[当前字母][左指][右指]

1. 如果当前由左指从上一个位置移动过来，则 `\begin{equation}dp[ii][cur][jj] = min(dp[ii][cur][jj], dp[ii - 1][prev][jj] + dis)\end{equation}`
2. 如果当前由右指从上一个位置移动过来，则 `\begin{equation}dp[ii][jj][cur] = min(dp[ii][jj][cur], dp[ii - 1][jj][prev] + dis)\end{equation}`
3. 如果当前是左指重新开始移动, 则`\begin{equation}dp[ii][cur][jj] = min(dp[ii][cur][jj], dp[ii - 1][kk][jj] + tmp_d)\end{equation}`
4. 如果当前是右指重新开始移动, 则`\begin{equation}dp[ii][jj][cur] = min(dp[ii][jj][cur], dp[ii - 1][jj][kk] + tmp_d)\end{equation}`

```python
class Solution:
    MAX = 10 ** 9 + 7
    def minimumDistance(self, word: str) -> int:
        def getDist(x: int, y: int):
            ax, ay = x // 6, x % 6
            bx, by = y // 6, y % 6
            return abs(ax - bx) + abs(ay - by)
        N = len(word)
        dp = [[[self.MAX] * 26 for _ in range(26)] for _ in range(N)]
        for ii in word:
            for jj in range(26):
                dp[0][ord(ii) - 65][jj] = 0
                dp[0][jj][ord(ii) - 65] = 0
        for ii in range(1, N):
            cur, prev = ord(word[ii]) - 65, ord(word[ii - 1]) - 65
            dis = getDist(cur, prev)
            for jj in range(26):
                dp[ii][cur][jj] = min(dp[ii][cur][jj], dp[ii - 1][prev][jj] + dis)
                dp[ii][jj][cur] = min(dp[ii][jj][cur], dp[ii - 1][jj][prev] + dis)
                if prev != jj:
                    continue
                for kk in range(26):
                    tmp_d = getDist(cur, kk)
                    dp[ii][cur][jj] = min(dp[ii][cur][jj], dp[ii - 1][kk][jj] + tmp_d)
                    dp[ii][jj][cur] = min(dp[ii][jj][cur], dp[ii - 1][jj][kk] + tmp_d)
        return min([min(dp[N - 1][ii]) for ii in range(26)])
```

### 树形 dp

#### [LeetCode 834. 树中距离之和](https://leetcode-cn.com/problems/sum-of-distances-in-tree/)

> 求树中每个节点到其他节点的距离和

关键是去在 O(n)时间中计算出距离和

`\begin{equation}sum(father) = \sum(sum[p] + cnt[p] + 1)\end{equation}`
`\begin{equation}cnt[father] = \sum(cnt[p])\end{equation}`

`\begin{equation}ans[p] = (ans[father] - sum[p] - cnt[p] - 1) + (n - cnt[p] - 1) + sum[p]\end{equation}`

两遍 DFS

```python
class Solution:
    def sumOfDistancesInTree(self, N: int, edges: List[List[int]]) -> List[int]:
        def dfs(node=0, parent=None):
            # print(node, parent, count, res)
            for v in g[node]:
                if v == parent:
                    continue
                dfs(v, node)
                count[node] += count[v]
                res[node] += res[v] + count[v]

        def dfs_b(node=0, parent=None):
            # print(node, parent, count, res)
            for v in g[node]:
                if v == parent:
                    continue
                res[v] = res[node] - count[v] + N - count[v]
                dfs_b(v, node)
        g = collections.defaultdict(set)
        for ii, jj in edges:
            g[ii].add(jj)
            g[jj].add(ii)

        count = [1] * N
        res = [0] * N
        dfs()
        dfs_b()
        return res
```

### 背包问题

1. 0-1 背包.nums 外层，target 内层, 内层倒序
2. 完全背包.nums 外层，target 内层，内层正序
3. 组合问题.target 内层，nums 外层，内层正序(考虑顺序时)

#### 完全背包

##### [LeetCode 1449. 数位成本和为目标值的最大数字](https://leetcode-cn.com/problems/form-largest-integer-with-digits-that-add-up-to-target/)

> 给定 1-9 数字对应的价值，求价值和为 tgt 的最大数字.

价值恒定，则为完全背包问题
dp[截止 i 数字][总价值=jj] 最大数字

1. 两重循环，如果当前总价值 jj > ii 对应的价值，说明可拆分 => `\begin{equation}dp[ii][jj] = max(dp[ii - 1][jj], dp[ii][jj - cost[9 - ii]] * 10 + 10 - ii)\end{equation}`
2. 否则不行

```python
class Solution:
    def largestNumber(self, cost: List[int], target: int) -> str:
        dp = [[0] * (target + 1) for _ in range(10)]
        dp[0] = [0] + [float("-inf")] * target
        for ii in range(1, 10):
            for jj in range(1, target + 1):
                if jj >= cost[9 - ii]:
                    dp[ii][jj] = max(dp[ii - 1][jj], dp[ii][jj - cost[9 - ii]] * 10 + 10 - ii)
                else:
                    dp[ii][jj] = dp[ii - 1][jj]
        ans = dp[-1][target]
        return str(ans) if ans > 0 else "0"
```

#### 组合问题

##### [LeetCode 377. 组合总和 Ⅳ](https://leetcode-cn.com/problems/combination-sum-iv/)

> 给定一个可选数字的数组候选集，求合为 target 的情况数，(不同顺序不同, 可重复使用).

因为考虑顺序，可重复使用，外层 target，内层 nums

```python
class Solution:
    def combinationSum4(self, nums: List[int], target: int) -> int:
        if not nums:
            return 0
        dp = [0] * (target + 1)
        dp[0] = 1
        for ii in range(1, target + 1):
            for num in nums:
                if ii >= num:
                    dp[ii] += dp[ii - num]
        return dp[target]
```

### 公车上下车问题/差分数组

#### [LeetCode 1109. 航班预订统计](https://leetcode-cn.com/problems/corporate-flight-bookings/)

> 给定一组航班订购订单，每次订购从 i-j 区间所有的天 k 个航班.

记录上下位置，然后再求一次求连续和作为结果。

```python
class Solution:
    def corpFlightBookings(self, bookings: List[List[int]], n: int) -> List[int]:
        dp = [0] * n
        for ii, jj, kk in bookings:
            dp[ii - 1] += kk
            if jj < n:
                dp[jj] -= kk
        for ii in range(1, n):
            dp[ii] += dp[ii - 1]
        return dp
```

#### [LeetCode 1893. 检查是否区域内所有整数都被覆盖](https://leetcode-cn.com/problems/check-if-all-the-integers-in-a-range-are-covered/)

> 给定一系列区间，求问特点区间是否完全在给定区间中

利用差分数组，前缀和表示区间覆盖情况

```python
import bisect
class Solution:
    def isCovered(self, ranges: List[List[int]], left: int, right: int) -> bool:
        diff = [0] * 52
        for ii, jj in ranges:
            diff[ii] += 1
            diff[jj + 1] -= 1
        tmp = 0
        for ii in range(1, 51):
            tmp += diff[ii]
            if left <= ii <= right and tmp <= 0:
                return False
        return True
```

### 状态压缩 dp (可跳过)

#### [LeetCode 464. 我能赢吗](https://leetcode-cn.com/problems/can-i-win/)

> 博弈类题目. 两个玩家轮流选择 1-m 的任何数字(不放回)，第一个累计(两个玩家) >= d 的玩家获胜.

因为 m 不超过 20，使用 1 << 20 个位表示当前选择数字情况

`\begin{equation}dp[1 << m + 1]\end{equation}`

```python
from functools import lru_cache
class Solution:
    def canIWin(self, maxChoosableInteger: int, desiredTotal: int) -> bool:
        @lru_cache(None)
        def dfs(state: int, d: int):
            for ii in range(maxChoosableInteger - 1, -1, -1):
                if not state & (1 << ii): # ii 未被使用过
                    if ii + 1 >= d or not dfs(state + (1 << ii), d - ii - 1): # 可行
                        return True
            return False

        if maxChoosableInteger >= desiredTotal:
            return True
        if (1 + maxChoosableInteger) * maxChoosableInteger / 2 < desiredTotal:
            return False
        return dfs(0, desiredTotal)
```

#### [LeetCode 1125. 最小的必要团队](https://leetcode-cn.com/problems/smallest-sufficient-team/)

> 每个人都有一些技能，团队组建有一个需要技能列表，求满足当前列表的最小团队

0-1 背包, 但是有 n 个属性，不能建立 n+1 维度 => 位图 表示技能掌握情况. 1 << skill_id

dp[1<<skill_ids] 表示满足当前技能点 的最小团队人数

遍历人 i，计算 i 的技能点，按照这个技能点加到其他状态上，如果能有更少的人数则更新团队情况

```python
class Solution:
    def smallestSufficientTeam(self, req_skills: List[str], people: List[List[str]]) -> List[int]:
        N, M = len(req_skills), len(people)
        NN = 1 << N
        skill2id = {jj: ii for ii, jj in enumerate(req_skills)}
        team = {ii: [] for ii in range(NN)}
        dp = [-1] * NN
        dp[0] = 0

        for ii in range(M):
            idx = 0
            for s in people[ii]:
                if s in skill2id:
                    idx = idx | (1 << skill2id[s])
            for jj in range(NN):
                if dp[jj] < 0:
                    continue
                x = jj | idx
                if dp[x] == -1 or dp[x] > dp[jj] + 1:
                    # print(ii, jj, x, team)
                    dp[x] = dp[jj] + 1
                    team[x] = team[jj].copy()
                    team[x].append(ii)
        # print(team)
        return team[NN - 1]
```

#### [LeetCode 5799. 最美子字符串的数目](https://leetcode-cn.com/problems/number-of-wonderful-substrings/)

> 定义“字符串中至多只有一种字符出现次数为奇数”为最美字符串，求给定字符串中子串满足最美字符串的数目

最容易想到的是前 n 和统计字符串情况，但是汇总的时候是 N^2，而且判断代价也很大

奇数次想到异或，利用 `$1 << (ord(i) - ord("a"))$` 表示字符串 idx

汇总时复杂度为 `$ii * 10 = O(N)$`

```python
class Solution:
    def wonderfulSubstrings(self, word: str) -> int:
        c = [0] * (1 << 10)
        c[0] = 1
        now, res = 0, 0
        for ii in word:
            idx = ord(ii) - ord('a')
            now ^= 1 << idx
            res += c[now]
            for jj in range(10):
                res += c[now ^ (1 << jj)]
            c[now] += 1
        return res
```

## 字符串处理

### 栈

#### [LeetCode 726. 原子的数量](https://leetcode-cn.com/problems/number-of-atoms/)

> 统计化学式中原子数量, 存在"(",")"

循环处理数字，栈处理括号

```python
from collections import Counter
class Solution:
    def countOfAtoms(self, F: str) -> str:
        res, stack, pre, pre_num = {}, [Counter()], "", 0
        N, ii = len(F), 0
        while ii < N:
            s = F[ii]
            if s == "(":
                stack.append(Counter())
                ii += 1
                continue
            elif s == ")":
                top = stack.pop()
                ii += 1
                b = ii
                while ii < N and F[ii].isdigit():
                    ii += 1
                num = int(F[b:ii] or 1)
                for k, v in top.items():
                    stack[-1][k] += v * num
            else:
                b = ii
                ii += 1
                while ii < N and F[ii].islower():
                    ii += 1
                name = F[b:ii]
                b = ii
                while ii < N and F[ii].isdigit():
                    ii += 1
                num = int(F[b: ii] or 1)
                stack[-1][name] += num
        t = stack[-1]
        return "".join([k + (str(t[k] if t[k] > 1 else "")) for k in sorted(t)])
```

#### [LeetCode 394. 字符串解码](https://leetcode-cn.com/problems/decode-string/)

> 4[xxx3[n]]

数字在[] 前面 表示括号内内容重复次数.

因为可能出现循环嵌套的问题，需要用两个栈(我们可以用 ArrayList 代替) 来分别存储括号前数字，括号内字符串.

当遇到右括号 栈 pop，并计算相应的倍乘之后的字符串，加到字符串栈最后一个位置的字符串后面

```java
class Solution {
    public String decodeString(String s) {
        List<String> stack = new ArrayList<String>();
        List<Integer> nums = new ArrayList<Integer>();
        stack.add("");
        nums.add(1);
        int idx = 0;
        int N = s.length();
        int num;
        String tmp;
        while (idx < N){
            char cur = s.charAt(idx);
            if (Character.isDigit(cur)) {
                int begin = idx;
                while (idx < N && Character.isDigit(s.charAt(idx))){
                    idx += 1;
                }
                num = Integer.parseInt(s.substring(begin, idx));
                stack.add("");
                nums.add(num);
            } else if(cur == ']'){
                num = nums.remove(nums.size() - 1);
                tmp = stack.remove(stack.size() - 1);
                System.out.printf("%d %s\n", num, tmp.repeat(num));
                stack.set(stack.size() - 1, stack.get(stack.size() - 1) + tmp.repeat(num));
            } else if (cur == ']') {
                if (idx == 0 || !Character.isDigit(s.charAt(idx - 1))){
                    stack.add("");
                    nums.add(1);
                }
            } else {
                stack.set(stack.size() - 1, stack.get(stack.size() - 1) + cur);
            }
            idx += 1;
        }
        return stack.remove(stack.size() - 1);
    }
}
```

### 计算器

#### [LeetCode 227. 基本计算器 II](https://leetcode-cn.com/problems/basic-calculator-ii/)

same as [LeetCode 面试题 16.26. 计算器](https://leetcode-cn.com/problems/calculator-lcci/)

> 正则划分运算符 + 数字
> 遍历数字 和 运算符

栈的深度最多只有 1 可以用数组代替，更新 [-1] 位置的信息

```python
import re


class Solution:
    def calculate(self, s: str) -> int:
        s = re.sub("([*+-/])", r" \1 ", s.replace(" ", "")).split()
        (first, *nums), op = s[::2], s[1::2]
        queue, signs = [int(first)], []
        for o, num in zip(op, nums):
            if o == "*":
                queue[-1] *= int(num)
            elif o == "/":
                queue[-1] //= int(num)
            else:
                queue.append(int(num))
                signs.append(1 if o == "+" else -1)
        return queue[0] + sum([ii * jj for ii, jj in zip(queue[1:], signs)])
```

#### [LeetCode 224. 基本计算器](https://leetcode-cn.com/problems/basic-calculator/)

> 只有 + - （ ）的计算器

和 16.26 最大的区别就是栈的深度变成不定的, 得手动模拟一下栈

```python
class Solution:
    def calculate(self, s: str) -> int:
        def decoder(stack: list):
            res = stack.pop() if stack else 0
            while stack and stack[-1] != ")":
                sign = stack.pop()
                if sign == "+":
                    res += stack.pop()
                else:
                    res -= stack.pop()
            return res
        s = s.replace(" ", "")
        stack = []
        N, n, op = len(s), 0, 0
        for ii in range(N - 1, -1, -1):
            now = s[ii]
            if now.isdigit():
                op = 10 ** n * int(now) + op
                n += 1
            else:
                if n:
                    stack.append(op)
                    n, op = 0, 0
                if now == "(":
                    res = decoder(stack)
                    stack.pop()
                    stack.append(res)
                else:
                    stack.append(now)
        if n:
            stack.append(op)
        return decoder(stack)
```

#### [LeetCode 1106. 解析布尔表达式](https://leetcode-cn.com/problems/parsing-a-boolean-expression/)

> 解析布尔表达式

本质上还是模拟栈，处理"(", ")"

```python
class Solution:
    def parseBoolExpr(self, s: str) -> bool:
        N = len(s)
        stack, op, tmp = [], [], []
        for ii in s:
            if ii == ",":
                continue
            if ii == ")":
                tmp = set()
                while stack and stack[-1] != "(":
                    tmp.add(stack.pop())
                stack.pop()
                op = stack.pop()
                if op == "|":
                    stack.append("t" if "t" in tmp else "f")
                elif op == "&":
                    stack.append("f" if "f" in tmp else "t")
                elif op == "!":
                    stack.append("f" if "t" in tmp else "t")
            else:
                stack.append(ii)
        return bool(stack.pop() == "t")
```

### 字符串匹配

#### KMP

KMP (Knuth-Morris-Pratt) O(m+n)两步走

1. 建立 next 矩阵，表征 s[0:ii] 子串中前缀集合和后缀集合中重叠的最长子串长度
2. 根据 next 矩阵进行匹配.

##### [LeetCode 459. 重复的子字符串](https://leetcode-cn.com/problems/repeated-substring-pattern/)

> 判断字符串是否有多个相同的子串拼接而成.

如果满足条件，例如 s=abab

那么 两个 s 拼接在一起 去掉头尾 bababa 也应该包含字符串 s

利用 KMP，匹配串为 s, 查询串为 s+s[1:-1].

```python
class Solution:
    def repeatedSubstringPattern(self, s: str) -> bool:
        def kmp(query: str, pattern: str) -> bool:
            N, M = len(query), len(pattern)
            next_list = [-1] * M
            for ii in range(1, M):
                jj = next_list[ii - 1]
                while jj != -1 and pattern[jj + 1] != pattern[ii]:
                    jj = next_list[jj]
                if pattern[jj + 1] == pattern[ii]:
                    next_list[ii] = jj + 1
            match = -1
            for ii in range(1, N - 1):
                while match != -1 and query[ii] != pattern[match + 1]:
                    match = next_list[match]
                if pattern[match + 1] == query[ii]:
                    match += 1
                    if match == M - 1:
                        return True
            return False
        return kmp(s + s, s)
```

##### [LeetCode 214. 最短回文串](https://leetcode-cn.com/problems/shortest-palindrome/)

> 只能在字符串前面添加字符，求添加完之后为回文的最短字符串。

本质上去寻找当前字符串从 index 0 开始最长回文串.

套用 KMP, 匹配串为 s, 查询串为 s[::-1], 返回匹配最大长度 t，则 t 之后的子串为需要填补到头部的子串.

```python
class Solution:
    def shortestPalindrome(self, s: str) -> str:
        N = len(s)
        next_list = [-1] * N
        for ii in range(1, N):
            jj = next_list[ii - 1]
            while jj != -1 and s[jj + 1] != s[ii]:
                # print(jj, next_list[jj], s[jj + 1], s[ii])
                jj = next_list[jj]
            if s[jj + 1] == s[ii]:
                next_list[ii] = jj + 1
            print(ii, jj, s[jj + 1], s[ii], next_list[ii])
        best = -1
        for ii in range(N - 1, -1, -1):
            while best != -1 and s[best + 1] != s[ii]:
                best = next_list[best]
            if s[best + 1] == s[ii]:
                best += 1
        add = "" if best == N - 1 else s[best+1:]
        return add[::-1] + s
```

#### Sunday

O(m/n), 从前向后匹配

1. 匹配成功，返回 idx；
2. 匹配失败，看 idx + N 字符是否在需匹配字符中？
   1. 在，idx += (N - 字符在匹配字符的最右 index)
   2. 不在，idx += N + 1

##### [Leetcode 28. 实现 strStr()](https://leetcode-cn.com/problems/implement-strstr/)

裸 Sunday

```python
class Solution:
    def strStr(self, haystack: str, needle: str) -> int:
        def calShiftMat(st):
            dic, K = {}, len(st)
            for ii in range(K - 1, -1, -1):
                if st[ii] not in dic:
                    dic[st[ii]] = K - ii
            return dic

        M, N = len(haystack), len(needle)
        if M < N:
            return -1
        if needle == "":
            return 0
        shift = calShiftMat(needle)
        idx = 0
        while idx + N <= M:
            wait = haystack[idx:idx + N]
            if wait == needle:
                return idx
            if idx + N >= M:
                return -1
            now = haystack[idx + N]
            if now in shift:
                idx += shift[now]
            else:
                idx += (N + 1)
        return -1 if idx + N >= M else idx
```

### 前缀树(可跳过)

前缀树就是以前缀的每一个字符作为 key，递归式的树，常用于前缀匹配中. 时间复杂度 O(n)

> Python 建树

```python
Trie = lambda: collections.defaultdict(Trie)
trie = Trie()
END = True

for root in roots:
    reduce(dict.__getitem__, root, trie)[END] = root
```

> Java 建树

```java
TrieNode trie = new TrieNode();
for (String root: roots) {
    TrieNode cur = trie;
    for (char letter: root.toCharArray()) {
        if (cur.children[letter - 'a'] == null)
            cur.children[letter - 'a'] = new TrieNode();
        cur = cur.children[letter - 'a'];
    }
    cur.word = root;
}

class TrieNode {
    TrieNode[] children;
    String word;
    TrieNode() {
        children = new TrieNode[26];
    }
}
```

#### [LeetCode 648. 单词替换](https://leetcode-cn.com/problems/replace-words/)

> 给定一个词典，将 sentence 中的单词替换成词典中能前缀匹配的最短字符.

1. 建立前缀树.
2. 前缀匹配，并替换

```java
class Solution {
    public String replaceWords(List<String> dictionary, String sentence) {
        TrieNode trie = new TrieNode();
        for (String s: dictionary){
            TrieNode cur = trie;
            for (char c: s.toCharArray()){
                if (cur.children[c - 'a'] == null) {
                    cur.children[c - 'a'] = new TrieNode();
                }
                cur = cur.children[c - 'a'];
            }
            cur.word = s;
        }
        StringBuilder res = new StringBuilder();
        for (String s: sentence.split("\\s+")){
            if (res.length() > 0){
                res.append(" ");
            }
            TrieNode cur = trie;
            for (char c: s.toCharArray()){
                if (cur.children[c - 'a'] == null || cur.word != null){
                    break;
                }
                cur = cur.children[c - 'a'];
            }
            res.append(cur.word == null ? s : cur.word);
        }
        return res.toString();
    }
}

class TrieNode{
    TrieNode[] children;
    String word;
    TrieNode() {
        children = new TrieNode[26];
    }
}
```

```python
from functools import reduce

class Solution:
    def replaceWords(self, dictionary: List[str], sentence: str) -> str:
        def word_replace(word: str):
            cur = trie
            for w in word:
                if w not in cur or END in cur:
                    break
                cur = cur[w]
            return cur.get(END, word)

        Trie = lambda: collections.defaultdict(Trie)
        trie = Trie()
        END = True
        for d in dictionary:
            reduce(dict.__getitem__, d, trie)[END] = d
        return " ".join([word_replace(ii) for ii in sentence.split()])
```

#### [LeetCode 745. 前缀和后缀搜索](https://leetcode-cn.com/problems/prefix-and-suffix-search/)

> 给定一个字典，求满足特定前缀后缀的词最大 index.

手动构造后序拼接到前缀前, 然后建立前缀树到#之前.

```python
Trie = lambda: collections.defaultdict(Trie)
WEIGHT = False

class WordFilter:
    def __init__(self, words: List[str]):
        self.trie = Trie()
        for idx, word in enumerate(words):
            word += "#"
            for ii in range(len(word)):
                cur = self.trie
                cur[WEIGHT] = idx
                for jj in range(ii, 2 * len(word) - 1):
                    cur = cur[word[jj % len(word)]]
                    cur[WEIGHT] = idx

    def f(self, prefix: str, suffix: str) -> int:
        cur = self.trie
        for ii in suffix + "#" + prefix:
            if ii not in cur:
                return -1
            cur = cur[ii]
        return cur[WEIGHT]
```

#### [LeetCode 472. 连接词](https://leetcode-cn.com/problems/concatenated-words/)

> 给出一组单词，求此中能用该集合中其他两个以上单词完全表示.

建立前缀树，然后 DFS，

1. 如果末尾 idx 可以结尾，则尝试一次
2. 如果当前 idx 不在当前前缀树

```python
class Solution:
    ENDS = "#"

    def findAllConcatenatedWordsInADict(self, words: List[str]) -> List[str]:
        def dfs(w, idx, c, tree):
            # print(w, idx, c, tree)
            nonlocal res
            if w in res:
                return
            if idx > len(w):
                return
            if idx == len(w):
                if c >= 1 and self.ENDS in tree:
                    res.add(w)
                return
            if self.ENDS in tree:
                dfs(w, idx, c + 1, trie)
            if w[idx] not in tree:
                return
            dfs(w, idx + 1, c, tree[w[idx]])

        Trie = lambda: collections.defaultdict(Trie)
        trie = Trie()
        res = set()
        for w in words:
            if w == "":
                continue
            reduce(dict.__getitem__, w, trie)[self.ENDS] = w
        for w in words:
            dfs(w, 0, 0, trie)
        return list(res)
```

#### [LeetCode 5826. 删除系统中的重复文件夹](https://leetcode-cn.com/problems/delete-duplicate-folders-in-system/)

> 给定一棵树，如果某两个节点的子树完全相同，则删除二者，求该处理之后的输出

建立前缀树，对子树进行序列化，然后 Hash，统计 Hash 数量

```python
class Solution:
    def deleteDuplicateFolder(self, paths: List[List[str]]) -> List[List[str]]:
        t = Trie()
        for path in paths:
            t.add(path)
        t.hash1()
        t.hash1_delete()
        return t.output()

class Trie:
    MOD1 = 10 ** 9 + 7
    MOD2 = 10 ** 12 + 73

    def __init__(self):
        self.children = {}
        self.h_v = 1

    def add(self, arr):
        p = self
        for ch in arr:
            if ch not in p.children:
                p.children[ch] = Trie()
            p = p.children[ch]

    def hash1(self):
        if len(self.children) == 0:
            self.h1 = 1
            return 1
        res = len(self.children)
        for k, v in self.children.items():
            res *= v.hash1() * hash(k)
            res %= self.MOD2
        self.h1 = res
        return res

    def hash1_delete(self):
        d = defaultdict(int)
        def dfs(p):
            nonlocal d
            d[p.h1] += 1
            for k, v in p.children.items():
                dfs(v)
        dfs(self)
        def dfs2(p):
            nonlocal d
            for k, v in p.children.copy().items():
                if v.h1 != 1 and d[v.h1] > 1:
                    p.children.pop(k)
                else:
                    dfs2(v)
        dfs2(self)

    def output(self):
        res, cur = [], []
        def dfs(p):
            nonlocal res, cur
            if len(cur) > 0:
                res.append(cur.copy())
            for k, v in p.children.items():
                cur.append(k)
                dfs(v)
                cur.pop()
        dfs(self)
        return res
```

## 遍历、DFS、贪心

### 遍历

#### [LeetCode 306. 累加数](https://leetcode-cn.com/problems/additive-number/)

> 复原斐波那契数列 '112358' = [1,1,2,3,5,8]
> 必须拆分出 3 个数字才能组成数组
> 确定头两个数字，后面都确定了，只需要检查，字符是否与数组一致
> 头两个数字的确定通过遍历长度[1, N // 3 + 2] PS: 斐波那契数列为递增数组，后面的长度一定大于前面的

相似的题 [LeetCode 842. 将数组拆分成斐波那契序列](https://leetcode-cn.com/problems/split-array-into-fibonacci-sequence/)

```python
class Solution:
    def isAdditiveNumber(self, num: str) -> bool:
        def is_ok(a: int, b: int):
            print(a, b)
            a, b = num[:ii], num[ii: ii + jj]
            if (len(a) > 1 and a[0] == "0") or (len(b) > 1 and b[0] == "0") or (len(a) == 0) or (len(b) == 0):
                return False
            a, b = int(a), int(b)
            end = ii + jj
            if end == N:
                return False
            while end < N:
                print("=", a, b, end)
                a, b = b, (a + b)
                if int(num[end: end + len(str(b))]) != b or (len(str(b)) > 1 and num[end: end + len(str(b))][0] == "0"):
                    return False
                end += len(str(b))
            return True
        N = len(num)
        if N < 3:
            return False
        for ii in range(1, N // 3 + 2):
            for jj in range(1, (N - ii) // 2 + 2):
                if is_ok(ii, jj):
                    return True
        return False
```

#### [LeetCode 1493. 删掉一个元素以后全为 1 的最长子数组](https://leetcode-cn.com/problems/longest-subarray-of-1s-after-deleting-one-element/)

> 给定一个只由 1，0 组成的数组，求删除一个元素(必须要删除) 之和，全为 1 的最长子数组.

1. 统计当前连续 1 数组的起始、中止情况.
2. 分情况去除元素

```python
class Solution:
    def longestSubarray(self, nums: List[int]) -> int:
        N = len(nums)
        b = ([0] if nums[0] == 1 else []) + [ii for ii in range(1, N) if nums[ii] == 1 and nums[ii - 1] == 0]
        e = [ii for ii in range(N - 1) if nums[ii] == 1 and nums[ii + 1] == 0] + ([N - 1] if nums[N - 1] == 1 else [])
        print(b, e)
        pairs = [(ii, jj) for ii, jj in zip(b, e)]
        M = len(pairs)
        if not M:
            return 0
        len_list = ([pairs[0][1] - pairs[0][0] + (1 if pairs[0][0] != 0 or pairs[0][1] != N - 1 else 0)]) + [pairs[ii][1] - pairs[ii - 1][0] if pairs[ii][0] - pairs[ii - 1][1] == 2 else pairs[ii][1] - pairs[ii][0] + 1 for ii in range(1, M)]
        print(len_list)
        return max(len_list)
```

#### [LeetCode 935. 骑士拨号器](https://leetcode-cn.com/problems/knight-dialer/)

相对于依次遍历, 每次按照规则记录可能情况数

```python
class Solution:
    DIRS = [(4,6), (6,8), (7,9), (4,8), (0,3,9), (), (0,1,7), (2,6), (1,3), (2,4), (4,6)]
    MOD = 10 ** 9 + 7
    def knightDialer(self, n: int) -> int:
        '''
        1 -> 6, 8;
        2 -> 7, 9:
        3 -> 4, 8;
        4 -> 0, 9, 3;
        5 -> ;
        6 -> 0, 7, 1;
        7 -> 2, 6;
        8 -> 1, 3;
        9 -> 2, 4;
        0 -> 4, 6;
        '''
        dp = [1] * 10
        for _ in range(1, n):
            tmp = []
            for ii in range(10):
                tmp.append(sum([dp[jj] for jj in self.DIRS[ii]]) % self.MOD)
            dp = tmp
        return sum(dp) % self.MOD
```

#### [LeetCode 419. 甲板上的战舰](https://leetcode-cn.com/problems/battleships-in-a-board/)

> 统计 1*N N*1 的战舰有几艘

DFS 统计访问过的坐标

```python
class Solution:
    def countBattleships(self, board: List[List[str]]) -> int:
        def dfs(x: int, y: int):
            dp[x][y] = 1
            if x + 1 < N and board[x + 1][y] == "X":
                x += 1
                while x < N and dp[x][y] == 0 and board[x][y] == "X":
                    dp[x][y] = 1
                    x += 1
            elif y + 1 < M and board[x][y + 1] == "X":
                y += 1
                while y < M and dp[x][y] == 0 and board[x][y] == "X":
                    dp[x][y] = 1
                    y += 1

        N, M = len(board), len(board[0])
        dp = [[0] * M for _ in range(N)]
        res = 0
        for ii in range(N):
            for jj in range(M):
                if board[ii][jj] == "X" and dp[ii][jj] == 0:
                    dfs(ii, jj)
                    res += 1
        return res
```

#### [LeetCode 378. 有序矩阵中第 K 小的元素](https://leetcode-cn.com/problems/kth-smallest-element-in-a-sorted-matrix/)

> 每行都是自增的矩阵中，查找第 k 小的元素

二分查找，二分数值，每次去统计小于该值的元素个数

```python
class Solution:
    def kthSmallest(self, matrix: List[List[int]], k: int) -> int:
        def cal_num(tgt: int) -> int:
            ii, jj, num = N - 1, 0, 0
            while ii >= 0 and jj < N:
                if matrix[ii][jj] <= mid:
                    num += ii + 1
                    jj += 1
                else:
                    ii -= 1
            return num >= k

        N = len(matrix)
        left, right = matrix[0][0], matrix[-1][-1]
        while left < right:
            mid = (left + right) // 2
            if cal_num(mid):
                right = mid
            else:
                left = mid + 1
        return left
```

#### [LeetCode 853. 车队](https://leetcode-cn.com/problems/car-fleet/)

> 给出一组车的位置和速度，若两车在到达目的地前相遇，则按照位置在前的车的速度继续前进，求最后到达目的地有几个车队.

排序之后，判断位置之前有没有速度慢且能超过的车. (这题时间排序有点后，没想好怎么优化)

```python
class Solution:
    def carFleet(self, target: int, position: List[int], speed: List[int]) -> int:
        N = len(position)
        res = N
        pairs = sorted([(ii, jj) for ii, jj in zip(position, speed)], key=lambda i:i[0])
        for ii in range(N):
            for jj in range(ii + 1, N):
                if pairs[jj][1] < pairs[ii][1] and (pairs[jj][0] - pairs[ii][0]) * pairs[jj][1] <= (target - pairs[jj][0]) * (pairs[ii][1] - pairs[jj][1]):
                    res -= 1
                    break
        return res
```

#### [LeetCode 154. 寻找旋转排序数组中的最小值 II](https://leetcode-cn.com/problems/find-minimum-in-rotated-sorted-array-ii/)

> 求旋转数组的最小值，可能存在相同值.

大致上和 153 很像.

1. 二分如何停止 => mid == left or mid == right
2. [10,1,10,10,10,10] 如何处理，这个就不能二分了，只能顺序查找

```python
class Solution:
    def findMin(self, nums: List[int]) -> int:
        N = len(nums)
        res, left, right, l_v, r_v = nums[0], 0, N - 1, nums[0], nums[-1]
        if l_v < r_v:
            return l_v
        elif l_v == r_v:
            while left < right and nums[left] >= l_v:
                left += 1
            return nums[left]

        while left < right:
            mid = (left + right) // 2
            if mid in [left, right]:
                left = right if nums[mid] < l_v else left
                break
            if nums[mid] >= l_v:
                left = mid
            else:
                right = mid
        # print(left, right)
        if nums[left] >= l_v:
            return nums[right]
        return nums[left]
```

#### [LeetCode 1340. 跳跃游戏 V](https://leetcode-cn.com/problems/jump-game-v/)

> 每次跳跃只能在半径 d 中，且跳跃点与当前点之间的所有海拔都必须小于出发点, 求最多能跳几跳.

记忆化搜索，搜索过程中大部分过程都是重复的.

dp[u] = max(dp[ii]) + 1 (ii 为所有可达的点)

```python
from functools import lru_cache
class Solution:
    def maxJumps(self, arr: List[int], d: int) -> int:
        @lru_cache(None)
        def dp(u):
            tmp = []
            left, right = u - 1, u + 1
            while left >= 0 and left >= u - d and arr[left] < arr[u]:
                tmp.append(left)
                left -= 1
            while right < N and right <= u + d and arr[right] < arr[u]:
                tmp.append(right)
                right += 1
            if len(tmp) == 0:
                return 1
            return max([dp(ii) for ii in tmp]) + 1
        N = len(arr)
        res = 1
        for ii in range(N):
            res = max(dp(ii), res)
        return res
```

#### [LeetCode 1267. 统计参与通信的服务器](https://leetcode-cn.com/problems/count-servers-that-communicate/)

> 同行、列上有其他机器记为可以通信，不让记为不可通信.

这个难度比只有相邻可以通行低很多，不需要 DFS，直接统计就可以了

```python
class Solution:
    DIRS = [(0, 1), (1, 0), (0, -1), (-1, 0)]
    def countServers(self, grid: List[List[int]]) -> int:
        N, M = len(grid), len(grid[0])
        g_l = {ii: [] for ii in range(N)}
        g_r = {ii: [] for ii in range(M)}
        res = 0
        for ii in range(N):
            for jj in range(M):
                if grid[ii][jj]:
                    g_l[ii].append(jj)
                    g_r[jj].append(ii)
        for k, v in g_l.items():
            if len(v) == 0:
                continue
            if len(v) > 1:
                res += len(v)
            else:
                if len(g_r[v[0]]) > 1:
                    res += 1
        # print(g_l, g_r)
        return res
```

#### [LeetCode LCP 12. 小张刷题计划](https://leetcode-cn.com/problems/xiao-zhang-shua-ti-ji-hua/)

> 给定一组题目所需时间，和需要完成的总天数。小明每天可以场外求助一次，求单日刷题最大值的最小值.

给定一个单日刷题耗时上限，则可以判断所需要的天数。
这样就可以通过二分刷题耗时来解决，二分左=0，右=总时间。

```java
class Solution {
    public int minTime(int[] time, int m) {
        int left = 0, right = 0, mid;
        for (int ii: time) {
            right += ii;
        }
        while (left < right) {
            mid = (left + right) >> 1;
            if (dfs(mid, time, m)){
                right = mid;
            } else {
                left = mid + 1;
            }
        }
        return left;
    }

    public boolean dfs(int limit, int [] time, int m){
        int total = 0, day = 1, max_v = time[0], now;
        for (int ii = 1; ii < time.length; ++ii){
            now = time[ii];
            if (total + Math.min(max_v, now) <= limit){
                total += Math.min(max_v, now);
                max_v = Math.max(max_v, now);
            } else{
                day += 1;
                total = 0;
                max_v = now;
            }
        }
        return day <= m;
    }
}
```

### 贪心

#### [LeetCode 991. 坏了的计算器](https://leetcode-cn.com/problems/broken-calculator/)

> 只能使用减小 -=1，和倍乘 \*2 两个操作 将 X 变成 Y 最少需要几步

贪心的做，优先 \* 2. 反过来对于 Y 来说优先/2.

1. Y 为偶数的话 Y //= 2;
2. Y 为奇数的话 Y -= 1;

```python
class Solution:
    def brokenCalc(self, X: int, Y: int) -> int:
        res = 0
        while X < Y:
            res += 1
            if (Y >> 1 << 1 != Y):
                Y += 1
            else:
                Y //= 2
        return res + X - Y
```

#### [LeetCode 1558. 得到目标数组的最少函数调用次数](https://leetcode-cn.com/problems/minimum-numbers-of-function-calls-to-make-target-array/)

> 只能使用 单个元素 + 1，或者所有元素倍乘两个操作, 求使得全 0 数组变成目标数组的最短次数。

思路和 991 一致，贪心的来，优先倍乘，如果奇数-=1

只不过这时候倍乘是所有元素，加一则是单个元素，需要对所有元素的计算结果进行汇总

```python
class Solution:
    def minOperations(self, nums: List[int]) -> int:
        def get_add_mul_times(num: int):
            a, b = 0, 0
            while num > 0:
                if num >> 1 << 1 != num:
                    a += 1
                    num -= 1
                else:
                    b += 1
                    num //= 2
            return a, b
        N = len(nums)
        add, mul = [0] * N, [0] * N
        for ii in range(N):
            a, b = get_add_mul_times(nums[ii])
            add[ii] = a
            mul[ii] = b
        return max(mul) + sum(add)
```

#### [LeetCode 402. 移掉 K 位数字](https://leetcode-cn.com/problems/remove-k-digits/)

> 移除数字中的 k 位使得，整体数字最小.

分析移除一位, 145233. 我们应该移除 5. 选择标准是从头开始第一个变成递减的转折点

按这个思路贪心的做，每次移除一位

```python
class Solution:
    def removeKdigits(self, num: str, k: int) -> str:
        def dp(s: str, n: int):
            if n <= 1:
                return ""
            idx, pre = 0, int(s[0])
            while idx + 1 < n and int(s[idx + 1]) >= pre:
                pre = int(s[idx + 1])
                idx += 1
            if idx == n:
                return s[1:]
            return s[:idx] + s[idx + 1:]
        N = len(num)
        res, n = num, N
        for ii in range(k):
            res = dp(res, n)
            n -= 1
        idx = 0
        while idx < n and res[idx] == "0":
            idx += 1
        if idx == n:
            return "0"
        return res[idx:]
```

#### [LeetCode 910. 最小差值 II](https://leetcode-cn.com/problems/smallest-range-ii/)

> 数组里的每个数都能加一或者减一，求变换数组极差的最小值.

贪心的做，每次计算当前改变之后与之前结果的差值`min(ans, max(pre_max-K, a+K) - min(pre_min+K, b-K))`

```python
class Solution:
    def smallestRangeII(self, A: List[int], K: int) -> int:
        A.sort()
        N = len(A)
        pre_min, pre_max = A[0], A[-1]
        ans = pre_max - pre_min
        for i in range(N - 1):
            a, b = A[i], A[i+1]
            ans = min(ans, max(pre_max-K, a+K) - min(pre_min+K, b-K))
        return ans
```

### DFS, 记忆化 DFS

#### [LeetCode 329. 矩阵中的最长递增路径](https://leetcode-cn.com/problems/longest-increasing-path-in-a-matrix/)

在矩阵中找出最长递增路径，

```json
[
  [9,9,4],
  [6,6,8],
  [2,1,1]
] => [1,2,6,9]
```

直接 dfs, 为了重复搜索，存储遍历结果

```python
class Solution:
    DIRS = [(-1, 0), (0, 1), (1, 0), (0, -1)]
    def longestIncreasingPath(self, matrix: List[List[int]]) -> int:

        def dfs(x: int, y: int):
            tmp = []
            for dx, dy in self.DIRS:
                xx, yy = x + dx, y + dy
                if not (0 <= xx < N) or not (0 <= yy < M):
                    continue
                if matrix[xx][yy] > matrix[x][y]:
                    if dp[xx][yy]:
                        tmp.append(dp[xx][yy])
                    else:
                        tmp.append(dfs(xx, yy))
            dp[x][y] = max(tmp) + 1 if tmp else 1
            self.res = max(self.res, dp[x][y])
            return dp[x][y]

        if not matrix:
            return 0
        N, M = len(matrix), len(matrix[0])
        dp = [[0] * M for _ in range(N)]
        self.res = 0
        for ii in range(N):
            for jj in range(M):
                if not dp[ii][jj]:
                    dfs(ii, jj)
        return self.res
```

#### [LeetCode 1219. 黄金矿工](https://leetcode-cn.com/problems/path-with-maximum-gold/)

> 寻找效益最优的路线，访问过则置 0，遇到 0 则停止遍历

直接 DFS, 对起始位置剪枝
=> 还能做记忆化，数据量小就没做了

```python
class Solution:
    DIRS = [(-1, 0), (0, 1), (1, 0), (0, -1)]
    def getMaximumGold(self, grid: List[List[int]]) -> int:
        N, M = len(grid), len(grid[0])
        self.res = 0
        def dfs(x: int, y: int, v: int, done: set):
            self.res = max(self.res, v)
            for dx, dy in self.DIRS:
                xx, yy = x + dx, y + dy
                if not (0 <= xx < N) or not (0 <= yy < M) or (xx, yy) in done or grid[xx][yy] == 0:
                    continue
                done.add((xx, yy))
                dfs(xx, yy, v + grid[xx][yy], done)
                done.remove((xx, yy))
        done = set()
        for ii in range(N):
            for jj in range(M):
                zero_num = [idx for idx, (dx, dy) in enumerate(self.DIRS) if (0<= ii + dx < N) and (0 <= jj + dy < M) and grid[ii + dx][jj + dy]]
                flag = len(zero_num) <= 1 or (len(zero_num) == 2 and 1 in zero_num and 2 in zero_num)
                if grid[ii][jj] and flag:
                    done.add((ii, jj))
                    dfs(ii, jj, grid[ii][jj], done)
                    done.remove((ii, jj))
        return self.res
```

#### [LeetCode 5501. 使陆地分离的最少天数](https://leetcode-cn.com/contest/weekly-contest-204/problems/minimum-number-of-days-to-disconnect-island/)

> 陆地相邻的定义为竖直向和纵向有临近的. 求去除陆地之后能使得陆地分离(两块以上大陆)

要敢 DFS, 尤其是数据量小

```python
class Solution:
    def minDays(self, grid: List[List[int]]) -> int:

        def check(g):
            self.dp = [[1] * M for _ in range(N)]
            res = 0
            for ii in range(N):
                for jj in range(M):
                    if g[ii][jj] == 1 and self.dp[ii][jj] == 1:
                        dfs(g, ii, jj)
                        res += 1
            return res != 1

        def dfs(g: list, x: int, y: int):
            self.dp[x][y] = 0
            tmp = []
            for dx, dy in [(1, 0), (0, 1), (-1, 0), (0, -1)]:
                xx, yy = dx + x, dy + y
                if not (0 <= xx < N) or not (0 <= yy < M) or g[xx][yy] == 0 or self.dp[xx][yy] == 0:
                    tmp.append(0)
                    continue
                tmp.append(dfs(g, xx, yy))
            return sum(tmp) + 1


        N, M = len(grid), len(grid[0])
        self.dp = [[1] * M for _ in range(N)]
        if check(grid):
            return 0
        for ii in range(N):
            for jj in range(M):
                if grid[ii][jj] == 1:
                    grid[ii][jj] = 0
                    if check(grid):
                        return 1
                    grid[ii][jj] = 1
        return 2
```

#### [LeetCode 488. 祖玛游戏](https://leetcode-cn.com/problems/zuma-game/)

> 模拟祖玛游戏，有连续超过三个同色的球，则消失，求完成游戏最少的添加球方案.

这道题的数据量很小 N<20, M <5，可以放心用 DFS。

1. 统计词频，如果目前有的词频+ 可以添加的词频还不到 3，那肯定不行了
2. 一开始很贪心的认为，添加的球一定是在连续子串的头或者尾，所以用前后指针压缩了字符串;
3. 然后进行 DFS, 第一个难点，如何模拟消失这个过程，（有可能会多次消失，用个左右指针 从添加点依次向左右扩散;
4. 这个版本写完了就大部分完成了，直到遇到了 case "RRWWRRBBRR", "WB". 一开始还以为是因为如果大于 3 个能选择是否完全消失，后来才发现是先"R(B)RWWRRRBBRR"

```python
from collections import Counter
class Solution:
    def findMinStep(self, board: str, hand: str) -> int:
        def decoder(pss: list, ii: int):
            N = len(pss)
            left, right = ii - 1, ii + 1
            while left >= 0 and right < N and pss[left][1] == pss[right][1]:
                size, w = pss[right]
                size = pss[left][0] + size
                if size >= 3:
                    left -= 1
                    right += 1
                else:
                    right += 1
                    pss[left] = (size, w)
            return pss[:left + 1] + pss[right:]

        def dfs(ps: list, c: dict):
            if total - sum(c. values()) > self.res:
                return
            if not len(ps):
                self.res = min(total - sum(c.values()), self.res)
                return
            for ii in range(len(ps)):
                size, w = ps[ii]
                need = 3 - size
                if w not in c or c[w] < need:
                    continue
                c[w] -= need
                dfs(decoder(ps, ii), c)
                c[w] += need
            for ii in range(len(ps)):
                size, w = ps[ii]
                if size != 2:
                    continue
                for k, v in c.items():
                    if k == w or v <= 0:
                        continue
                    for t in range(1, 2):
                        if t > v:
                            continue
                        c[k] -= t
                        dfs(ps[:ii] + [(1, w), (t, k), (1, w)] + ps[ii + 1:], c)
                        c[k] += t

        N = len(board)
        hand_c = Counter(hand)
        total = len(hand)
        self.res = 10**9 + 7
        for k, v in Counter(board).items():
            if v % 3 == 0:
                continue
            if k not in hand_c or hand_c[k]  + v < 3:
                return -1
        b = [0] + [ii for ii in range(1, N) if board[ii] != board[ii - 1]]
        e = [ii for ii in range(N - 1) if board[ii] != board[ii + 1]] + [N - 1]
        pairs = [(jj - ii + 1, board[ii]) for ii, jj in zip(b, e)]
        dfs(pairs, hand_c)
        return -1 if self.res == 10**9 + 7 else self.res
```

#### [LeetCode 486. 预测赢家](https://leetcode-cn.com/problems/predict-the-winner/)

> 给定一个数组，A，B 依次从两端取数，直到没有数了。求 A 能赢 B

同[LeetCode 877. 石子游戏](https://leetcode-cn.com/problems/stone-game/)

记忆化递归, 如果 A 则加，轮到 B 则减

```python
from functools import lru_cache

class Solution:
    def PredictTheWinner(self, nums: List[int]) -> bool:
        N = len(nums)
        is_odd = N >> 1 << 1 == N
        @lru_cache(None)
        def dp(i: int, j: int):
            if i > j:
                return 0
            flag = (N - (j - i) - 1) % 2
            if flag:
                return min(-nums[i] + dp(i + 1, j), -nums[j] + dp(i, j - 1))
            return max(nums[i] + dp(i + 1, j), nums[j] + dp(i, j - 1))
        return dp(0, N - 1) >= 0
```

#### [LeetCode 427. 建立四叉树](https://leetcode-cn.com/problems/construct-quad-tree/)

> 给一个 n\*n 的矩阵，按照组内元素是否相等作为树结构是否划分的依据。

直接 DFS

```python
"""
# Definition for a QuadTree node.
class Node:
    def __init__(self, val, isLeaf, topLeft, topRight, bottomLeft, bottomRight):
        self.val = val
        self.isLeaf = isLeaf
        self.topLeft = topLeft
        self.topRight = topRight
        self.bottomLeft = bottomLeft
        self.bottomRight = bottomRight
"""

class Solution:
    def construct(self, grid: List[List[int]]) -> 'Node':
        def is_same(x: int, y: int, size: int):
            tmp = set()
            for ii in range(x, x + size):
                for jj in range(y, y + size):
                    if not grid[ii][jj] in tmp:
                        if len(tmp) == 1:
                            return False
                        tmp.add(grid[ii][jj])
            return True
        def dfs(x: int, y: int, size: int):
            if size == 1 or is_same(x, y, size):
                return Node(grid[x][y], True, None, None, None, None)
            tmp = []
            s = size // 2
            for dx, dy in [(0, 0), (0, 1), (1, 0), (1, 1)]:
                xx, yy = x + dx * s, y + dy * s
                tmp.append(dfs(xx, yy, s))
            return Node(1, False, tmp[0], tmp[1], tmp[2], tmp[3])

        N = len(grid)
        return dfs(0, 0, N)
```

#### [LeetCode 51. N 皇后](https://leetcode-cn.com/problems/n-queens/)

> 生成所有 N 皇后的可能情况.

很经典的题，使用三个数组做合法性对的判断.

> 约束回溯 => [LeetCode 37. 解数独](https://leetcode-cn.com/problems/sudoku-solver/)

```java
class Solution {
    char[][] edges;
    List<List<String>> res;
    int[] col;
    int[] diag;
    int[] reverse_diag;
    int N;

    public List<List<String>> solveNQueens(int n) {
        N = n;
        col = new int[N];
        diag = new int[2 * N];
        reverse_diag = new int[2 * N];
        res = new ArrayList<List<String>>();
        edges = new char[N][N];
        for (char[] ii: edges){
            Arrays.fill(ii, '.');
        }
        dfs(0);
        return res;
    }
    public void dfs(int u){
        if (u == N){
            List<String> board = new ArrayList<String>();
            for (int i = 0; i < N; i++) {
                board.add(new String(edges[i]));
            }
            res.add(board);
            return;
        }
        for (int ii = 0; ii < N; ++ii){
            if (col[ii] == 0 && diag[u + ii] == 0 && reverse_diag[N - u + ii] == 0){
                edges[u][ii] = 'Q';
                col[ii] = 1;
                diag[u + ii] = 1;
                reverse_diag[N - u + ii] = 1;
                dfs(u + 1);
                edges[u][ii] = '.';
                col[ii] = 0;
                diag[u + ii] = 0;
                reverse_diag[N - u + ii] = 0;
            }
        }
    }
}
```

#### [LeetCode 5494. 统计所有可行路径](https://leetcode-cn.com/problems/count-all-possible-routes/)

> 给定一张图，起始点，终点和一个最大行驶距离，求可能的情况数，可重复.

记忆式搜索，对于给定当前点 index 和还能行走距离可行的路径应该是确定的。而且是=\sum(走一步的可行数)

```python
from functools import lru_cache


class Solution:
    MODS = 10 ** 9 + 7

    def countRoutes(
        self, locations: List[int], start: int, finish: int, fuel: int
    ) -> int:
        @lru_cache(None)
        def dfs(now: int, oil: int):
            ans = 0
            for ii, loc in enumerate(locations):
                if now == ii:
                    continue
                cost = abs(locations[now] - loc)
                if cost + abs(locations[now] - locations[finish]) <= oil:
                    ans += dfs(ii, oil - cost)
            if now == finish:
                ans += 1
            return ans % self.MODS

        return dfs(start, fuel)
```

## 队列

### [LeetCode 剑指 Offer 59 - II. 队列的最大值](https://leetcode-cn.com/problems/dui-lie-de-zui-da-zhi-lcof/)

> 平均摊销 O(1) 下完成队列的入队，出队，求最大值

1. 维护一个队列来存储最大值，pop 队尾小于当前值的所有值;

### 优先队列

> 大部分是贪心

#### [LeetCode 632. 最小区间](https://leetcode-cn.com/problems/smallest-range-covering-elements-from-k-lists/)

> 一组单增数组, 求一个最小的区间，使得每行数组都至少有一个值在区间内.

维护大小为 N 的小顶堆，里面存储每行各一个值，依次 pop 出最小的值，并放入同行下一个值

```java
class Solution {
    public int[] smallestRange(List<List<Integer>> nums) {
        int res_min = 0, res_max = Integer.MAX_VALUE;
        int max_v = Integer.MIN_VALUE, min_v;
        int n = nums.size();
        int[] next = new int[n];
        PriorityQueue<Integer> queue = new PriorityQueue<Integer>(new Comparator<Integer>(){
            public int compare(Integer a, Integer b){
                return nums.get(a).get(next[a]) - nums.get(b).get(next[b]);
            }
        });
        for (int i = 0; i < n; ++i){
            queue.offer(i);
            max_v = Math.max(max_v, nums.get(i).get(0));
        }
        while (true) {
            int index = queue.poll();
            if (max_v - nums.get(index).get(next[index]) < res_max - res_min) {
                res_max = max_v;
                res_min = nums.get(index).get(next[index]);
            }
            ++next[index];
            if (next[index] == nums.get(index).size()){
                break;
            }
            queue.offer(index);
            max_v = Math.max(max_v, nums.get(index).get(next[index]));
        }
        return new int[]{res_min, res_max};
    }
}
```

#### [LeetCode 407. 接雨水 II](https://leetcode-cn.com/problems/trapping-rain-water-ii/)

> 接雨水 II 需要四周来接

1. 从外围开始遍历，依次弹出最小值。
2. 观察最小值是否是大于四周的

```python
import heapq
class Solution:
    DIRS = [(-1, 0), (0, 1), (1, 0), (0, -1)]
    def trapRainWater(self, heightMap: List[List[int]]) -> int:
        N, M = len(heightMap), len(heightMap[0])
        flag = [[0] * M for _ in range(N)]
        queue = []
        for ii in range(N):
            if ii in [0, N - 1]:
                for jj in range(M):
                    heapq.heappush(queue, (heightMap[ii][jj], ii, jj))
                    flag[ii][jj] = 1
            else:
                for jj in [0, M - 1]:
                    heapq.heappush(queue, (heightMap[ii][jj], ii, jj))
                    flag[ii][jj] = 1
        res = 0
        while queue:
            head, x, y = heapq.heappop(queue)
            # print(x, y, head, queue)
            for dx, dy in self.DIRS:
                xx, yy = x + dx, y + dy
                if not (0 <= xx < N) or not (0 <= yy < M) or flag[xx][yy]:
                    continue
                if head > heightMap[xx][yy]:
                    res += head - heightMap[xx][yy]
                heapq.heappush(queue, (max(heightMap[xx][yy], head), xx, yy))
                flag[xx][yy] = 1
        return res
```

#### [LeetCode 786. 第 K 个最小的素数分数](https://leetcode-cn.com/problems/k-th-smallest-prime-fraction/)

> 给定一个素数集合，求组合中第 K 小的分数.

按起始位置维护优先队列，对于每个起始位置 i 而言, 分数排序是固定的，从底到顶.
每次 pop 优先队列中最小的，然后添加同起始位置的下一个小的分数.

```python
import heapq
class Solution:
    def kthSmallestPrimeFraction(self, A: List[int], K: int) -> List[int]:
        N = len(A)
        dp = [N - 1] * N
        res = 0
        heap = [(A[ii] / A[-1], ii) for ii in range(N - 1)]
        heapq.heapify(heap)
        while heap:
            _, row = heapq.heappop(heap)
            # print(row, dp[row], heap, res)
            res += 1
            if res == K:
                return [A[row], A[dp[row]]]
            if dp[row] > row + 1:
                dp[row] -= 1
                if dp[row] == row and row:
                    dp[now] -= 1
                heapq.heappush(heap, (A[row] / A[dp[row]], row))
        return []
```

#### [LeetCode 239. 滑动窗口最大值](https://leetcode-cn.com/problems/sliding-window-maximum/)

> 求滑动窗口中的最大值.

构造一个大顶堆 => heapq，然后也记录 index.
如果 top index 超过窗口范围一直弹出.

```python
import heapq

class Solution:
    def maxSlidingWindow(self, nums: List[int], k: int) -> List[int]:
        N = len(nums)
        res, have = [], []
        for ii, jj in enumerate(nums[:k]):
            heapq.heappush(have, (-jj, ii))
        for ii in range(N - k + 1):
            x, y = heapq.heappop(have)
            while y < ii:
                x, y = heapq.heappop(have)
            res.append(-1 * x)
            heapq.heappush(have, (x, y))
            next_id = ii + k
            if next_id < N:
                heapq.heappush(have, (-nums[next_id], next_id))
        return res
```

#### [LeetCode 480. 滑动窗口中位数](https://leetcode-cn.com/problems/sliding-window-median/)

> 求滑动窗口内的中位数

和 239 不同的是中位数需要一直维护滑动窗口内的值(即剔除超出窗口的值)
=> 用 bisect 二分查找 pop

```python
class Solution:
    def medianSlidingWindow(self, nums: List[int], k: int) -> List[float]:
        N = len(nums)
        res, tmp = [], sorted(nums[:k - 1])
        for ii in range(N - k + 1):
            jj = ii + k - 1
            bisect.insort(tmp, nums[jj])
            if k >> 1 << 1 == k:
                res.append(sum(tmp[k // 2 - 1:k //2 + 1]) / 2)
            else:
                res.append(tmp[k // 2])
            tmp.pop(bisect.bisect_left(tmp, nums[ii]))
        return res
```

#### [LeetCode 264. 丑数 II](https://leetcode-cn.com/problems/ugly-number-ii/)

> 求质因数只包含 2，3，5 的第 n 个数

这边没有使用 heapq 来维护堆，而是用三个 index 来维护 倍速 ×2/3/5 比目前序列大的最小 index

```python
class Solution:
    def nthUglyNumber(self, n: int) -> int:
        res, have = [1], [2, 3, 5]
        i2, i3, i5 = 0, 0, 0
        for ii in range(1, n + 1):
            tmp = min(res[i2] * 2, res[i3] * 3, res[i5] * 5)
            if tmp == res[i2] * 2:
                i2 += 1
            if tmp == res[i3] * 3:
                i3 += 1
            if tmp == res[i5] * 5:
                i5 += 1
            res.append(tmp)
        # print(res)
        return res[n - 1]
```

## 树

### 树的遍历

#### [LeetCode 面试题 04.06. 后继者](https://leetcode-cn.com/problems/successor-lcci/)

> 寻找中序的后一个节点

实现非递归中序，用栈维护

```python
class Solution:
    def inorderSuccessor(self, root: TreeNode, p: TreeNode) -> TreeNode:
        res, stack = [], []
        while stack or root:
            while root:
                stack.append(root)
                root = root.left
            root = stack.pop()
            res.append(root)
            root = root.right
        res.append(None)
        for ii in range(len(res)):
            if res[ii] == p:
                return res[ii + 1]
        return None
```

#### [LeetCode 94. 二叉树的中序遍历](https://leetcode-cn.com/problems/binary-tree-inorder-traversal/)

> 非递归中序

1. 用指示符表示遍历情况
2. 遍历先遍历右子树

```python
class Solution:
    WHITE, RED = 0, 1
    def inorderTraversal(self, root: TreeNode) -> List[int]:
        res, stack = [], [(self.WHITE, root)]
        while stack:
            color, node = stack.pop()
            if node is None:
                continue
            if color == self.WHITE:
                stack.append((self.WHITE, node.right))
                stack.append((self.RED, node))
                stack.append((self.WHITE, node.left))
            else:
                res.append(node.val)
        return res
```

#### [LeetCode 515. 在每个树行中找最大值](https://leetcode-cn.com/problems/find-largest-value-in-each-tree-row/)

直接 BFS

```python
import heapq

class Solution:
    def largestValues(self, root: TreeNode) -> List[int]:
        if not root:
            return []
        idx, res, queue = 1, {}, []
        heapq.heappush(queue, (0, 0, root))
        while queue:
            _, h, front = heapq.heappop(queue)
            if h not in res:
                res[h] = front.val
            else:
                res[h] = max(res[h], front.val)
            if front.left:
                heapq.heappush(queue, (idx, h + 1, front.left))
                idx += 1
            if front.right:
                heapq.heappush(queue, (idx, h + 1, front.right))
                idx += 1
        return [res[ii] for ii in sorted(res)]
```

#### [LeetCode 968. 监控二叉树](https://leetcode-cn.com/problems/binary-tree-cameras/)

> 一个监控器可以监控父和所有子节点. 求最小监控数量.

递归遍历，维护

1. head 放监控时，覆盖整棵树所需要的监控数;
2. 维护整棵树最小监控
3. head 不放监控，覆盖整棵树

```python
class Solution:
    def minCameraCover(self, root: TreeNode) -> int:
        def dfs(head: TreeNode):
            if head is None:
                return [float("inf"), 0, 0]
            la, lb, lc = dfs(head.left)
            ra, rb, rc = dfs(head.right)
            a = lc + rc + 1
            b = min(a, la + rb, ra + lb)
            c = min(a, lb + rb)
            return [a, b, c]
        a, b, c = dfs(root)
        return b
```

### 树的插入

#### [LeetCode 919. 完全二叉树插入器](https://leetcode-cn.com/problems/complete-binary-tree-inserter/)

> 插入输入数字使得树为完全二叉树.

一个队列保存子节点

```python
from collections import deque

class CBTInserter:
    def __init__(self, root: TreeNode):
        self.root = root
        self.deque = deque()
        q = deque([root])
        while q:
            tmp = q.popleft()
            if not tmp.left or not tmp.right:
                self.deque.append(tmp)
            if tmp.left:
                q.append(tmp.left)
            if tmp.right:
                q.append(tmp.right)

    def insert(self, v: int) -> int:
        tmp = self.deque[0]
        self.deque.append(TreeNode(v))
        if not tmp.left:
            tmp.left = self.deque[-1]
        else:
            tmp.right = self.deque[-1]
            self.deque.popleft()
        return tmp.val

    def get_root(self) -> TreeNode:
        return self.root
```

#### [LeetCode 623. 在二叉树中增加一行](https://leetcode-cn.com/problems/add-one-row-to-tree/)

> 在二叉树指定高度插入一行

```java
class Solution {
    public TreeNode addOneRow(TreeNode root, int v, int d) {
        TreeNode f = root;
        Queue<TreeNode> queue = new LinkedList<TreeNode>();
        queue.add(root);
        int h = 1;
        while (h < d - 1){
            Queue<TreeNode> tmp = new LinkedList<TreeNode>();
            while (!queue.isEmpty()){
                TreeNode top = queue.remove();
                if (top.left != null){
                    tmp.add(top.left);
                }
                if (top.right != null) {
                    tmp.add(top.right);
                }
            }
            queue = tmp;
            ++h;
        }
        if (d == 1){
            TreeNode now = new TreeNode(v);
            now.left = f;
            return now;
        }
        for (TreeNode ii:queue){
            TreeNode left = new TreeNode(v);
            TreeNode right = new TreeNode(v);
            left.left = ii.left;
            right.right = ii.right;
            ii.left = left;
            ii.right = right;
        }
        return f;
    }
}
```

### 特殊树

#### [LeetCode 1373. 二叉搜索子树的最大键值和](https://leetcode-cn.com/problems/maximum-sum-bst-in-binary-tree/)

> 求子树是 BST 的最大 val 和.

和判断 一棵树是否是 BST 刚好相反，(确定上下界，不满足上下界就不是 BST)

这边的上下界是一个自底向上的过程，需要从 DFS 底部往回传

```python
class Solution:
    def maxSumBST(self, root: TreeNode) -> int:
        def dfs(now: TreeNode):
            # print(now.val)
            if now.left is None and now.right is None:
                self.res = max(self.res, now.val)
                return (now.val, now.val, now.val)
            res = now.val
            now_min, now_max = now.val, now.val
            valid = True
            if now.left:
                l_v, l_min, l_max = dfs(now.left)
                if l_max >= now.val or l_v is False:
                    valid = False
                else:
                    res += l_v
                    now_min = l_min
            if now.right:
                r_v, r_min, r_max = dfs(now.right)
                if r_min <= now.val or r_v is False:
                    valid = False
                else:
                    res += r_v
                    now_max = r_max
            if valid is False:
                return (False, now_min, now_max)
            self.res = max(self.res, res)
            return (res, now_min, now_max)
        self.res = 0
        dfs(root)
        return self.res
```

#### [LeetCode 剑指 Offer 36. 二叉搜索树与双向链表](https://leetcode-cn.com/problems/er-cha-sou-suo-shu-yu-shuang-xiang-lian-biao-lcof/)

> 将 BST 转换成双向链表

不能直接改右节点，需要记录上一个遍历的节点，然后将上一个节点指向当前节点。

```python
class Solution:
    def treeToDoublyList(self, root: "Node") -> "Node":
        def dfs(h):
            nonlocal pre, r, head
            if h is None:
                return
            if h.left:
                dfs(h.left)
            if r is None:
                r = head = h
            if pre is not None:
                pre.right = h
            pre = h
            if h.right:
                dfs(h.right)

        r = head = None
        pre = None
        dfs(root)
        if head is None:
            return head
        pre = head
        head = head.right
        while head:
            head.left = pre
            head = head.right
            pre = pre.right
        pre.right = r
        r.left = pre
        return r
```

## 链表

### 链表的重组

#### [LeetCode 138. 复制带随机指针的链表](https://leetcode-cn.com/problems/copy-list-with-random-pointer/)

> 深度拷贝带有随机指针的链表结构.

单个链表复制只需要一次遍历即可，当出现双指针，还是随机的双指针，则会出现环结构。

1. 在每个节点后面都插入一个等值的节点 Node. 遍历一次.
2. 遍历每个节点，则 random 和对应的新建的 random 也只隔了 next.
3. 分离新老节点.

```java
class Solution {
    public Node copyRandomList(Node head) {
        if (head == null){
            return head;
        }
        Node now = head;
        while (now != null){
            Node new_node = new Node(now.val);
            new_node.next = now.next;
            now.next = new_node;
            now = new_node.next;
        }
        now = head;
        while (now != null){
            now.next.random = now.random != null ? now.random.next : null;
            now = now.next.next;
        }
        Node origin = head;
        now = head.next;
        Node new_node = head.next;
        while (origin != null){
            origin.next = origin.next.next;
            new_node.next = (new_node.next != null) ? new_node.next.next : null;
            origin = origin.next;
            new_node = new_node.next;
        }
        return now;
    }
}
```

### 并查集

1. 递归查找父亲;
2. 更新父亲节点 merge;

```python
def getroot(r, p):
    q = r[p]
    while p != r[p]:
        p = r[p]
    while q != p:
        tmp = r[q]
        r[q] = p
        q = tmp
    return p
```

#### [LeetCode 5510. 保证图可完全遍历](https://leetcode-cn.com/problems/remove-max-number-of-edges-to-keep-graph-fully-traversable/)

> 边的关系有专属 A，专属 B，AB 共享三种，求去除边还能使得图连通的最大边数.

先用 AB 共享的边建立一个并查集 U1.
然后用专属 A 的边在 U1 上建立 U2 => 检查是否连通.
专属 B 的边在 U1 上建立 U3=> 检查是否连通.

```python
class Solution:
    def maxNumEdgesToRemove(self, n: int, edges: List[List[int]]) -> int:
        def getroot(r, p):
            q = r[p]
            while p != r[p]:
                p = r[p]
            while q != p:
                tmp = r[q]
                r[q] = p
                q = tmp
            return p

        ra = list(range(n))

        e = [[], [], []]
        for types, u, v in edges:
            e[types - 1].append((u - 1, v - 1))
        # print(ra, e)
        ans = 0
        for u, v in e[2]:
            u, v = getroot(ra, u), getroot(ra, v)
            if u == v:
                ans += 1
            else:
                ra[u] = v
            # print(ra, u, v)
        rb = ra.copy()
        for el, r in ((e[0], ra), (e[1], rb)):
            for u, v in el:
                u, v = getroot(r, u), getroot(r, v)
                if u == v:
                    ans += 1
                else:
                    r[u] = v
                # print(",", r, u, v)
            r0 = getroot(r, 0)
            for i in range(1, n):
                if getroot(r, i) != r0:
                    return -1
        return ans
```

#### [LeetCode 721. 账户合并](https://leetcode-cn.com/problems/accounts-merge/)

> 若属性有一个相同，则认为为相同账户，输出去重后的账户情况.

Bad Case: A: a, b, c; B: d; C: a, d => A, B, C 一类

并查集，维护一个遍历父亲节点的数组

```python
class Solution:
    def accountsMerge(self, accounts: List[List[str]]) -> List[List[str]]:
        def get_root(r: list, p: int):
            q = r[p]
            while p != r[p]:
                p = r[p]
            while p != q:
                tmp = r[q]
                r[q] = p
                q = tmp
            return q

        N = len(accounts)
        ra = list(range(N))
        res, a_map = [set()] * N, {}
        for idx, ii in enumerate(accounts):
            have = set([get_root(ra, a_map[ii]) for ii in ii[1:] if ii in a_map])
            if not have:
                a_id = idx
                v = idx
            else:
                a_id = min(have)
                v = a_id
                # print(have, v)
                for jj in have:
                    if jj != a_id:
                        ra[jj] = v
                ra[idx] = v
                # print(ra)
            for jj in ii[1:]:
                a_map[jj] = v
        # print(ra)
        for ii in range(N):
            u = get_root(ra, ii)
            if u != ii:
                for jj in accounts[ii][1:]:
                    res[u].add(jj)
            else:
                res[ii] = set(accounts[ii][1:])
        return [ii[:1] + list(sorted(jj)) for ii, jj in zip(accounts, res) if jj]
```

#### [LeetCode 959. 由斜杠划分区域](https://leetcode-cn.com/problems/regions-cut-by-slashes/)

> 求斜杠划分的区域个数.

按并查集来做，把每个小方块划分成四个三角形，初始指向自己，然后按"/", "\"归并, 注意需要跨行归并.

```python
class Solution:
    def regionsBySlashes(self, grid: List[str]) -> int:
        def getRoot(r: list, p: int):
            q = r[p]
            while p != r[p]:
                p = r[p]
            while q != r[p]:
                tmp = r[q]
                r[q] = p
                q = tmp
            return p
        def union(r, u, v):
            u, v = getRoot(r, u), getRoot(r, v)
            r[u] = v
            return r
        N = len(grid)
        r = list(range(4 * N * N))
        for ii in range(N):
            for jj in range(N):
                tmp = grid[ii][jj]
                root = 4 * (ii * N + jj)
                if tmp in "/ ":
                    r = union(r, root + 0, root + 1)
                    r = union(r, root + 2, root + 3)
                if tmp in "\ ":
                    r = union(r, root + 1, root + 2)
                    r = union(r, root + 0, root + 3)
                if ii < N - 1:
                    r = union(r, root + 3, root + 4 * N + 1)
                if ii:
                    r = union(r, root + 1, root - 4 * N + 3)
                if jj < N - 1:
                    r = union(r, root + 2, root + 4 + 0)
                if jj:
                    r = union(r, root + 0, root - 4 + 2)
        return len([1 for ii in range(4 * N * N) if getRoot(r, ii) == ii])
```

#### [LeetCode 947. 移除最多的同行或同列石头](https://leetcode-cn.com/problems/most-stones-removed-with-same-row-or-column/)

> 只能移除在行、列上有其他点的点，求最多能移除几个点.

把同行、同列看成是边关系，则连通图能移除的点数量为 k - 1.

那么相对于问题就转换为找连通图的个数。

将边关系看做是一种集合相关的关系，则可用并查集。

```python
class Solution:
    def removeStones(self, stones: List[List[int]]) -> int:
        def get_root(r, p):
            q = r[p]
            while r[p] != p:
                p = r[p]
            while q != r[p]:
                tmp = r[q]
                r[q] = p
                q = tmp
            return p
        r = list(range(20000))
        for ii, jj in stones:
            u, v = get_root(r, ii), get_root(r, jj + 10000)
            r[u] = v
        # print(r)
        return len(stones) - len(set([get_root(r, ii) for ii, jj in stones]))
```

#### [LeetCode 5632. 检查边长度限制的路径是否存在](https://leetcode-cn.com/contest/weekly-contest-220/problems/checking-existence-of-edge-length-limited-paths/)

> 给定一个无向图，求从 A 到 B 点 是否存在一条路径使得每条边均小于一个值

一开始想的是 dfs，按 limit 进行过滤，但是时间复杂度于 query 大小有关，超时

将 edgeList 按 limit 正序排序，queries 也按 limit 正序排序

选出不超过 query limit 的边，然后查看连通状态，

连通状态就适合用并查集

```python
from collections import defaultdict

class Solution:
    def distanceLimitedPathsExist(self, n: int, edgeList: List[List[int]], queries: List[List[int]]) -> List[bool]:
        def get_father(r, p):
            q =  r[p]
            while p != r[p]:
                p = r[p]
            while q != p:
                tmp = r[q]
                r[q] = p
                q = tmp
            return p

        ra = list(range(n))
        N, M = len(edgeList), len(queries)
        ans = [0] * M
        q = [[ii] + jj for ii, jj in enumerate(queries)]
        q.sort(key=lambda i: i[-1])
        edgeList.sort(key=lambda i:i[-1])

        idx = 0
        for ii in range(M):
            while idx < N and edgeList[idx][-1] < q[ii][-1]:
                a, b = edgeList[idx][:-1]
                fa = get_father(ra, a)
                fb = get_father(ra, b)
                if fa != fb:
                    ra[fa] = fb
                idx += 1
            a, b = q[ii][1:-1]
            fa = get_father(ra, a)
            fb = get_father(ra, b)
            ans[q[ii][0]] =  fa == fb
        return ans
```

## 图

### 拓扑排序

拓扑排序是满足 `对于图G中的任意一条有向边(u, v), u在排列中都出现在v的前面` 的排列. => G 为有向无环图，且拓扑排序不唯一.

O(n+m)

用一个标志位记录遍历情况[0:未搜索, 1:正在搜索, 2:搜索完成]

如果在搜索过程中发现节点出现正在搜索，说明出现环了，必定不是拓扑排序

#### [LeetCode 210. 课程表 II](https://leetcode-cn.com/problems/course-schedule-ii/)

> 给定课程先后修的顺序，问这样的要求是否可行

利用一维数组，记录遍历状态(0,1,2)

```python
from collections import defaultdict
class Solution:
    def findOrder(self, numCourses: int, prerequisites: List[List[int]]) -> List[int]:
        def dfs(ii: int):
            flag[ii] = 1
            for v in edges[ii]:
                if flag[v] == 0:
                    dfs(v)
                    if not self.valid:
                        return
                elif flag[v] == 1:
                    self.valid = False
                    return
            flag[ii] = 2
            res.append(ii)

        res = []
        edges = defaultdict(list)
        flag = [0] * numCourses
        self.valid = True
        for ii, jj in prerequisites:
            edges[ii].append(jj)
        for ii in range(numCourses):
            if self.valid and flag[ii] == 0:
                dfs(ii)
        if not self.valid:
            return []
        return res
```

### 最小生成树

#### kruskal

```python
def kruskal(g, N, types):
    def get_edgenum():
        count = 0
        for ii in range(1, N + 1):
            for jj in range(ii + 1, N + 1):
                count += len([kk for kk in g[ii][jj] if kk in [3, types]]) > 0
        return count

    res = []
    M = get_edgenum()
    if N <= 0 or M < N - 1:
        # print(M, N)
        return -1
    edge_list = []
    for ii in range(N):
        for jj in range(ii, N):
            for kk in [kk for kk in g[ii][jj] if kk in [3, types]]:
                edge_list.append([ii, jj, kk])
    edge_list.sort(key=lambda a:-a[2])

    group = [[ii] for ii in range(N)]
    ans = 0
    for edge in edge_list:
        for ii in range(len(group)):
            if edge[0] in group[ii]:
                m = ii
            if edge[1] in group[ii]:
                n = ii
        if m != n:
            res.append(edge)
            group[m] = group[m] + group[n]
            group[n] = []
        else:
            ans += 1
            # print("======", edge)
    return ans
```

##### [LeetCode 5513. 连接所有点的最小费用](https://leetcode-cn.com/problems/min-cost-to-connect-all-points/)

> 给定一组点，求能连通的最短线段

相当于一个最小生成树的问题，只不过每个节点都和另外的节点之间存在可达的关系.
因为是完全图，遍历复杂度很高，对 kruskal 的归并过程做了查询优化, 用两个 map 空间换时间.

```python
class Solution:
    def minCostConnectPoints(self, p: List[List[int]]) -> int:
        def kruskal(edge_list):
            group = {ii: ii for ii in range(N)}
            group2 = [[ii] for ii in range(N)]
            ans = 0
            for edge in edge_list:
                m = group[edge[0]]
                n = group[edge[1]]
                if m != n:
                    ans += edge[2]
                    for ii in group2[n]:
                        group[ii] = m
                    group2[m] = group2[m] + group2[n]
                    group2[n] = []
            return ans

        N = len(p)
        edge_list = []
        for ii in range(N):
            for jj in range(ii):
                edge_list.append(
                    [ii, jj, abs(p[ii][0] - p[jj][0]) + abs(p[ii][1] - p[jj][1])]
                )
        edge_list = sorted(edge_list, key=lambda i: i[-1])
        return kruskal(edge_list)
```

### 最短路径

#### Dijkstra

##### [LeetCode 882. 细分图中的可到达结点](https://leetcode-cn.com/problems/reachable-nodes-in-subdivided-graph/)

> 给定一张图然后给定每条边内含有的节点数，从原点出发，限定步数内可达的节点数。

相当于求所有节点到原点的最短路径，并统计小于 K 的节点数

```python
from collections import defaultdict
import heapq
class Solution:
    def reachableNodes(self, edges: List[List[int]], M: int, N: int) -> int:
        g = defaultdict(dict)
        for ii, jj, kk in edges:
             g[ii][jj] = g[jj][ii] = kk
        queue, flag = [(0, 0)], {0: 0}
        used = {}
        res = 0
        while queue:
            d, head = heapq.heappop(queue)
            # print(d, head)
            if d > flag.get(head):
                continue
            res += 1
            for kk, vv in g[head].items():
                v = min(vv, M - d)
                used[(head, kk)] = v
                now_d = d + vv + 1
                if now_d < flag.get(kk, M + 1):
                    heapq.heappush(queue, (now_d, kk))
                    flag[kk] = now_d

        for ii, jj, kk in edges:
            res += min(kk, used.get((ii, jj), 0) + used.get((jj, ii), 0))
        return res
```

#### Floyd

O(N^3) 复杂度较高，用来维护全图最短路径，但一般不需要那么高要求的最短路径

```python
INF = 0x7fffffff
for kk in range(N):
    for ii in range(N):
        for jj in range(N):
            if dis[ii][kk] != INF and dis[kk][jj] != INF and dis[ii][kk] + dis[kk][jj] < dis[ii][jj]:
                dis[ii][jj] = dis[ii][kk] + dis[kk][kk]
```

#### A\*

A\*是 Dijkstra 的一般形式，按距离+期望剩余距离之和作为优先排序指标。

实现的时候还是优先队列

##### [LeetCode 773. 滑动谜题](https://leetcode-cn.com/problems/sliding-puzzle/)

> 滑块游戏，每次只能移动周围块到 0 位置，求能否将给定序列变成顺序序列，求最小步数。

DFS / A\* 期望代价为哈夫曼距离

```python
import heapq

class Solution:
    def slidingPuzzle(self, board: List[List[int]]) -> int:
        def get_h_dist(now):
            res = 0
            for ii in range(N):
                for jj in range(M):
                    tmp = now[ii * N + M]
                    arc_tmp = e_map[tmp]
                    res += abs(ii - arc_tmp[0]) + abs(jj - arc_tmp[1])
            return res

        N, M = len(board), len(board[0])
        target = tuple(list(range(1, N * M)) + [0])
        target_wrong = tuple(list(range(1, N * M - 2)) + [N * M - 1, N * M - 2, 0])
        head = tuple([jj for ii in board for jj in ii])
        queue = [(0, 0, head, head.index(0))]
        e_map = {(N * ii + jj + 1) % (N * M): (ii, jj) for ii in range(N) for jj in range(M)}
        e_map[0] = (N - 1, M - 1)
        cost = {head: 0}

        while queue:
            c, h, now, idx = heapq.heappop(queue)
            if now == target:
                return h
            if now == target_wrong:
                return -1
            if c > cost[now]:
                continue
            for dx in (1, -1, M, -M):
                new_idx = idx + dx
                if abs(new_idx // M - idx // M) + abs(new_idx % M - idx % M) != 1 or not (0 <= new_idx < N * M):
                    continue
                tmp = list(now)
                tmp[new_idx], tmp[idx] = tmp[idx], tmp[new_idx]
                tmp_tuple = tuple(tmp)
                new_c = h + 1 + get_h_dist(tmp)
                if new_c < cost.get(tmp_tuple, float("inf")):
                    cost[tmp_tuple] = new_c
                    heapq.heappush(queue, (new_c, h + 1, tmp_tuple, new_idx))
        return -1
```

#### Tarjan

#### [LeetCode 1192. 查找集群内的「关键连接」](https://leetcode-cn.com/problems/critical-connections-in-a-network/)

> 若环内，则不是关键连接，否则为关键连接。

Tarjan，O(V + E), refer to: https://www.bilibili.com/video/BV15t4y197eq/

若没遍历过，初始化一个 idx, 再去遍历邻接，如果邻接有比它小的，则有环。

```python
from collections import defaultdict

class Solution:
    def criticalConnections(self, n: int, connections: List[List[int]]) -> List[List[int]]:
        def dfs(idx, father, depth):
            if ids[idx] >= 0:
                return ids[idx]
            ids[idx] = depth
            m_depth  = n
            for ii in g[idx]:
                if ii == father:
                    continue
                sub_depth =  dfs(ii, idx, depth + 1)
                if sub_depth <= depth:
                    connections.discard(tuple(sorted((idx, ii))))
                m_depth = min(sub_depth, m_depth)
            return m_depth

        g = defaultdict(list)
        for ii, jj in connections:
            g[ii].append(jj)
            g[jj].append(ii)
        ids = [-1] * n
        connections = set([tuple(sorted((ii, jj))) for ii, jj in connections])
        dfs(0, -1, 0)
        return list(connections)
```

## 数学题

### 运算(算数，位)

#### [LeetCode 1015. 可被 K 整除的最小整数](https://leetcode-cn.com/problems/smallest-integer-divisible-by-k/)

> 长度为 x 的 1 组成的数字能否被 K 整除.
> 模拟长除，用 set 存储当前余数，若余数已经出现过，则不能整除

```python
class Solution:
    def smallestRepunitDivByK(self, K: int) -> int:

        def getDiv(num: int):
            have, res = set(), 1
            while num % K:
                if num in have:
                    return -1
                have.add(num)
                num = (num % K) * 10 + 1
                res += 1
            return res
        return getDiv(1)
```

#### [LeetCode 461. 汉明距离](https://leetcode-cn.com/problems/hamming-distance/)

> 计算两个对应的二进制不同的位数
> 布赖恩·克尼根算法 x & (x - 1)

```python
class Solution:
    def hammingDistance(self, x: int, y: int) -> int:
        xor = x ^ y
        res = 0
        while xor:
            res += 1
            xor = xor & (xor - 1)
        return res
```

#### [LeetCode 793. 阶乘函数后 K 个零](https://leetcode-cn.com/problems/preimage-size-of-factorial-zeroes-function/)

> 求阶乘后 K 位为 0 的 x 数量

1. 如果\*100 的倍数，则有一位不会有 x 满足，答案为 0，其他的都应该是 5
2. x!=2^a5^b....
3. a 远大于 b
4. 所以我们只需去确认 5^b 的个数
5. x! 末尾的零个数 = x // 5 + x // 5^2 + ... +

```python
class Solution:
    def preimageSizeFZF(self, K: int) -> int:
        def zeta(x):
            return x // 5 + zeta(x // 5) if x > 0 else 0
        left, right = K, 10 * K + 1
        while left < right:
            mid = (left + right) // 2
            mid_v = zeta(mid)
            if mid_v == K:
                return 5
            elif mid_v < K:
                left = mid + 1
            else:
                right = mid
        return 0
```

#### [LeetCode 899. 有序队列](https://leetcode-cn.com/problems/orderly-queue/)

> 每次可以从队列中选取前 K 个中的一个移动到队尾，不限制次数，求使得队列字典序最小的解.

一开始想的是类似 402 记忆化搜索的方式，但是"bbbbcaaa" 这种情况则不会选择，实际上还是要考虑全局最优

当 K>=2 时，则可以看做是冒泡排序

```python
class Solution:
    def orderlyQueue(self, S: str, K: int) -> str:
        if K == 1:
            return min([S[ii:] + S[:ii] for ii in range(len(S))])
        return "".join(sorted(S))
```

#### [LeetCode 1442. 形成两个异或相等数组的三元组数目](https://leetcode-cn.com/problems/count-triplets-that-can-form-two-arrays-of-equal-xor/)

> 求 a = arr[i] ^ arr[i + 1]^...^arr[j - 1] == b = arr[j] ^ arr[j + 1] ^ ... ^ arr[k] 的所有三元组个数

正常来做 O(N^3)的复杂度

但实际上 a == b <=> a^b=0=arr[i] ^ arr[i+1] ^ ... ^ arr[k] 这是一个与 j 无关的式子 => O(N^2)

```python
class Solution:
    def countTriplets(self, arr: List[int]) -> int:
        N = len(arr)
        A, pre = [arr[0]], arr[0]
        for ii in arr[1:]:
            pre ^= ii
            A.append(pre)
        res = 0
        for ii in range(N):
            for kk in range(ii + 1, N):
                a_i, a_k = A[ii - 1] if ii else 0, A[kk]
                a_ik = a_k ^ a_i
                if not a_ik:
                    res += kk - ii
        return res
```

#### [LeetCode 260. 只出现一次的数字 III](https://leetcode-cn.com/problems/single-number-iii/)

> 找出现一次的数的加强版，有两个这样的单次数，其他的数字都出现两次，求找出该数字。

如果是只有一个单次数 直接 异或现在 相当于 a = x ^ y = arr[0] ^ arr[1] ^ ... ^ arr[N - 1]

那么我们还需要建立一个等式 或者 想办法把 x y 中的一个求出来

那么我们记录 a 2 进制中的最后一个 1 的位置 => a & (-a)

那么去判断 arr 里面的数字 如果该位为 1 则统计一次异或，就能求出 x

```python
class Solution:
    def singleNumber(self, nums: List[int]) -> List[int]:
        N = len(nums)
        a = 0
        for ii in nums:
            a ^= ii
        b = a & (-a)
        x = 0
        for ii in nums:
            if ii & b:
                x ^= ii
        return [x, a ^ x]
```

#### [LeetCode 342. 4 的幂](https://leetcode-cn.com/problems/power-of-four/)

> 判断数字是否是 4 的幂

2 进制 4 ^ n 中 1 都在偶数位 则和奇数位异或 == 0

```python
class Solution:
    def isPowerOfFour(self, num: int) -> bool:
        return num > 0 and num & (num - 1) == 0 and num & 0xaaaaaaaa == 0
```

#### [LeetCode 861. 翻转矩阵后的得分](https://leetcode-cn.com/problems/score-after-flipping-matrix/)

> 给定一组二进制数，对每一行、列都能翻转，求翻转之后最大和

贪心的看，如果第一位为 1，那么行翻转就没得意义.

按列相加

```python
class Solution:
    def matrixScore(self, A: List[List[int]]) -> int:
        N, M = len(A), len(A[0])
        res = 0
        for jj in range(M):
            num = 0
            for ii in range(N):
                num += A[ii][jj] ^ A[ii][0]
            res += max(num, N - num) * 2 ** (M - jj - 1)
        return res
```

### 线段, 集合

#### [LeetCode 1330. 翻转子数组得到最大的数组值](https://leetcode-cn.com/problems/reverse-subarray-to-maximize-array-value/)

> 求数组相差的绝对值最大值，可翻转数组[i, j]一次

翻转数据 即 改变 Total + abs(nums[ii - 1] - nums[ii]) + abs(nums[jj] - nums[jj + 1])

到 Total + abs(nums[ii - 1] - nums[jj]) + abs(nums[ii] - nums[jj + 1])

即两个线段的中间距离

当线段没有交集的时候，才能增大

```python
class Solution:
    def maxValueAfterReverse(self, nums: List[int]) -> int:
        N = len(nums)
        pairs = [(min(ii, jj), max(ii, jj)) for ii, jj in zip(nums[:-1], nums[1:])]
        sum_list = [jj - ii for ii, jj in pairs]
        a = max([ii for ii, _ in pairs])
        b = min([jj for _, jj in pairs])
        res = 0
        for ii in range(1, N):
            res = max(res, abs(nums[ii] - nums[0]) - abs(nums[ii - 1] - nums[ii]))
            res = max(res, abs(nums[ii - 1] - nums[-1]) - abs(nums[ii] - nums[ii - 1]))
        return sum(sum_list) + max(2 * (a - b), res)
```

### 平面几何

#### [LeetCode 587. 安装栅栏](https://leetcode-cn.com/problems/erect-the-fence/)

> 寻找给定点集的边界

1. 寻找最左端点
2. 寻找点积为负的边
3. 依次遍历

```python
from collections import Counter
class Solution:
    def outerTrees(self, points: List[List[int]]) -> List[List[int]]:
        def getLineDist(a: list, b: list, c: list):
            return (b[1] - a[1]) * (c[0] - b[0]) - (b[0] - a[0]) * (c[1] - b[1])
        def isBetween(a: list, c: list, b: list):
            aa = b[0] >= c[0] >= a[0] or b[0] <= c[0] <= a[0]
            bb = b[1] >= c[1] >= a[1] or b[1] <= c[1] <= a[1]
            return aa and bb

        res, N, times, left_most = set(), len(points), 0, 0
        if N <= 4:
            return points
        for ii in range(N):
            if points[ii][0] < points[left_most][0]:
                left_most = ii
        p = left_most

        while (p != left_most or times == 0):
            q = (p + 1) % N
            for ii in range(N):
                if ii in [p, q]:
                    continue
                if getLineDist(points[p], points[ii], points[q]) < 0:
                    q = ii

            for ii in range(N):
                if ii in [p, q]:
                    continue
                if getLineDist(points[p], points[ii], points[q]) == 0 and isBetween(points[p], points[ii], points[q]):
                    # print(points[p], points[ii], points[q])
                    res.add(tuple(points[ii]))
            res.add(tuple(points[q]))
            p = q
            times += 1

        return [list(ii) for ii in res]
```

#### [LeetCode 789. 逃脱阻碍者](https://leetcode-cn.com/problems/escape-the-ghosts/)

> 模拟糖豆人游戏。
> 判断能否在对手前面达到终点, 中途碰见对手则失败

简化问题，如果对手能在中途拦截，说明能在你之前到达某个 X(且 X 想必(0,0) 更靠近目标点)。

所以如果能在中途拦截，意味着能在之前到达目标点。

因为只能上下左右移动，则计算哈夫曼距离即可.

```python
class Solution:
    def escapeGhosts(self, ghosts: List[List[int]], target: List[int]) -> bool:
        def getDistance(x: list, y: list):
            return abs(x[0] - y[0]) + abs(x[1] - y[1])
        our = getDistance([0, 0], target)
        print(our)
        for ii in ghosts:
            tmp = getDistance(ii, target)
            print(tmp)
            if tmp <= our:
                return False
        return True
```

#### [LeetCode 149. 直线上最多的点数](https://leetcode-cn.com/problems/max-points-on-a-line/)

> 求点集中线最大经过的点个数.

两层循环，对 i 点，记录所有斜率和水平竖直线个数.

```java
class Solution {
    public int maxPoints(int[][] points) {
        int N = points.length;
        if (N <= 2){
            return N;
        }
        int res = 2;
        for (int ii = 0; ii < N; ++ii){
            int x1 = points[ii][0], y1 = points[ii][1];
            Map<String, Integer> tmp = new HashMap<String, Integer>();
            int c_d = 0, h_l = 1;
            for (int jj = ii + 1; jj < N; ++jj){
                int x2 = points[jj][0], y2 = points[jj][1];
                if (x1 == x2 && y1 == y2){
                    c_d += 1;
                } else if (y1 == y2){
                    h_l += 1;
                } else{
                    int d = gcd(x1 - x2, y1 - y2);
                    int dx = (x1 - x2) / d, dy = (y1 - y2) / d;
                    String k = String.format("%d,%d", dx, dy);
                    tmp.put(k, tmp.getOrDefault(k, 1) + 1);
                }
            }
            int now = 0;
            for (int k: tmp.values()){
                now = Math.max(now, k);
            }
            now = Math.max(now, h_l) + c_d;
            res = Math.max(res, now);
        }
        return res;
    }

    public int gcd(int a, int b){
        if (b != 0){
            return gcd(b, a % b);
        }
        return a;
    }
}
```

#### [LeetCode 391. 完美矩形](https://leetcode-cn.com/problems/perfect-rectangle/)

> 给出一组矩阵，求该组矩阵组拼接的范围是否是一个完整没有重合的矩形

拼接成矩形中间的点每个都是两个小矩阵的顶点

```python
class Solution:
    def isRectangleCover(self, rectangles: List[List[int]]) -> bool:
        N = len(rectangles)
        points, S = set(), 0
        for x1, y1, x2, y2 in rectangles:
            S += (x2 - x1) * (y2 - y1)
            for point in [(x1, y1), (x1, y2), (x2, y1), (x2, y2)]:
                if point in points:
                    points.remove(point)
                else:
                    points.add(point)
        points = sorted(points)
        if not len(points):
            return False

        x1, y1 = points[0]
        x2, y2 = points[-1]
        if len(points) != 4:
            return False
        new_S = (x2 - x1) * (y2 - y1)
        if new_S != S:
            return False
        return True
```

### 函数, 递推关系式

#### [LeetCode 1014. 最佳观光组合](https://leetcode-cn.com/problems/best-sightseeing-pair/)

> 评分为 = A[i] + A[j] + i - j, (i < j)

最简单的想法是两层循环，但当遍历到 j 位置时, A[j] - j 确定了，我们保存前 i 个位置最大的 A[i] + i 即可得到最优解.

```python
class Solution:
    def maxScoreSightseeingPair(self, A: List[int]) -> int:
        N = len(A)
        mx, ans = A[0] + 0, 0
        for ii in range(1, N):
            ans = max(ans, mx + A[ii] - ii)
            mx = max(mx, A[ii] + ii)
        return ans
```

#### [LeetCode 390. 消除游戏](https://leetcode-cn.com/problems/elimination-game/)

> 1,2,3,4,...,n 隔一个取数. 第二步，反向隔一个取数，求最后剩下的数.

约瑟夫环

1. f(2k) = 2(k+1 - f(x))
2. f(2k+1) = 2(k+1 - f(x))

```java
class Solution {
    public int lastRemaining(int n) {
        return n == 1 ? 1:2 * ((n >> 1) + 1 - lastRemaining(n >> 1));
    }
}
```

#### [LeetCode 60. 第 k 个排列](https://leetcode-cn.com/problems/permutation-sequence/)

> 按大小顺序计算第 k 大的排序

取余阶乘数

```python
class Solution:
    def getPermutation(self, n: int, k: int) -> str:
        dp = [1]
        for ii in range(1, n):
            dp.append(dp[-1] * ii)
        k -= 1
        res, flag = [], [1] * (n + 1)
        for ii in range(1, n + 1):
            order = k // dp[n - ii] + 1
            for jj in range(1, n + 1):
                order -= flag[jj]
                if order == 0:
                    res.append(str(jj))
                    flag[jj] = 0
                    break
            k %= dp[n - ii]
        return "".join(res)
```

#### [LeetCode 891. 子序列宽度之和](https://leetcode-cn.com/problems/sum-of-subsequence-widths/)

> 求所有子序列的宽度(最大+最小)和

1. 对数组排序；
2. `$\sum(2^(j-i-1)(A_j-A_i))$`

转换求和顺序

=> `\begin{equation}\sum_{i=0}^{n-1}(2^i-2^{N-i-1})A_i\end{equation}`

```python
class Solution:
    def sumSubseqWidths(self, A: List[int]) -> int:
        N = len(A)
        A = sorted(A)
        MODS = 10 ** 9 + 7
        pow2, res = [1], 0
        for ii in range(1, N):
            pow2.append(2 * pow2[-1] % MODS)
        for ii, jj in enumerate(A):
            res = (res + (pow2[ii] - pow2[N - ii - 1]) * jj) % MODS
        return res
```

### 组合

> 组合问题除了使用 DFS + 组合数之外，还能使用背包进行重复子问题压缩. 参考 [Leetcode 377. 组合总和 Ⅳ](https://leetcode-cn.com/problems/combination-sum-iv/)

#### [LeetCode 5502. 将子数组重新排序得到同一个二叉查找树的方案数](https://leetcode-cn.com/contest/weekly-contest-204/problems/number-of-ways-to-reorder-array-to-get-same-bst/)

> 统计能够顺次新建出相同 BST 的数组个数，取模 10\*\*9+7

构造相同 BST, 需要保证> nums[0]的 还按照相同顺序排列

例如 < nums[0] 的 K1 个数字，先选位置 C\_(N - 1)^(K1)

然后在子序列中按照相同规则构造

```python
class Solution:
    def numOfWays(self, nums: List[int]) -> int:
        def getC(a: int, b: int):
            if 2 * b > a:
                b = a - b
            res = 1
            for ii in range(a - b + 1, a + 1):
                res *= ii
            for ii in range(2, b + 1):
                res //= ii
            return res

        def dfs(left: int, right: int, nums: list):
            if len(nums) <= 2:
                return 1
            t, res = nums[0], getC(right - left, nums[0] - left)
            res *= dfs(left, t - 1, [ii for ii in nums if ii < t])
            res *= dfs(t + 1, right, [ii for ii in nums if ii > t])
            res %= (10 ** 9 + 7)
            return res
        return dfs(1, len(nums), nums) - 1
```

#### [LeetCode 5492. 分割字符串的方案数](https://leetcode-cn.com/problems/number-of-ways-to-split-a-string/)

> 给定 01 组成的字符串，求平分 1 个数的三个子串的可能情况.

1. 全 0，则变成组合问题, C(2, N - 1)
2. 存在 1，则找到第一个满足 T3//3 T3//3 + 1 的 index, 然后拓展 index 到非 0 点
3. 两个线段长度相乘

```python
class Solution:
    MODS = 10 ** 9 + 7

    def numWays(self, s: str) -> int:
        def getC(a, b):
            res = 1
            if b > a >> 1:
                b = a - b
            for ii in range(a, a - b, -1):
                res *= ii
            for ii in range(2, b + 1):
                res /= ii
            return int(res) % self.MODS

        N = len(s)
        T3 = len([1 for ii in s if ii == "1"])
        if T3 % 3:
            return 0
        if not T3:
            return getC(N - 1, 2)
        b, e, num, idx = [], [], 0, 0
        while idx < N and num != (T3 // 3):
            num += s[idx] == "1"
            idx += 1
        b.append(idx - 1)
        while idx < N and s[idx] == "0":
            idx += 1
        e.append(idx)
        while idx < N and num != (T3 // 3) * 2:
            num += s[idx] == "1"
            idx += 1
        b.append(idx - 1)
        while idx < N and s[idx] == "0":
            idx += 1
        e.append(idx)
        res = 1
        for ii, jj in zip(b, e):
            res *= jj - ii
        return res % self.MODS
```

#### [LeetCode 1079. 活字印刷](https://leetcode-cn.com/problems/letter-tile-possibilities/)

> 求字体排序的可能情况, 单个字块仅可使用一次.

dfs + 组合数
为了避免重复计算，记录上一轮使用的字块个数.

```python
from collections import Counter
class Solution:
    def numTilePossibilities(self, tiles: str) -> int:
        def getC(a, b):
            ans = 1
            if b > a // 2:
                b = a - b
            for ii in range(a, a - b, -1):
                ans *= ii
            for ii in range(2, b + 1):
                ans /= ii
            return int(ans)

        def dfs(idx: int, last_num:int, now: dict):
            total = sum(now.values())
            if total and last_num:
                ans = 1
                for ii in now.values():
                    ans *= getC(total, ii)
                    total -= ii
                self.res += ans
            else:
                ans = 0
            if idx > N - 1:
                return
            for jj in range(c_y[idx] + 1):
                if jj:
                    now[c_x[idx]] = jj
                dfs(idx + 1, jj, now)
                if jj:
                    del now[c_x[idx]]

        c = Counter(tiles)
        c_x = list(c.keys())
        c_y = list(c.values())
        N = len(c_x)
        self.res = 0
        dfs(0, 0, {})
        return self.res
```

##### [LeetCode 5204. 统计为蚁群构筑房间的不同顺序](https://leetcode-cn.com/problems/count-ways-to-build-rooms-in-an-ant-colony/)

> 求树状拓扑排序的情况数

`\begin{equation}f[i] = \left( \prod_{\textit{ch}} f[\textit{ch}] \right) \times \frac{(\textit{cnt}[i] - 1)!}{\prod_{\textit{ch}} \textit{cnt}[\textit{ch}]!}\end{equation}`

根据费马小定理提前构建乘法逆元，再根据上述公式

```python
class Solution:
    MOD = 10 ** 9 + 7
    def waysToBuildRooms(self, prevRoom: List[int]) -> int:
        N = len(prevRoom)
        # fac[i] 表示 i!
        # inv[i] 表示 i! 的乘法逆元
        F, iF = [0] * N, [0] * N
        F[0] = iF[0] = 1
        for i in range(1, N):
            F[i] = F[i - 1] * i % self.MOD
            # 使用费马小定理计算乘法逆元
            iF[i] = pow(F[i], self.MOD - 2, self.MOD)

        # 构造树
        edges = defaultdict(list)
        for i in range(1, N):
            edges[prevRoom[i]].append(i)

        f, cnt = [0] * N, [0] * N

        def dfs(u: int) -> None:
            f[u] = 1
            for v in edges[u]:
                dfs(v)
                # 乘以左侧的 f[ch] 以及右侧分母中 cnt[ch] 的乘法逆元
                f[u] = f[u] * f[v] * iF[cnt[v]] % self.MOD
                cnt[u] += cnt[v]
            # 乘以右侧分子中的 (cnt[i] - 1)!
            f[u] = f[u] * F[cnt[u]] % self.MOD
            cnt[u] += 1

        dfs(0)
        return f[0]
```

#### 三色问题

"?"组合情况也属于三色问题

##### [LeetCode 5507. 替换所有的问号](https://leetcode-cn.com/problems/replace-all-s-to-avoid-consecutive-repeating-characters/)

> 求一种将问号枚举出来，且不与周围重复的情况.

仅仅是枚举一种情况还是很简单的，依次遍历 a-z,检查周围

```python
class Solution:
    def modifyString(self, s: str) -> str:
        res = ""
        idx, N = 0, len(s)
        while idx < N:
            if s[idx] != "?":
                res += s[idx]
                idx += 1
                continue
            tmp = 0
            while tmp < 26 and ((idx != 0 and res[idx - 1] == chr(tmp + 97)) or (idx != N - 1 and s[idx + 1]) == chr(tmp + 97)):
                tmp += 1
            res += chr(tmp + 97)
            idx += 1
        return res
```

##### [LeetCode 5811. 用三种不同颜色为网格涂色](https://leetcode-cn.com/problems/painting-a-grid-with-three-different-colors/)

> 求 M\*N 矩阵的三色问题情况数，取 10\*\*9+7 的余数

注意到`$M\in [1,5]$`

1. 枚举列的可能情况
2. 判断每种列情况的下一个可能情况

```python
class Solution:
    MOD = 10 ** 9 + 7
    def colorTheGrid(self, m: int, n: int) -> int:
        base, wait = [], [0, 1, 2]
        def dfs(now):
            if len(now) == m:
                base.append(now)
                return
            for ii in wait:
                if not now or ii != now[-1]:
                    dfs(now + [ii])

        dfs([])
        N = len(base)
        dp = [[0] * N for _ in range(n)]
        dp[0] = [1] * N
        can = defaultdict(list)
        for ii in range(N):
            for jj in range(N):
                flag = True
                for kk in range(m):
                    if base[ii][kk] == base[jj][kk]:
                        flag = False
                        break
                if flag:
                    can[ii].append(jj)

        for ii in range(1, n):
            for jj in range(N):
                for kk in can[jj]:
                    dp[ii][jj] += dp[ii - 1][kk]
                    dp[ii][jj] %= self.MOD
        return sum(dp[-1]) % self.MOD
```

## 空间 O(1)

### 投票法

#### [LeetCode 面试题 17.10. 主要元素](https://leetcode-cn.com/problems/find-majority-element-lcci/)

> O(N), 空间 O(1)下找出超过半数的数字

维护两个变量，候选值，候选值次数(如相同+1，不相同-1)
当次数=0 是更新候选值

```python
class Solution:
    def majorityElement(self, nums: List[int]) -> int:
        c, num = -1, 0
        for ii in nums:
            if num == 0:
                c = ii
            if c == ii:
                num += 1
            else:
                num -= 1
        num = len([1 for ii in nums if ii == c])
        return c if num > len(nums) / 2 else -1
```

## 指针

### 快慢指针

> 常用在寻找环结构, 在链表中使用频次较高.

#### [LeetCode 19. 删除链表的倒数第 N 个节点](https://leetcode-cn.com/problems/remove-nth-node-from-end-of-list/)

1. fast 指针先走 n 步;
2. fast， slow 指针一起走，直到队尾;

```java
class Solution {
    public ListNode removeNthFromEnd(ListNode head, int n) {
        ListNode fast = head, slow = head;
        ListNode res;
        for (int i = 0; i < n; ++i) {
            fast = fast.next;
        }
        while (fast != null && fast.next != null) {
            fast = fast.next;
            slow = slow.next;
        }
        if (fast == null) {
            res = head.next;
        } else {
            res = head;
            slow.next = slow.next.next;
        }
        return res;
    }
}
```

#### [LeetCode 287. 寻找重复数](https://leetcode-cn.com/problems/find-the-duplicate-number/)

对 nums[] 数组建图，每个位置 i 连 -> nums[i]. 因为存在重复的数字，因此 target 存在两条边，一定存在环

```java
class Solution {
    public int findDuplicate(int[] nums) {
        int slow = 0, fast = 0;
        do {
            slow = nums[slow];
            fast = nums[nums[fast]];
        } while (slow != fast);
        slow = 0;
        while (slow != fast) {
            slow = nums[slow];
            fast = nums[fast];
        }
        return slow;
    }
}
```

### 双指针

> 这边不包括二分的一些 case, 二分查找，第 k 大，快排
> 验证回文

```java
int left = 0;
int right = nums.length - 1;
```

#### 两数之和

##### [LeetCode 167. Two Sum II - Input array is sorted](https://leetcode-cn.com/problems/two-sum-ii-input-array-is-sorted/)

> 因为只有一组情况满足 nums[left] + nums[right] == target
> 双指针将遍历复杂度从 O(n^2) 降低到 O(n).
> 左指针->0, 右指针->N-1.
> sum > target, right--;
> sum < target, left++;

```java
public int[] twoSum(int[] nums, int target) {
    int left = 0, right = nums.length - 1;
    while (left < right) {
        int sum = nums[left] + nums[right];
        if (sum == target) {
            return new int[]{left + 1, right + 1};
        } else if (sum < target) {
            left++;
        } else if (sum > target) {
            right--;
        }
    }
    return new int[]{-1, -1};
}
```

#### 滑动窗口

滑动窗口用的比较多, LeetCode 3, 76

总的思路

1. left = 0, right = 0
2. 移动右指针, 直到第一次满足条件 >= target
3. 移动左指针, 直到第一次破坏条件 <= target
4. 依次反复

##### [LeetCode 3. 无重复字符的最长子串](https://leetcode-cn.com/problems/longest-substring-without-repeating-characters/)

> 给定一个字符串，请你找出其中不含有重复字符的 最长子串 的长度。

通过 hashSet 去统计该字符有没有存在过。
left 移动的时候，清理 hashSet 中的 left 所指向的内容。

```java
public int lengthOfLongestSubstring(String s) {
    int N = s.length();
    if (N == 0) {
        return 0;
    }
    int result = 0;
    int left = 0;     // 左指针初始位置
    int right = 0;    // 右指针初始位置
    HashSet<Character> subset = new HashSet<>();
    subset.add(s.charAt(0)); // 先把第0个字符放入Set

    while (left < N) {
        // 先判断长度，再判断是否包含字符，避免越界
        // right初始位置是0，0号字符已被加入集合，从下一个字符开始计算
        while (right + 1 < N && ! subset.contains(s.charAt(right + 1)) ) {
            subset.add(s.charAt(right + 1));
            right++;
        }
        result = Math.max(result, right - left + 1);
        if (right + 1 == N) { // 右指针移动到最后，可以终止计算，不需要再循环
            break;
        }
        subset.remove(s.charAt(left));
        left++;
    }

    return result;
}
```

> 有序数组, 右指针先走，左指针不动，先找到第一个满足 nums[left] + nums[right] >= target 的 right, 然后移动 left 直到 nums[left] + nums[right] <= target
> 通过依次、交替移动左右指针，每次移动是在上一次遍历结果之上，来减少一些不必要的遍历。

##### [LeetCode 76. 最小覆盖子串](https://leetcode-cn.com/problems/minimum-window-substring/)

> 给你一个字符串 S、一个字符串 T 。请你设计一种算法，可以在 O(n) 的时间复杂度内，从字符串 S 里面找出：包含 T 所有字符的最小子串。

和 3 思路比较类似，

1. left right 从 0 开始;
2. 用 HashMap 统计 left -> right 之间字符出现情况, 并与 T 出现的字符进行对比，移动 right 直到能够包含所有 T 中出现的字符；
3. 移动左指针，并更新 HashMap 直到不包含所有 T 中的字符；
4. 重复直到 right > N

下面是你上次写的代码，用的也是相同的思想. 只不过不用 HashMap 而是使用 ASCII 码来解决，数组里面的数字表示该 ASCII 码对应的字符需要多少个数。

```java
class Solution {
    public String minWindow(String s, String t) {
        //这题超级无敌复杂
        //又是滑动窗口
        //核心是有一个参数来控制左右交替，此处是count

        int left=0;
        int right=0;
        int count=0;//子串中目标字符的总数，最高等于t长度，多了结果不对
        int minlen=s.length()+1;//最小长度
        int minright=0;//最小长度时的位置
        int[] need = new int[128];//需要哪些字符，按照ascii码，
        int[] have = new int[128];//已经有了哪些
        //输入需要的need
        for(int i=0;i<t.length();i++){
            need[t.charAt(i)]++;
        }

        //结构上比较容易错：右边if 左边while
        while(right<=s.length()){
            System.out.println(left + " " + right + " " + count);
            //需要的字符数量不够，右边++
            if(count<t.length()){
                if (right >= s.length()){
                    break;
                }
                if(need[s.charAt(right)]==0){
                right++;
                    continue;
                }

                if(have[s.charAt(right)]<need[s.charAt(right)]){
                    count++;
                }

                have[s.charAt(right)]++;
                right++;
            }
            //需要的字符刚好了，左边++
            //为什么是while
            if (count==t.length()){
                   if(minlen>right-left){
                     minlen=right-left;
                     minright=right;
                    }
                if(need[s.charAt(left)]==0){
                    left++;
                    continue;
                }

                if(need[s.charAt(left)]==have[s.charAt(left)]){
                    count--;
                }
                have[s.charAt(left)]--;
                left++;
                System.out.println(left + " " + right);
                // System.out.print(right);
                // System.out.print(" ");
            }
        }
        if( minlen>s.length()) return "";
        else
            return s.substring(minright-minlen,minright);
    }
}
```

##### [LeetCode 1234. 替换子串得到平衡字符串](https://leetcode-cn.com/problems/replace-the-substring-for-balanced-string/)

1. 统计超出 N // 4 个数的字符情况;
2. 再对判断包含改字符分布的最大区间; -> 双指针

```java
class Solution {
    public int balancedString(String s) {
        if(s==null || s.length()<=0) return -1;
        int N=s.length();
        //这里用26有的浪费,为了方便写代码,就这样吧
        int[] need=new int[26];
        //初始化为-N/4这样最后得到的大于0的值就是多出来的
        Arrays.fill(need, -N/4);
        int[] cur=new int[26];
        for(int i=0;i<N;i++){
            need[s.charAt(i)-'A']++;
        }
        //有几个字符多出来了
        int needCount=0;
        for(int i=0;i<need.length;i++){
            if(need[i]>0) needCount++;
        }
        if(needCount==0) return 0;
        int res=N;
        int left=0,right=0;
        int matchCount=0;
        //无脑套路滑窗
        while(right<s.length()){
            char c=s.charAt(right);
            if(need[c-'A']>0){
                cur[c-'A']++;
                if(cur[c-'A']==need[c-'A']){
                    matchCount++;
                }
            }
            while(left<=right && matchCount==needCount){
                res=Math.min(right-left+1,res);
                char cl=s.charAt(left);
                if(need[cl-'A']>0){
                    cur[cl-'A']--;
                    if(cur[cl-'A']<need[cl-'A']){
                        matchCount--;
                    }
                }
                left++;
            }
            right++;
        }
        return res;
    }
}
```

##### [LeetCode 5493. 删除最短的子数组使剩余数组有序](https://leetcode-cn.com/problems/shortest-subarray-to-be-removed-to-make-array-sorted/)

> 给定一个数组，求删除某个连续的子数组(1 个)之后能让剩下的数组有序递增的最短长度.

这边用双指针+遍历 来做

首先因为只能删除一个子数组，那么存在两种情况:

1. 两端保留，删除中间;
2. 一端保留，一端删除;

对于 Case1, 直接求得两端最长上升数组(left, right)，然后双指针, 依次寻找 nums[l] <= nums[r]的点，从而计算最小删除长度(r - l - 1);
对于 Case2， 直接求两端最长上升数组即可(可复用 Case1)

```python
class Solution:
    def findLengthOfShortestSubarray(self, arr: List[int]) -> int:
        N = len(arr)
        left, right = 0, N - 1
        while left + 1 < N and arr[left + 1] >= arr[left]:
            left += 1
        while right - 1 >= 0 and arr[right - 1] <= arr[right]:
            right -= 1
        res = min(N - 1, N - left - 1, right)
        l, r = left, right
        if arr[l] <= arr[r]:
            return max(r - l - 1, 0)
        while r < N and arr[r] < arr[l]:
            r += 1
        while l >= 0 and r >= right:
            while r - 1 >= right and arr[l] <= arr[r - 1]:
                r -= 1
            res = min(res, max(r - l - 1, 0))
            l -= 1
        return res
```

##### [LeetCode 1498. 满足条件的子序列数目](https://leetcode-cn.com/problems/number-of-subsequences-that-satisfy-the-given-sum-condition/)

> 给定一个无序数组，求满足最小+最大值 <= target 的所有子序列个数

因为是子序列，而且只关心最大最小值，那么和顺序无关 => 可提前排序

v_min <= v_max <= target - v_min => v_min <= target / 2

当固定 v_min 的时候可以找到确定的 v_max 上界 => 双指针

那么 在 v_min - v_max 之间的可能组合数 = 2 \*\* (j - i) 选/不选

```python
class Solution:
    MODS = 10 ** 9 + 7
    def numSubseq(self, nums: List[int], target: int) -> int:
        N = len(nums)
        cal_map = [1]
        for ii in range(1, N):
            cal_map.append(cal_map[-1] * 2 % self.MODS)
        left, right, res = 0, N - 1, 0
        nums.sort()
        while left < N:
            if nums[left] * 2 > target:
                break
            while right - 1 >= left and nums[left] > target - nums[right]:
                right -= 1
            res += cal_map[right - left]
            # print(left, right, cal_map[right - left], nums[left])
            left += 1
        return res % self.MODS
```

## 数据结构

### [LeetCode 710. 黑名单中的随机数](https://leetcode-cn.com/problems/random-pick-with-blacklist/)

> 给定一个[0,N)的数组，和一个黑名单，返回不在黑名单中的随机数。

1. 最简单的想法直接记录白名单，空间太大.
2. 产生随机数 k=N - len(b), 然后二分查找白名单中第 k 个数字.
3. 建立映射

```python
class Solution:
    def __init__(self, N: int, blacklist: List[int]):
        write_len = N - len(blacklist)
        self.write_len = write_len
        w = set([ii for ii in range(write_len, N)])
        for ii in blacklist:
            if ii >= write_len:
                w.remove(ii)
        w = list(w)
        idx = 0
        self.write_map = {}
        for ii in blacklist:
            if ii < write_len:
                self.write_map[ii] = w[idx]
                idx += 1

    def pick(self) -> int:
        k = random.randint(0, self.write_len - 1)
        return self.write_map.get(k, k)
```

## 匹配问题

### 匈牙利算法

#### [LeetCode 5825. 最大兼容性评分和](https://leetcode-cn.com/problems/maximum-compatibility-score-sum/)

> M 个老师，M 个学生分别对 N 门课进行打分，定义打分相兼容性评分，同个数为求老师和学生最大兼容性评分的匹配

先构建 Match 矩阵，然后用 linear_sum_assignment 实现匈牙利算法

（需要注意 linear_sum_assignment 为最小匹配

```python
from scipy.optimize import linear_sum_assignment
class Solution:
    def maxCompatibilitySum(self, students: List[List[int]], mentors: List[List[int]]) -> int:
        N, M = len(students[0]), len(students)
        match = [[0] * M for _ in range(M)]
        for ii, student in enumerate(students):
            for jj, teahcher in enumerate(mentors):
                score = 0
                for k, v in zip(student, teahcher):
                    if k == v:
                        score += 1
                match[ii][jj] = score
        r, c = linear_sum_assignment([[N - match[ii][jj] for jj in range(M)] for ii in range(M)])
        return sum([match[ii][jj] for ii, jj in zip(r, c)])
```
