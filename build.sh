
yarn

sudo yarn run docs:build

if [ ! -d "/usr/local/var/www/assets" ];then
echo "文件不存在"
else
rm -rf /usr/local/var/www/assets
fi

if [ ! -d "/usr/local/var/www/javaScript" ];then
echo "文件不存在"
else
rm -rf /usr/local/var/www/javaScript
fi

if [ ! -d "/usr/local/var/www/other" ];then
echo "文件不存在"
else
rm -rf /usr/local/var/www/other
fi

if [ ! -d "/usr/local/var/www/pat" ];then
echo "文件不存在"
else
rm -rf /usr/local/var/www/pat
fi

sed -i '/<head>/a\<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/docsearch.js@2/dist/cdn/docsearch.min.css" />' docs/.vuepress/dist/index.html
sed -i '/<head>/a\<link rel="shortcut icon" href="https://cdn.nlark.com/yuque/0/2018/png/104214/1534957905839-d580e42e-3899-4403-be32-c068e5c9eef4.png">' docs/.vuepress/dist/index.html
sed -i '/<body>/a\<script type="text/javascript"> docsearch({ apiKey: 'c42b71d494ca78750c7094eb2c55eda6', indexName: 'wyydsb', inputSelector: '###REPLACEME####', debug: false }); </script>' docs/.vuepress/dist/index.html
sed -i '/<body>/a\<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/docsearch.js@2/dist/cdn/docsearch.min.js"></script>' docs/.vuepress/dist/index.html

mv docs/.vuepress/dist/* /usr/local/var/www/

