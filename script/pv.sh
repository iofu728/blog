#!/usr/bin/env bash

source script/constant.sh

# Pv
originpv=$(cat log/basic | tail -n +1 | head -n 1)
echo "累计访问量:" >log/pv
num=$(awk '{if($9==200&&$7~/api/&&($0!~/bot/||$0~/other\/chatbot.html/)&&($0!~/spider/||$0~/other\/spider.html/)&&$0!~/php/&&$0!~/taishan/&&$6~/GET/&&$0!~/Verification/&&$0!~/"-" "-"/&&$0!~/[gG]o/&&$0!~/[pP]ython/&&$0!~/curl/&&$0!~/localhost/&&$0!~/Baiduspider/){print $0}}' ${LOG_PATH} | sort | uniq -c | wc -l)
expr $num + $originpv >>log/pv
echo "| 昨日访问量:" >>log/pv
cat log/yesterday | tail -n +2 | head -n 1 >>log/pv
echo "| 昨日爬虫数:" >>log/pv
cat log/yesterday | tail -n +3 | head -n 1 >>log/pv

# Time Total Pv
originspider=$(cat log/basic | tail -n +2 | head -n 1)
date +%Y/%m/%d:%T >log/time
cat log/pv | tail -n +2 | head -n 1 >>log/time
num=$(awk 'NR==FNR {a[$2]=$0} NR!=FNR {if(FNR>1&&$12!="\"Chrome/57\""&&!($1 in a)&&($9!=200||($0~/bot/&&$0!~/other\/chatbot.html/)||($0~/spider/&&$0!~/other\/spider.html/)||$0~/php/||$0~/taishan/||$6!~/GET/||$0~/Verification/||$0~/"-" "-"/||$0~/[gG]o/||$0~/[pP]ython/||$0~/curl/||$0~/Baiduspider/))print $0}' log/user ${LOG_PATH} | sort | uniq -c | wc -l)
expr $num + $originspider >>log/time
total=$(cat log/time | tail -n +2 | head -n 1)
word=$(echo $(cat log/time))
awk 'END {if($2!=total)print word}' total="$total" word="$word" log/total >>log/total
