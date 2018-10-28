#!/usr/bin/env bash

loglocal=/usr/local/nginx/logs/access.log
awk '{if($9==200&&/\/assets\/js\/app/&&$0!~/bot/&&$0!~/spider/&&$0!~/php/&&$0!~/taishan/&&$0!~/POST/&&$0!~/Verification/&&$0!~/"-" "-"/&&$0!~/Python/&&$0!~/go/&&$0!~/Go/&&$0!~/python/&&$0!~/curl/){print $1}}' $loglocal|sort | uniq -c | sort -nr >> log/userpre
awk '{if($1>5)print $0}' log/userpre >> log/user
date -d yesterday +%Y%m%d > log/yesterday
yMonth=`date -d yesterday +%B`
today="$(date -d yesterday +%d)/${yMonth:0:3}/$(date -d yesterday +%Y)"
am="$today:00:00:00"
pm="$today:23:59:59"
awk '{if($9==200&&/\/assets\/js\/\app/&&$0!~/bot/&&$0!~/spider/&&$0!~/php/&&$0!~/taishan/&&$0!~/POST/&&$0!~/Verification/&&$0!~/"-" "-"/&&$0!~/Python/&&$0!~/go/&&$0!~/Go/&&$0!~/python/&&$0!~/curl/){split($4,array,"[");if(array[2]>=am && array[2]<=pm){print $1}}}' am="$am" pm="$pm" $loglocal|sort | uniq -c | wc -l >> log/yesterday
awk 'NR==FNR {a[$2]=$0} NR!=FNR {if(FNR>1&&!($1 in a)&&($9!=200||$0~/bot/||$0~/spider/||$0~/php/||$0~/taishan/||$0~/POST/||$0~/Verification/||$0~/"-" "-"/||$0~/Python/||$0~/go/||$0~/Go/||$0~/python/||$0~/curl/)){split($4,array,"[");if(array[2]>=am && array[2]<=pm){print $0}}}' am="$am" pm="$pm" log/user $loglocal|sort | uniq -c | wc -l >> log/yesterday
echo $(cat log/yesterday) >> log/day

# first=20180820
# second=20180929
# loglocal=/usr/local/nginx/logs/access.log
# awk '{if($9==200&&/\/assets\/js\/app/&&$0!~/bot/&&$0!~/spider/&&$0!~/php/&&$0!~/taishan/&&$0!~/POST/&&$0!~/Verification/&&$0!~/"-" "-"/&&$0!~/Python/&&$0!~/go/&&$0!~/Go/&&$0!~/python/&&$0!~/curl/){print $1}}' $loglocal|sort | uniq -c | sort -nr >> log/userpre
# awk '{if($1>5)print $0}' log/userpre >> log/user

# while [ "$first" != "$second" ]
# do
# date -d "${first}" +%Y%m%d > log/yesterday
# yMonth=`date -d "${first}" +%B`
# today="$(date -d "${first}" +%d)/${yMonth:0:3}/$(date -d "${first}" +%Y)"
# am="$today:00:00:00"
# pm="$today:23:59:59"
# echo $am
# am="$today:00:00:00"
# pm="$today:23:59:59"
# awk '{if($9==200&&/\/assets\/js\/\app/&&$0!~/bot/&&$0!~/spider/&&$0!~/php/&&$0!~/taishan/&&$0!~/POST/&&$0!~/Verification/&&$0!~/"-" "-"/&&$0!~/Python/&&$0!~/go/&&$0!~/Go/&&$0!~/python/&&$0!~/curl/){split($4,array,"[");if(array[2]>=am && array[2]<=pm){print $1}}}' am="$am" pm="$pm" $loglocal|sort | uniq -c | wc -l >> log/yesterday
# awk 'NR==FNR {a[$2]=$0} NR!=FNR {if(FNR>1&&!($1 in a)&&($9!=200||$0~/bot/||$0~/spider/||$0~/php/||$0~/taishan/||$0~/POST/||$0~/Verification/||$0~/"-" "-"/||$0~/Python/||$0~/go/||$0~/Go/||$0~/python/||$0~/curl/)){split($4,array,"[");if(array[2]>=am && array[2]<=pm){print $0}}}' am="$am" pm="$pm" log/user $loglocal|sort | uniq -c | wc -l >> log/yesterday
# echo $(cat log/yesterday) >> log/day
# let first=`date -d "-1 days ago ${first}" +%Y%m%d`
# done

