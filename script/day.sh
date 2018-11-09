#!/usr/bin/env bash

source script/constant.sh

# Load yestday Data
truncate -s 0 log/today
awk '{if($12!="\"Chrome/57\"")print $0}' $logpath >> log/today
cat log/today >> $backuppath
truncate -s 0 $logpath

# Build User File
truncate -s 0 log/user
awk '{if($9==200&&$0!~/bot/&&$0!~/spider/&&$0!~/php/&&$0!~/taishan/&&$6~/GET/&&$0!~/Verification/&&$0!~/"-" "-"/&&$0!~/[gG]o/&&$0!~/[pP]ython/&&$0!~/curl/){if($7~/\/assets\/js\/app/&&last&&$1==last)print $1;last=$1;}}' log/today >> log/userpre
awk '{print $0}' log/userpre|sort | uniq -c | sort -nr >> log/user

# Basic pv & Yesterday pv
date -d yesterday +%Y%m%d > log/yesterday
yMonth=`date -d yesterday +%B`
yestday="$(date -d yesterday +%d)/${yMonth:0:3}/$(date -d yesterday +%Y)"
am="$yestday:00:00:00"
pm="$yestday:23:59:59"
originpv=`cat log/basic | tail -n +1 | head -n 1`
originspider=`cat log/basic | tail -n +2 | head -n 1`
num=`awk '{if($9==200&&$7~/pv.txt/&&$0!~/bot/&&$0!~/spider/&&$0!~/php/&&$0!~/taishan/&&$6~/GET/&&$0!~/Verification/&&$0!~/"-" "-"/&&$0!~/[gG]o/&&$0!~/[pP]ython/&&$0!~/curl/){split($4,array,"[");if(array[2]>=am && array[2]<=pm){print $0}}}' am="$am" pm="$pm" log/today|sort | uniq -c | wc -l`
echo $num >> log/yesterday
expr $num + $originpv > log/basicpre
num=`awk 'NR==FNR {a[$2]=$0} NR!=FNR {if(FNR>1&&!($1 in a)&&($9!=200||$0~/bot/||$0~/spider/||$0~/php/||$0~/taishan/||$6!~/GET/||$0~/Verification/||$0~/"-" "-"/||$0~/[gG]o/||$0~/[pP]ython/||$0~/curl/)){split($4,array,"[");if(array[2]>=am && array[2]<=pm){print $0}}}' am="$am" pm="$pm" log/user log/today|sort | uniq -c | wc -l`
echo $num >> log/yesterday
expr $num + $originspider >> log/basicpre
cp log/basicpre log/basic
echo $(cat log/yesterday) >> log/day

## reload data

# first=20180820
# second=20181028
# logpath=/usr/local/nginx/logs/access.log
# awk '{if($9==200&&/\/assets\/js\/app/&&$0!~/bot/&&$0!~/spider/&&$0!~/php/&&$0!~/taishan/&&$0!~/POST/&&$0!~/Verification/&&$0!~/"-" "-"/&&$0!~/Python/&&$0!~/go/&&$0!~/Go/&&$0!~/python/&&$0!~/curl/){print $1}}' $logpath|sort | uniq -c | sort -nr >> log/userpre
# awk '{if($1>5)print $0}' log/userpre >> log/user

# while [ "$first" != "$second" ]
# do
# date -d "${first}" +%Y%m%d > log/yesterday
# yMonth=`date -d "${first}" +%B`
# yestday="$(date -d "${first}" +%d)/${yMonth:0:3}/$(date -d "${first}" +%Y)"
# am="$yestday:00:00:00"
# pm="$yestday:23:59:59"
# echo $am
# am="$yestday:00:00:00"
# pm="$yestday:23:59:59"
# awk '{if($9==200&&$7~/\/assets\/js\/app/&&$0!~/bot/&&$0!~/spider/&&$0!~/php/&&$0!~/taishan/&&$6~/GET/&&$0!~/Verification/&&$0!~/"-" "-"/&&$0!~/[gG]o/&&$0!~/[pP]ython/&&$0!~/curl/){split($4,array,"[");if(array[2]>=am && array[2]<=pm){print $0}}}' am="$am" pm="$pm" $logpath|sort | uniq -c | wc -l >> log/yesterday
# awk 'NR==FNR {a[$2]=$0} NR!=FNR {if(FNR>1&&!($1 in a)&&($9!=200||$0~/bot/||$0~/spider/||$0~/php/||$0~/taishan/||$6!~/GET/||$0~/Verification/||$0~/"-" "-"/||$0~/[gG]o/||$0~/[pP]ython/||$0~/curl/)){split($4,array,"[");if(array[2]>=am && array[2]<=pm){print $0}}}' am="$am" pm="$pm" log/user $logpath|sort | uniq -c | wc -l >> log/yesterday
# echo $(cat log/yesterday) >> log/day
# let first=`date -d "-1 days ago ${first}" +%Y%m%d`
# done
