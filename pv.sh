# pv

loglocal=/usr/local/nginx/logs/access.log
echo '<center>累计访问量:' > log/pv
awk '{if($9==200)print $0}' $loglocal|awk '{print $1}'|sort | uniq -c |wc -l >> log/pv
echo '| 昨日访问量:' >> log/pv
yMonth=`date -d yesterday +%B`
month=`date +%B`
awk '{if($9==200)print $0}' $loglocal|sed -n "/$(date -d yesterday +%d)\/${yMonth:0:3}\/$(date -d yesterday +%Y)/,/$(date -d yesterday +%d)\/${yMonth:0:3}\/$(date -d yesterday +%Y)/p"| awk '{print $1}' | sort | uniq -c | wc -l >> log/pv
echo '</center>' >> log/pv
sed -i '$d' docs/README.md
echo $(cat log/pv) >> docs/README.md
bash build.sh

# time total Pv
date +%Y%m%d%T > log/time
awk '{if($9==200)print $0}' $loglocal|awk '{print $1}'|sort | uniq -c |wc -l >> log/time
echo $(cat log/time) >> log/total
