date -d yesterday +%Y%m%d%T > yesterday
yMonth=`date -d yesterday +%B`
month=`date +%B`
sed -n "/$(date -d yesterday +%d)\/${yMonth:0:3}\/$(date -d yesterday +%Y):00/,/$(date +%d)\/${month:0:3}\/$(date +%Y):00/p" /usr/local/nginx/logs/access.log | awk '{print $1}' | sort | uniq -c | wc -l >> yesterday
echo $(cat yesterday) >> day
