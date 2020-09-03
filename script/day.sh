#!/usr/bin/env bash

source script/constant.sh

# Load yestday Data
truncate -s 0 ${BASIC_DIR}today
awk '{if($12!="\"Chrome/57\"")print $0}' ${LOG_PATH} >>${BASIC_DIR}today
cat ${BASIC_DIR}today >>${BACKUP_PATH}
truncate -s 0 ${LOG_PATH}

# Build User File
truncate -s 0 ${BASIC_DIR}user
awk '{if($9==200&&($0!~/bot/||$0~/other\/chatbot.html/)&&($0!~/spider/||$0~/other\/spider.html/)&&$0!~/php/&&$0!~/taishan/&&$6~/GET/&&$0!~/Verification/&&$0!~/"-" "-"/&&$0!~/[gG]o/&&$0!~/[pP]ython/&&$0!~/curl/&&$0!~/Baiduspider/){if($7~/\/assets\/js\/app/&&last&&$1==last)print $1;last=$1;}}' ${BASIC_DIR}today >>${BASIC_DIR}userpre
awk '{print $0}' ${BASIC_DIR}userpre | sort | uniq -c | sort -nr >>${BASIC_DIR}user

# Basic pv & Yesterday pv
date -d yesterday +%Y%m%d >${BASIC_DIR}yesterday
yMonth=$(date -d yesterday +%B)
yestday="$(date -d yesterday +%d)/${yMonth:0:3}/$(date -d yesterday +%Y)"
am="$yestday:00:00:00"
pm="$yestday:23:59:59"
originpv=$(cat ${BASIC_DIR}basic | tail -n +1 | head -n 1)
originspider=$(cat ${BASIC_DIR}basic | tail -n +2 | head -n 1)
num=$(awk '{if($9==200&&$7~/api/&&($0!~/bot/||$0~/other\/chatbot.html/)&&($0!~/spider/||$0~/other\/spider.html/)&&$0!~/php/&&$0!~/taishan/&&$6~/GET/&&$0!~/Verification/&&$0!~/"-" "-"/&&$0!~/[gG]o/&&$0!~/[pP]ython/&&$0!~/curl/&&$0!~/localhost/&&$0!~/Baiduspider/){split($4,array,"[");if(array[2]>=am && array[2]<=pm){print $0}}}' am="$am" pm="$pm" ${BASIC_DIR}today | sort | uniq -c | wc -l)
echo $num >>${BASIC_DIR}yesterday
expr $num + $originpv >${BASIC_DIR}basicpre
num=$(awk 'NR==FNR {a[$2]=$0} NR!=FNR {if(FNR>1&&!($1 in a)&&($9!=200||$0~/bot/||$0~/spider/||$0~/php/||$0~/taishan/||$6!~/GET/||$0~/Verification/||$0~/"-" "-"/||$0~/[gG]o/||$0~/[pP]ython/||$0~/curl/||$0~/Baiduspider/)){split($4,array,"[");if(array[2]>=am && array[2]<=pm){print $0}}}' am="$am" pm="$pm" ${BASIC_DIR}user ${BASIC_DIR}today | sort | uniq -c | wc -l)
echo $num >>${BASIC_DIR}yesterday
expr $num + $originspider >>${BASIC_DIR}basicpre
cp ${BASIC_DIR}basicpre ${BASIC_DIR}basic
echo $(cat ${BASIC_DIR}yesterday) >>${BASIC_DIR}day

# Block_ip
awk '{print $1}' ${LOG_PATH} | sort | uniq -c | sort -nr | awk '{if($1>1000) print "deny "$2";"}' >>${BLACK_PATH}
awk '{if($9==403)print $1}' ${BASIC_DIR}today | sort | uniq -c | sort -nr | awk '{if($1>66) print "deny "$2";"}' >>${BLACK_PATH}
cp ${BLACK_PATH} ${BLACK_PATH}.1
awk '{print $2}' ${BLACK_PATH} | sort | uniq -c | sort -nr | awk '{print "deny "$2""}' >${BLACK_PATH}
$NGINX -s stop >>${BASIC_DIR}crontab.log 2>&1
$HTTPSSET renew >>${BASIC_DIR}crontab.log 2>&1
$NGINX >>${BASIC_DIR}crontab.log 2>&1

## reload data

# first=20180820
# second=20181028
# logpath=/usr/local/nginx/logs/access.log
# awk '{if($9==200&&/\/assets\/js\/app/&&$0!~/bot/&&$0!~/spider/&&$0!~/php/&&$0!~/taishan/&&$0!~/POST/&&$0!~/Verification/&&$0!~/"-" "-"/&&$0!~/Python/&&$0!~/go/&&$0!~/Go/&&$0!~/python/&&$0!~/curl/){print $1}}' ${LOG_PATH}|sort | uniq -c | sort -nr >> ${BASIC_DIR}userpre
# awk '{if($1>5)print $0}' ${BASIC_DIR}userpre >> ${BASIC_DIR}user

# while [ "$first" != "$second" ]
# do
# date -d "${first}" +%Y%m%d > ${BASIC_DIR}yesterday
# yMonth=`date -d "${first}" +%B`
# yestday="$(date -d "${first}" +%d)/${yMonth:0:3}/$(date -d "${first}" +%Y)"
# am="$yestday:00:00:00"
# pm="$yestday:23:59:59"
# echo $am
# am="$yestday:00:00:00"
# pm="$yestday:23:59:59"
# awk '{if($9==200&&$7~/\/assets\/js\/app/&&$0!~/bot/&&$0!~/spider/&&$0!~/php/&&$0!~/taishan/&&$6~/GET/&&$0!~/Verification/&&$0!~/"-" "-"/&&$0!~/[gG]o/&&$0!~/[pP]ython/&&$0!~/curl/){split($4,array,"[");if(array[2]>=am && array[2]<=pm){print $0}}}' am="$am" pm="$pm" ${LOG_PATH}|sort | uniq -c | wc -l >> ${BASIC_DIR}yesterday
# awk 'NR==FNR {a[$2]=$0} NR!=FNR {if(FNR>1&&!($1 in a)&&($9!=200||$0~/bot/||$0~/spider/||$0~/php/||$0~/taishan/||$6!~/GET/||$0~/Verification/||$0~/"-" "-"/||$0~/[gG]o/||$0~/[pP]ython/||$0~/curl/)){split($4,array,"[");if(array[2]>=am && array[2]<=pm){print $0}}}' am="$am" pm="$pm" ${BASIC_DIR}user ${LOG_PATH}|sort | uniq -c | wc -l >> ${BASIC_DIR}yesterday
# echo $(cat ${BASIC_DIR}yesterday) >> ${BASIC_DIR}day
# let first=`date -d "-1 days ago ${first}" +%Y%m%d`
# done
