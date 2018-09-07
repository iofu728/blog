---
pageClass: custom-page-class
---

# 目录约定

TAISHAN-fe 采用如下 目录 约定

```bash

.
├── _tests_                        // 单测 文件
├── coverage/                      // 单测覆盖率 生成目录
├── docs                           // 文档
│   ├── .vuepress                  // 样式
│   │   ├── cofig.js               // 主页、sider、Header 设置
│   │   ├── dist                   // 文档 build 输出目录
│   │   └── override.styl          // 样式 style
├── src                            // 源码目录
│   ├── component                  // 外部组件(主要是AntD Pro 及 部分 轻封装组件)
│   ├── global.css                 // 全局样式文件
│   ├── layouts                    // 全局布局 & 进场动画 & 全局样式
│   │   ├── Header.js
│   │   ├── PageLoadingComponent.js
│   │   ├── Sider.js
│   │   ├── index.css
│   │   └── index.js
│   ├── models                     // dva models 相当于 redux 的 action + saga + reduce
│   ├── pages                      // 页面目录，里面的文件即路由
│   │   ├── .umi                   // dev 临时目录，需添加到 .gitignore
│   │   ├── document.ejs           // HTML 模板
│   │   ├── page1                  // 页面组1
│   │   │   ├── components         // 页面 1 实现
│   │   │   │   ├── page1.css
│   │   │   │   ├── Modal1.js
│   │   │   │   ├── Container1.js
│   │   │   │   ├── Modal2.js
│   │   │   │   ├── Container2.js
│   │   │   │   └── Modal3.js
│   │   │   ├── $listId.js
│   │   │   ├── index.js
│   │   │   ├── report.js
│   │   │   └── list.js
│   ├── services                   // http 请求实现层 处理 header头
│   └── utils                      // constant BaseAPi request函数封装 通用函数约定
│       ├── baseApi.js
│       ├── constant.js
│       ├── ipconfig.js
│       ├── ipconfig.js.tmp
│       ├── request.js
│       └── utils.js
├── .editorconfig                  // js代码风格说明
├── .eslintrc                      // eslint配置
├── .gitlab-ci.yml                 // gitlab-ci
├── .gitignore
├── .umirc.js                      // umi 配置 # 不被路由配置 loading配置
├── .umirc.mock.js                 // mock 配置
├── .webpackrc.js                  // webpack 配置
├── ADELE.ttf                      // 字体
├── README.md                      // README
├── build.sh                       // 构建脚本
├── docs.sh                        // 文档部署脚本
├── favicon.ico                    // favicon
├── jest.config.js                 // 单测配置
├── package.json                   // package
└── yarn.lock                      // yarn 包管理目录
```
