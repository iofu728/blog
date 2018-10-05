#!/usr/bin/env bash
# pv

loglocal=/usr/local/nginx/logs/access.log
echo "<center>累计访问量:" > log/pv
awk '{if($9==200)print $1}' $loglocal|sort | uniq -c |wc -l >> log/pv
echo "| 昨日访问量:" >> log/pv
yMonth=`date -d yesterday +%B`
today="$(date -d yesterday +%d)/${yMonth:0:3}/$(date -d yesterday +%Y)"
am="$today:00:00:00"
pm="$today:23:59:59"
awk '{if($9==200){split($4,array,"[");if(array[2]>=am && array[2]<=pm){print $1}}}' am="$am" pm="$pm" $loglocal|sort | uniq -c | wc -l >> log/pv
echo "| 昨日爬虫数:" >> log/pv
awk '{if($9!=200){split($4,array,"[");if(array[2]>=am && array[2]<=pm){print $1}}}' am="$am" pm="$pm" $loglocal|sort | uniq -c | wc -l >> log/pv
echo "</center>" >> log/pv
sed -i '$d' docs/README.md
echo $(cat log/pv) >> docs/README.md
bash script/build.sh

# time total Pv
date +%Y/%m/%d:%T > log/time
awk '{if($9==200)print $1}' $loglocal|sort | uniq -c |wc -l >> log/time
awk '{if($9!=200)print $1}' $loglocal|sort | uniq -c |wc -l >> log/time
echo $(cat log/time) >> log/total
