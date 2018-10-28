#!/usr/bin/env bash

# pv
loglocal=/usr/local/nginx/logs/access.log
echo "<center>累计访问量:" > log/pv
awk '{if($9==200&&$7~/\/assets\/js\/app/&&$0!~/bot/&&$0!~/spider/&&$0!~/php/&&$0!~/taishan/&&$6~/GET/&&$0!~/Verification/&&$0!~/"-" "-"/&&$0!~/[gG]o/&&$0!~/[pP]ython/&&$0!~/curl/){print $0}}' $loglocal|sort | uniq -c | wc -l >> log/pv
echo "| 昨日访问量:" >> log/pv
cat log/yesterday | tail -n +2 | head -n 1 >> log/pv
echo "| 昨日爬虫数:" >> log/pv
cat log/yesterday | tail -n +3 | head -n 1 >> log/pv
echo "</center>" >> log/pv
sed -i '$d' docs/README.md
echo $(cat log/pv) >> docs/README.md
insertword=$(echo $(cat log/pv))
pattern=\<center\>累.*\<\/center\>
sed -i -e s@$pattern@$insertword@g ../../index.html

# time total pv
hour=`date +%T`
if [ ${hour:4:1} -eq 0 ] && [${hour:6:1} -eq 0]
then
    date +%Y/%m/%d:%T > log/time
    cat log/pv | tail -n +2 | head -n 1 >> log/time
    awk 'NR==FNR {a[$2]=$0} NR!=FNR {if(FNR>1&&!($1 in a)&&($9!=200||$0~/bot/||$0~/spider/||$0~/php/||$0~/taishan/||$6!~/GET/||$0~/Verification/||$0~/"-" "-"/||$0~/[gG]o/||$0~/[pP]ython/||$0~/curl/))print $0}' log/user $loglocal|sort | uniq -c | wc -l >> log/time
    echo $(cat log/time) >> log/total
fi