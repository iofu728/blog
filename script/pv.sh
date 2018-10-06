#!/usr/bin/env bash
# pv

loglocal=/usr/local/nginx/logs/access.log
echo "<center>累计访问量:" > log/pv
awk '{if($9==200)print $1}' $loglocal|sort | uniq -c |wc -l >> log/pv
echo "| 昨日访问量:" >> log/pv
cat log/yesterday | tail -n +2 | head -n 1 >> log/pv
echo "| 昨日爬虫数:" >> log/pv
cat log/yesterday | tail -n +3 | head -n 1 >> log/pv
echo "</center>" >> log/pv
sed -i '$d' docs/README.md
echo $(cat log/pv) >> docs/README.md
bash script/build.sh

# time total Pv
date +%Y/%m/%d:%T > log/time
cat log/pv | tail -n +2 | head -n 1 >> log/time
awk '{if($9!=200)print $1}' $loglocal|sort | uniq -c |wc -l >> log/time
echo $(cat log/time) >> log/total
