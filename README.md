<p align="center"><a href="https://wyydsb.xin" target="_blank" rel="noopener noreferrer"><img width="100" src="https://cdn.nlark.com/yuque/0/2018/png/104214/1534957905839-d580e42e-3899-4403-be32-c068e5c9eef4.png" alt="Wyydsb logo"></a></p>
<h1 align="center">乌云压顶是吧</h1>

[![GitHub](https://img.shields.io/github/license/iofu728/blog.svg?style=popout-square)](https://github.com/iofu728/blog//master/LICENSE)
[![GitHub tag](https://img.shields.io/github/tag/iofu728/blog.svg?style=popout-square)](https://github.com/iofu728/blog/releases)
[![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/iofu728/blog.svg?style=popout-square)](https://github.com/iofu728/blog)

> 很高兴不认识你

<div align="center">
  <strong>
     基于 <a href="https://vuepress.vuejs.org/">VuePress</a> 构建的blog: https://wyydsb.xin
  </strong>
</div>


## 二次开发
* 实时显示访问量
* 自定义主题 `Gothic` style
* 支持Gitalk评论
* 支持自动处理、并更新访问量
* 支持MapReduce分布式处理大数据量log
* 支持log自动备份 :-1:prepare change to HDFS
* 支持Docker部署
* 支持的不是很好的公式显示-Katex语法
* 支持markdown-it-emoji 8-)
* 支持Google Analysis，Algolia等<script/>自动部署
* 参考[`Nginx 调优`](https://wyydsb.xin/other/nginx.html), [`从日志中识别 Spider`](https://wyydsb.xin/other/spider.html) 进行反爬处理

## 开发指南

[Latest release 👉 ](https://github.com/iofu728/blog/releases)

```bash
$ git clone https://github.com/iofu728/blog.git
$ cd blog
$ yarn
$ yarn doc:dev
```

## 部署指南
```bash
.
├── script                         // 脚本
│   ├── backup.sh                  // 备份脚本
│   ├── build.sh                   // 部署脚本
│   ├── day.sh                     // 每日数据采集脚本
│   ├── KPI.java                   // MapReduce prepare.java
│   ├── PersonVersion.java         // MapReduce Map&Reduce.java
└── └── pv.sh                      // pv计算及更新脚本
```



