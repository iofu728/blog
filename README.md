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
* 4.0版本基于[vuepress-theme-indigo](https://github.com/yscoder/vuepress-theme-indigo)
* 支持[Now 2.0](https://zeit.co)部署(v4.3.2)
* 支持生产环境Docker部署(v4.3.1)
* 实时显示访问量 + 文章阅读量(配合backend, v4.3)
* img zoom(v4.2)
* 资瓷Tags(v4.0)
* 天粒度增量Load数据 数据处理由全量改为增量 减小内存CPU占用率(v3.0)
* 自定义主题 `Gothic` Style + Card Style(v2.7)
* 支持Gitalk评论(v2.0)
* 支持自动处理、并更新访问量(v1.0)
* 支持MapReduce分布式处理大数据量log
* 支持log自动备份 :-1:prepare change to HDFS
* 支持的不是很好的公式显示-Katex语法
* 支持markdown-it-emoji 8-)
* 支持Google Analysis，Algolia等<script/>自动部署
* 参考[`Nginx 调优`](https://wyydsb.xin/other/nginx.html), [`从日志中识别 Spider`](https://wyydsb.xin/other/spider.html) 进行反爬处理

## 开发指南

[Latest release 👉 ](https://github.com/iofu728/blog/releases)

```bash
# Dev
$ wget https://github.com/iofu728/blog/archive/v4.3.2.tar.gz
$ tar -zxvf v4.3.2.tar.gz
$ cd blog-4.3.2
$ yarn
$ yarn doc:dev

# Deploy
$ vim script/constant.sh  #Change Service Path
$ bash script/
```

### Docker

```bash
$ docker pull iofu728/blog:v4.3.2
$ docker pull iofu728/blog:backend-v4.3.2
```

### Backend
```bash
# mysql config
$ cp blog-backend/blog-repository/src/main/resources/application.yml.temple blog-backend/blog-repository/src/main/resources/application.yml

# gradle build
$ cd blog-backend
$ ./gradlew clean build -x test
$ nohup java -jar blog-collector/build/libs/blog-collector-4.3.0-SNAPSHOT.jar >> test.txt 2>&1 &
```

## 部署指南
```bash
.
├── README.md
├── blog-backend
│   ├── blog-collector
│   │   └── src
│   │       ├── main
│   │       │   ├── java
│   │       │   │   └── com.github.iofu728.blog.collector
│   │       │   │       ├── BlogCollectorApplicationContext.java
│   │       │   │       ├── bo
│   │       │   │       ├── collector
│   │       │   │       ├── consts
│   │       │   │       ├── filter
│   │       │   │       └── service
│   │       │   └── resources
│   │       └── test
│   ├── blog-repository
│   │   └── src
│   │       ├── main
│   │       │   ├── java
│   │       │   │   └── com.github.iofu728.blog.repository
│   │       │   │       ├── BlogRepositoryApplicationContext.java
│   │       │   │       ├── dataSource
│   │       │   │       ├── entity
│   │       │   │       ├── enums
│   │       │   │       ├── mapper
│   │       │   │       └── repository
│   │       │   └── resources
│   ├── build.gradle
│   ├── gradle.properties
│   ├── gradlew
│   ├── gradlew.bat
│   └── settings.gradle
├── script
│   ├── KPI.java                   // MapReduce prepare.java
│   ├── PersonVersion.java         // MapReduce Map&Reduce.java
│   ├── backup.sh                  // backup shell
│   ├── build.sh                   // build shell
│   ├── constant.sh                // Services Path *important 需设置(Need Set when you deploy)
│   ├── crontable.sh               // 每分钟调用pv.sh设置
│   ├── day.sh                     // 每日数据采集脚本  天粒度
└── └── pv.sh                      // pv计算及更新脚本 5s粒度
```

PS: 有一部分更新脚本放在[iofu728/spider-press](https://github.com/iofu728/spider-press)
