#!/usr/bin/env bash

yarn

sudo yarn run docs:build

if [ ! -d "/usr/local/www/assets" ];then
echo "文件不存在"
else
rm -rf /usr/local/www/assets
fi

if [ ! -d "/usr/local/www/javaScript" ];then
echo "文件不存在"
else
rm -rf /usr/local/www/javaScript
fi

if [ ! -d "/usr/local/www/other" ];then
echo "文件不存在"
else
rm -rf /usr/local/www/other
fi

if [ ! -d "/usr/local/www/pat" ];then
echo "文件不存在"
else
rm -rf /usr/local/www/pat
fi

for htmlfile in docs/.vuepress/dist/*/*.html docs/.vuepress/dist/index.html
do
    sed -i '/<head>/a\<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/docsearch.js@2/dist/cdn/docsearch.min.css" />' $htmlfile
    sed -i '/<head>/a\<link rel="shortcut icon" href="https://cdn.nlark.com/yuque/0/2018/png/104214/1534957905839-d580e42e-3899-4403-be32-c068e5c9eef4.png">' $htmlfile
    sed -i '/<head>/a\<meta name="google-site-verification" content="7ULbF13p7e6Z16vpi2tbAPHXHJBVu83TaxPTnvwnA8I" />' $htmlfile
    sed -i '/<head>/a\<script async src="https://www.googletagmanager.com/gtag/js?id=UA-113936890-1"></script><script>window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'UA-113936890-1');</script>' $htmlfile
    sed -i '/<body>/a\<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-WJK56VN"height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>' $htmlfile
    sed -i '/<body>/a\<script type="text/javascript"> docsearch({ apiKey: 'c42b71d494ca78750c7094eb2c55eda6', indexName: 'wyydsb', inputSelector: '', debug: false }); </script> ' $htmlfile
    sed -i '/<body>/a\<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/docsearch.js@2/dist/cdn/docsearch.min.js"></script>' $htmlfile
done

mv docs/.vuepress/dist/* /usr/local/www/

