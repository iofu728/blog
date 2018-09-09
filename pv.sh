echo '<center>累计访问量:' > pv
awk '{print $1}' /usr/local/nginx/logs/access.log|sort | uniq -c |wc -l >> pv
echo '| 昨日访问量:' >> pv
yMonth=`date -d yesterday +%B`
month=`date +%B`
sed -n "/$(date -d yesterday +%d)\/${yMonth:0:3}\/$(date -d yesterday +%Y):00/,/$(date +%d)\/${month:0:3}\/$(date +%Y):00/p" /usr/local/nginx/logs/access.log | awk '{print $1}' | sort | uniq -c | wc -l >> pv
echo '</center>' >> pv
sed -i '$d' /usr/local/var/www/wyydsb/blog/docs/README.md
echo $(cat pv) >> /usr/local/var/www/wyydsb/blog/docs/README.md
bash /usr/local/var/www/wyydsb/blog/build.sh
