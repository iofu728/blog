
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

mv docs/.vuepress/dist/* /usr/local/var/www/
