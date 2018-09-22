date -d yesterday +%Y%m%d > yesterday
yMonth=`date -d yesterday +%B`
month=`date +%B`
sed -n "/$(date -d yesterday +%d)\/${yMonth:0:3}\/$(date -d yesterday +%Y):00/,/$(date +%d)\/${month:0:3}\/$(date +%Y):00/p" /var/log/nginx/access.log | awk '{print $1}' | sort | uniq -c | wc -l >> yesterday
echo $(cat yesterday) >> day


# first=20180720
# second=20180912

# while [ "$first" != "$second" ]
# do
# echo $first
# date -d "${first}" +%Y%m%d > yesterday
# yMonth=`date -d "${first}" +%B`
# month=`date -d "-1 days ago ${first}" +%B`
# sed -n "/$(date -d "${first}" +%d)\/${yMonth:0:3}\/$(date -d "${first}" +%Y):00/,/$(date -d "-1 days ago ${first}" +%d)\/${month:0:3}\/$(date -d "-1 days ago ${first}" +%Y):00/p" /usr/local/nginx/logs/access.log | awk '{print $1}' | sort | uniq -c | wc -l >> yesterday
# echo $(cat yesterday) >> day
# let first=`date -d "-1 days ago ${first}" +%Y%m%d`
# done
