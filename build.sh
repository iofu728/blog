
yarn

if [ ! -d "/usr/local/var/www/assets" ];then
echo "文件不存在"
else
rm -rf /usr/local/var/www/assets
fi

if [ ! -d "/usr/local/var/www/react" ];then
echo "文件不存在"
else
rm -rf /usr/local/var/www/react
fi

if [ ! -d "/usr/local/var/www/summary" ];then
echo "文件不存在"
else
rm -rf /usr/local/var/www/summary
fi

if [ ! -d "/usr/local/var/www/pdd" ];then
echo "文件不存在"
else
rm -rf /usr/local/var/www/pdd
fi

mv docs/.vuepress/dist/* /usr/local/var/www/

# <link rel="shortcut icon" href="https://cdn.nlark.com/yuque/0/2018/png/104214/1534957905839-d580e42e-3899-4403-be32-c068e5c9eef4.png">
# <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/docsearch.js@2/dist/cdn/docsearch.min.css" />
