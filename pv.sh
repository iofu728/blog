# pv
echo '<center>累计访问量:' > pv
awk '{print $1}' /var/log/nginx/access.log|sort | uniq -c |wc -l >> pv
echo '| 昨日访问量:' >> pv
yMonth=`date -d yesterday +%B`
month=`date +%B`
sed -n "/$(date -d yesterday +%d)\/${yMonth:0:3}\/$(date -d yesterday +%Y):00/,/$(date +%d)\/${month:0:3}\/$(date +%Y):00/p" /var/log/nginx/access.log | awk '{print $1}' | sort | uniq -c | wc -l >> pv
echo '</center>' >> pv
sed -i '$d' docs/README.md
echo $(cat pv) >> docs/README.md
bash build.sh

# time total Pv
date +%Y%m%d%T > time
awk '{print $1}' /var/log/nginx/access.log|sort | uniq -c |wc -l >> time
echo $(cat time) >> total
