---
title: 2018 PKU RW entrance
date: 2018-09-16 09:16:11
tags: [Coding]
description: PKU RW entrance
---

因为这场考试与是否需要选课基础编程课有关，之前还是很认真的准备了一下

结果才发现真的水

虽然之前从考试模式等 也可以猜的出来

选了一个 smth 的导师，不知道以后到底会怎么样

然后不知不觉的 PAT 达成 100 题成就 :100:

[[toc]]

## 1 连续和 20

考试之前出了点小插曲
一开始说用 ftp 上传文件的 突然又说用 u 盘，无奈只能回去拿转换器

### 大意

> 给出一个整数`N>=2`，输出满足连续和=N 的所有情况
>
> sample input:
> 15
> sample output:
> 1 2 3 4 5
> 4 5 6
> 7 8

### 思路

1. 先弄一个和矩阵;
2. two pointer 遍历；

### code

```cpp
/*
 * @Author: gunjianpan
 * @Date:   2018-09-16 13:29:40
 * @Last Modified by:   gunjianpan
 * @Last Modified time: 2018-09-16 13:45:48
 */
#include <iostream>

using namespace std;

int main(int argc, char const *argv[]) {
  int n;
  cin >> n;
  int total[n], sum = 0, left = 0, right = 1;
  bool haveit = false;
  total[0] = 0;
  for (int i = 1; i < n; ++i) {
    sum += i;
    total[i] = sum;
  }
  for (int i = 0; i < n; ++i) {
    left = i;
    while (total[right] - total[left] < n && right < n - 1) ++right;
    while (total[right] - total[left] > n && right > left) --right;
    if (total[right] - total[left] == n) {
      haveit = true;
      for (int j = left + 1; j <= right; ++j) {
        if (j != left + 1) cout << ' ';
        cout << j;
      }
      cout << endl;
    }
  }
  if (!haveit) cout << "NONE";
  return 0;
}
```

## 2 全排列 20

### 大意

> 给一个不重复字符串，按字典序输出所有可能的排列组合
>
> sample input:
> abc
> sample output:
> abc acb bac bca cab cba

### 思路

1. 先`string` 存 字符串；
2. `sort(string)`；
3. 裸全排列;

### code

```cpp
/*
 * @Author: gunjianpan
 * @Date:   2018-09-16 13:49:07
 * @Last Modified by:   gunjianpan
 * @Last Modified time: 2018-09-16 13:58:58
 */
#include <algorithm>
#include <iostream>
#include <vector>

using namespace std;

bool vis[20] = {false};
int n, now = 0;
string pre;

void dfs(vector<int> v) {
  if (v.size() == n) {
    if (now++) cout << ' ';
    for (int i = 0; i < n; ++i) cout << pre[v[i]];
    return;
  }
  for (int i = 0; i < n; ++i) {
    if (!vis[i]) {
      vis[i] = true;
      v.push_back(i);
      dfs(v);
      vis[i] = false;
      v.pop_back();
    }
  }
}

int main(int argc, char const *argv[]) {
  cin >> pre;
  sort(pre.begin(), pre.end());
  n = pre.size();
  std::vector<int> v;
  dfs(v);
  return 0;
}
```

## 3 最大下降子序列 30

### 大意

> 给出一个数字串，求最大下降子序列
> sample input:
> 8
> 9 4 3 2 5 4 3 2
> sample output:
> 9 5 4 3 2

### 思路

1. `dp`问题；
2. `d[i] =`

- if (存在一个 index < i, 满足 `pre[index] > pre[i]`) 则找出 path 最大的 index， `d[i] = d[index] + 1`;
- else `d[i] = 1`;

3. 利用`vector<int> v[n]`存子串；

### code

```cpp
/*
 * @Author: gunjianpan
 * @Date:   2018-09-16 14:02:04
 * @Last Modified by:   gunjianpan
 * @Last Modified time: 2018-09-16 14:27:53
 */
#include <algorithm>
#include <iostream>
#include <vector>

using namespace std;

int main(int argc, char const *argv[]) {
  int n, maxlength = 1, maxindex = 0, index;
  cin >> n;
  int pre[n], d[n];
  std::vector<int> v[n];
  for (int i = 0; i < n; ++i) cin >> pre[i];
  fill(d, d + n, 0);
  d[0] = 1;
  v[0].push_back(pre[0]);
  for (int i = 1; i < n; ++i) {
    for (int j = i - 1; j >= 0; --j) {
      if (pre[j] > pre[i]) {
        if (v[j].size() + 1 > v[i].size()) {
          d[i] = d[j] + 1;
          v[i] = v[j];
          v[i].push_back(pre[i]);
          if (d[i] > maxlength) {
            maxlength = d[i];
            maxindex = i;
          }
        }
      }
    }
    if (!v[i].size()) {
      d[i] = 1;
      v[i].push_back(pre[i]);
    }
  }
  for (int i = 0; i < v[maxindex].size(); ++i) {
    if (i) cout << ' ';
    cout << v[maxindex][i];
  }

  return 0;
}
```

## 4 非递归实现中序 30

### 大意

> 给出 n 个节点，X(Y, num), X-当前节点 id, Y-父节点 id, num - 0 根节点，1 父节点的左子树, 2 父节点的右子树
> sample input:
> A(0,0) B(A,1) C(A,2) D(B,1) E(B,2) F(C,1) G(D,1) H(D,2)
> sample output:
> G D H B E A F C

### 思路

1. 这个字符串输入卡了 1h，尴尬

- 一开始用`scanf("%s(%s,%d) ", &now, &father, &num);`然后发现%s 要遇到空格才结束;
- 后来换成`cin >> str;` 对 str 进行`substr`处理;

2. 先建树`node`存`left,right`；
3. 然后用`stack`模拟递归进行`dfs`;
4. MAC 的 EOF 又忘记了,gg 记一下`<Ctrl + d>`；

### code

```cpp
/*
 * @Author: gunjianpan
 * @Date:   2018-09-16 14:33:37
 * @Last Modified by:   gunjianpan
 * @Last Modified time: 2018-09-16 16:03:06
 */
#include <iostream>
#include <map>
#include <stack>
#include <vector>

using namespace std;

struct node {
  int id, left, right;
};

vector<string> int2string;
map<string, int> string2int;
std::vector<node> v(11);
std::vector<int> middle;
bool vis[11] = {false};

int main(int argc, char const *argv[]) {
  string temp;
  int root = 0, index = 0, num, time = 9;
  while (cin >> temp) {
    int tempindex = 0;
    string now, father;
    while (tempindex < temp.size() && temp[tempindex] != '(') ++tempindex;
    now = temp.substr(0, tempindex);
    int nextindex = tempindex;
    while (nextindex < temp.size() && temp[nextindex] != ',') ++nextindex;
    father = temp.substr(tempindex + 1, nextindex - 2);
    num = temp[nextindex + 1] - '0';
    int2string.push_back(now);
    string2int[now] = index;
    if (!num) {
      root = index;
    } else if (num == 1) {
      v[string2int[father]].left = index;
    } else {
      v[string2int[father]].right = index;
    }
    v[index] = {index, -1, -1};
    ++index;
  }
  stack<node> s;
  s.push(v[root]);

  while (!s.empty()) {
    node front = s.top();
    vis[front.id] = true;
    if (front.left != -1) {
      if (!vis[front.left]) {
        s.push(v[front.left]);
        continue;
      } else {
        middle.push_back(front.id);
        s.pop();
        if (front.right != -1 && !vis[front.right]) {
          s.push(v[front.right]);
        }
        continue;
      }
    } else if (front.right == -1) {
      middle.push_back(front.id);
      s.pop();
      continue;
    } else {
      middle.push_back(front.id);
      s.pop();
      if (!vis[front.right]) {
        s.push(v[front.right]);
      }
      continue;
    }
  }
  for (int i = 0; i < middle.size(); ++i) {
    if (i) cout << ' ';
    cout << int2string[middle[i]];
  }
  return 0;
}
```
