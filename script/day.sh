#!/usr/bin/env bash

loglocal=/usr/local/nginx/logs/access.log
date -d yesterday +%Y%m%d > log/yesterday
yMonth=`date -d yesterday +%B`
today="$(date -d yesterday +%d)/${yMonth:0:3}/$(date -d yesterday +%Y)"
am="$today:00:00:00"
pm="$today:23:59:59"
awk '{if($9==200){split($4,array,"[");if(array[2]>=am && array[2]<=pm){print $1}}}' am="$am" pm="$pm" $loglocal|sort | uniq -c | wc -l >> log/yesterday
awk '{if($9!=200){split($4,array,"[");if(array[2]>=am && array[2]<=pm){print $1}}}' am="$am" pm="$pm" $loglocal|sort | uniq -c | wc -l >> log/yesterday
echo $(cat log/yesterday) >> log/day

# first=20180820
# second=20180929

# while [ "$first" != "$second" ]
# do
# date -d "${first}" +%Y%m%d > log/yesterday
# yMonth=`date -d "${first}" +%B`
# today="$(date -d "${first}" +%d)/${yMonth:0:3}/$(date -d "${first}" +%Y)"
# am="$today:00:00:00"
# pm="$today:23:59:59"
# echo $am
# awk '{if($9==200){split($4,array,"[");if(array[2]>=am && array[2]<=pm){print $1}}}' am="$am" pm="$pm" $loglocal|sort | uniq -c | wc -l >> log/yesterday
# awk '{if($9!=200){split($4,array,"[");if(array[2]>=am && array[2]<=pm){print $1}}}' am="$am" pm="$pm" $loglocal|sort | uniq -c | wc -l >> log/yesterday
# echo $(cat log/yesterday) >> log/day
# let first=`date -d "-1 days ago ${first}" +%Y%m%d`
# done
