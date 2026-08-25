<p align="center"><a href="https://wyydsb.xin" target="_blank" rel="noopener noreferrer"><img width="100" src="https://cdn.nlark.com/yuque/0/2018/png/104214/1534957905839-d580e42e-3899-4403-be32-c068e5c9eef4.png" alt="Wyydsb logo"></a></p>
<h1 align="center">乌云压顶是吧</h1>

[![GitHub](https://img.shields.io/github/license/iofu728/blog.svg?style=popout-square)](https://github.com/iofu728/blog//master/LICENSE)
[![GitHub tag](https://img.shields.io/github/tag/iofu728/blog.svg?style=popout-square)](https://github.com/iofu728/blog/releases)
[![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/iofu728/blog.svg?style=popout-square)](https://github.com/iofu728/blog)

> 很高兴不认识你

<div align="center">
  <strong>
     基于 <a href="https://vitepress.dev/">VitePress</a> 构建的blog: https://wyydsb.xin
  </strong>
</div>

## New Features 🧸

The theme base on [vuepress-theme-indigo](https://github.com/yscoder/vuepress-theme-indigo)

- Support MathJax in markdown environments.
- Generate BibTeX in each blog.
- Support multi-level tags.
- Support redirect link in 404 page.

## 开发指南

[Latest release 👉 ](https://github.com/iofu728/blog/releases)

```bash
# Dev
$ cd blog-v2
$ npm install
$ npm run dev

# Build(产物在 blog-v2/.vitepress/dist/)
$ npm run build
```

## 结构

```bash
.
├── blog-v2           # VitePress 站点(主题、构建、验收脚本)
│   ├── .vitepress
│   │   ├── theme     # Vue 3 主题
│   │   └── config.js
│   └── visual-diff   # 新旧站截图对比/性能评测脚本
├── docs              # markdown 文章源(blog-v2 的 srcDir)
├── pv-api            # PV 接口(Vercel serverless + Upstash Redis)
└── log               # 历史访问日志(已归档)
```

PS: 有一部分更新脚本放在[iofu728/spider-press](https://github.com/iofu728/spider-press)
