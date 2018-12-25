---
title: numpy 📒笔记
date: 2018-12-19 16:40:50
tags: [Python]
description: numpy
---

> 作为ML任务的一个 很重要 的任务, `数据处理`是十分重要的一环
而numpy向量运算方面 做了 很多优化
so 我们需要熟练掌握numpy的使用
需要提的是 numpy开数组 内存开销很大
numpy存一个`int32`需要`96byte` **96byte** **96byte**
int32只要4byte 这24倍
我在处理一个1G的数据的时候，用list开只要1G左右 用np内存飙到110G+ 直接打停了
所以在大数据量的处理中 numpy还是值得商榷的一个工具
但熟练掌握np是必不可少的 故参考nump-100做了一个整理

This is a note for [numpy-100](https://github.com/rougier/numpy-100/blob/master/100_Numpy_exercises.md)

```python
1. np.add.reduce() > np.sum()
     * np.sum(Z) # 调用np.add.reduce()实现
     * np.add.reduce(Z) # 在reshape的时候会产生一个数组
     * np.logical_and.reduce(arr3[:, :-1]<arr3[:,1:], axis=1) # 逻辑与
     * np.add.accumulate(Z) # reduce by processing
     = np.sumsum(Z)
     * np.add.reduceat(Z, np.array([1,4])) # print sum(1-3) sum(4-end)
     * np.add.outer(Z, Y) # Z+Y 以Z为基础
     * np.frompyfunc(add_elements, 2,1) # 构造自定义
2. Z[::-1]
     * Z[1::2,::2]
3. np.nonzero([1,2,0,0,4,0])
4. 矩阵扩展
     * np.pad(Z, pad_width=1, mode='constant', constant_values=0)
     * np.pad(Z, pad_width=2, mode='edge')
     * np.pad(Z, pad_width=2, mode='linear_ramp')
     * np.pad(Z, pad_width=2, mode='maximum')
     * np.pad(Z, pad_width=2, mode='middle')
     * np.pad(Z, pad_width=2, mode='reflect')
     * np.pad(Z, pad_width=2, mode='symmetric')
     * np.pad(Z, pad_width=2, mode='wrap')
5. np.nan np.inf
6. np.diag(1+np.arange(4),k=-1)
   * np.diag(np.random.random((4,4)))
7. np.unravel_index(99,(6,7,8)) # find index in shape(6,7,8)
8. 重复
   * np.tile(np.array([[0,1],[1,0]]), (4,4))
   * Z.repeat(3，axis=1)
9. (Z - np.mean (Z)) / (np.std (Z))
    * np.random.uniform(-10,+10,10)
10. np.ubyte
11. np.array(0) // np.array(0)
     * np.array(0) / np.array(0)
12. 取整
     * np.copysign(np.ceil(np.abs(Z)), Z)
     * np.floor() = Z - Z%1
     * np.ceil()
     * np.trunc()
     * Z.astype(int)
13. def generate():
     for x in range(10):
         yield x
Z = np.fromiter(generate(),dtype=float,count=-1)

14. np.linspace(0,1,11,endpoint=False)
15. equal
     * np.array_equal(A, B)
     * np.allclose(1e-8,1e-9)
     * np.allclose(A,B) # tolerance
16. Z.flags.writeable = False
17. Z.argmax()
18. Z['x'], Z['y'] = np.meshgrid(np.linspace(0,1,5),
                                 np.linspace(0,1,5))
     * Z['X'] # 横向uniform Z['y']纵向uniform
19. Array的合并
     * np.concatenate([arr1,arr2], axis=0)
     = np.vstack((arr1,arr2))
     = np.row_stack((arr1,arr2))
     = np.r_[arr1, arr2]
     * np.concatenate([arr1,arr2], axis=1)
     = np.hstack((arr1,arr2))
     = np.column_stack((arr1,arr2))
     = np.c_[arr1, arr2]
     * np.concatenate([arr1,arr2], axis=2) # 如果没有第三维度的时候报错
     = np.dstack((arr1,arr2))              # No Error
20. Array 拆分
     * np.split(arr3, [1,3],axis=0)
     = np.vsplit(arr3, [1,3])
     * np.split(arr3, [1,3],axis=1)
     = np.hsplit(arr3, [1,3])
     * np.split(arr3, [1,3],axis=2)
     = np.dsplit(arr3, [1,3])
     * np.setdiff1d(A, B, assume_unique=True)# 差集
21. np.take(arr,indexs)
22. arr_3d = arr[:, np.newaxis, :] # 拓展维数
23. sort
     * np.sort(Z)
     * np.argsort(Z)
     * np.lexsort(Z)
     * np.argsort(Z, kind='mergesort',order='index')
     * np.argsort(Z, kind='quicksort')
     * np.argsort(Z, kind='heapsort')
     * np.searchsort(Z, v)
     * np.partition(list,3) # 3 is the index of wait partition number
     * sort(Z)
24. np.linalg.det(C) # 行列式值
25. np.set_printoptions(threshold=np.nan) # Array不省略
26. np.atleast_1d(arr) np.atleast_2d(arr) np.atleast_3d(arr) # 拓宽n维
27. np.genfromtxt(s, delimiter=",", dtype=np.int) # get data from file
28. np.ndenumerate()
29. (~Z.any(axis=0)).any() # 检测是否有null
30. 降维
      * Z.flatten()        # 降维 Z.flatten('F')列
      * Z.flat[index]      # 返回降维后第index个元素
      * np.ravel(Z)        # np.ravel(Z, order='F')
      * np.resize(Z,(2,4)) # 重组
      * np.reshape((2,4))  # 重组
31. 按索引叠加
      * np.bincount(I, minlength=len(Z)) # 按值计数
      * np.add.at(Z,I,1)
      * np.bincount(I, X) # 以I为基 统计count
32.diagonal of dot
      * np.diag(A @ B)              # slow
      = np.sum(A * B.T, axis=1)     # fast
      = np.einsum("ij,ji->i", A, B) # fastest
      * np.einsum('i->', a)         # sum
      * np.einsum('i, i->i', a, b)  # 对应乘 Hadamard
      * np.einsum('i, i', a, b)     # 内积 np.inner(a, b)
      * np.einsum('i, j->ij', a, b) # 外积 np.outer(a, b)
      * np.einsum('ji', A)          # 转置
      * np.einsum('ii->i', A)       # np.diag(A)
      * np.einsum('ii', A)          # np.trace(A)
      * np.einsum('ij->', A)        # np.sum(A)
      * np.einsum('ij->j', A)       # np.sum(A, axis=0)
      * np.einsum('ij->i', A)       # np.sum(A, axis=1)
      * np.einsum('ij, ij->ij', A, B)# A*B
      * np.einsum('ij, ji->ij', A, B)# A*B.T
      * np.einsum('ij, jk', A, B)   # np.dot(A, B)
      * np.einsum('ij, ij', A, B)   # 内积
33. A[[0,1]] = A[[1,0]]             # 交换两行
34. Z0 = np.zeros(len(Z) + (len(Z)-1)*(nz))
    Z0[::nz+1] = Z                  # 插入0
35. np.repeat(np.arange(len(C)), C) # 与np.bincount(A)互逆
36. np.roll(faces.repeat(2,axis=1),-1,axis=1) # 滚动-1
37. np.logical_not(Z, out=Z)        # Boolean 取反
    np.negative(Z, out=Z)           # 符号反
38. poiner to line distance
def distance(P0, P1, p):
    T = P1 - P0
    L = (T**2).sum(axis=1)
    U = -((P0[:,0]-p[...,0])*T[:,0] + (P0[:,1]-p[...,1])*T[:,1]) / L
    U = U.reshape(len(U),1)
    D = P0 + U*T - p
    return np.sqrt((D**2).sum(axis=1))
39.秩
U, S, V = np.linalg.svd(Z)
rank = np.sum(S > 1e-10)
40. Z.strides # 跨度 在某个维度上获得下一个值所需要跨过的字节
41. n largest
      * Z[np.argsort(Z)[-n:]]        # slow
      * Z[np.argpartition(-Z,n)[:n]] # fast
42. 笛卡尔积
def cartesian(arrays):
    arrays = [np.asarray(a) for a in arrays]
    shape = (len(x) for x in arrays)

    ix = np.indices(shape, dtype=int)
    ix = ix.reshape(len(arrays), -1).T

    for n, arr in enumerate(arrays):
        ix[:, n] = arrays[n][ix[:, n]]

    return ix
43. np.unpackbits(Z, axis=1)          # 转成2进制
44. np.interp(a, A, B)                # 插值
```
