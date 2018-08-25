
# 目录约定

TAISHAN-fe 采用如下 目录 约定

```bash
.
├── _tests/                        // 单测 文件
├── coverage/                      // 单测覆盖率 生成目录
├── dist/                          // build 输出目录
├── docs/                          // 文档
  ├── .vuepress                    // 样式
        ├── cofig.js               // 主页、sider、Header 设置
        ├── dist                   // 文档 build 输出目录
        └── override.styl          // 样式 style
├── mock/                          // mock 实现
└── src/                           // 源码目录，可选
    ├── component                  // 外部组件(主要是AntD Pro 及 部分 轻封装组件)
    ├── layout                     // 全局布局 & 进场动画 & 全局样式
    ├── models                     // dva models 相当于 redux 的 action + saga + reduce
    ├── pages                      // 页面目录，里面的文件即路由
        ├── .umi/                  // dev 临时目录，需添加到 .gitignore
        ├── document.ejs           // HTML 模板
        ├── page1                  // 页面s 1
          ├── component            // 页面 1 实现
          ├── daytime.js/index.js     // 页面 1 路由规定 /page1/page # /page1
        ├── page2                  // 页面s 2
    ├── services                   // http 请求实现层 处理 header头  
    ├── utils                      // constant BaseAPi request函数封装 通用函数约定
    ├── global.css                 // 全局样式文件
├── .editorconfig                  // js代码风格说明
├── .eslintrc                      // eslint配置   
├── .gitlab-ci.yml                 // gitlab-ci
├── .gitignore                      
├── .umirc.js                      // umi 配置 # 不被路由配置 loading配置
├── .umirc.mock.js                 // mock 配置
├── .webpackrc.js                  // webpack 配置
├── favicon.icon                   // 网站 favicon
├── jest.config.js                 // jest 单测配置
├── package.json                    
└── yarn.lock                      // yarn 包管理目录 需要上传到git
```
