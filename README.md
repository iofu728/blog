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

## New Features 🧸

The vuepress theme base on [vuepress-theme-indigo](https://github.com/yscoder/vuepress-theme-indigo)

- Support MathJax in markdown environments.
- Generate BibTeX in each blog.
- Support multi-level tags.
- Support redirect link in 404 page.

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
