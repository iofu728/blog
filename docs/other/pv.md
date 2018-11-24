---
title: 自动更新网站访问量的定时脚本
date: 2018-09-09 14:37:16
tags: [Bash]
description: 定时脚本 Pv
---

原理：Nginx会把访问日志写入access.log

当然 这不是 本文的重点

这种东西Google一下，一大堆

本文要实现的功能
1. 获取总page view，注意去重，同一ip只记录一次
2. 获取时间段中的page view
3. 脚本化（时间变量化，写入文件自动化）
4. 定时任务

### 总PV

```bash
awk '{print $1}' /usr/local/nginx/logs/access.log|sort | uniq -c |wc -l >> pv
# sort  - 按ip进行排序
# uniq  - 去重
# wc -l - 统计行数
# awk   - 输出结果
```

### 时间段Pv

根据上述脚本，我们知道如何获取去重后的总Pv

要获得时间段内的Pv，只需要对access.log中的数据进行一次筛选

```bash
awk '{split($4,array,"[");if(array[2]>="25/Sep/2018:00:00:00" && array[2]<="25/Sep/2018:23:59:59"){print $1}}' /usr/local/nginx/logs/access.log|sort | uniq -c | wc -l
```

可以看到在原有的代码基础上增加了sed处理

### 剔除Status不为200的数据

```bash
awk '{if($9==200)print $0}' /var/log/nginx/access.log
```

### 脚本化

先来看下我们想实现怎么样的效果

把RADEME.md文件的最后一行替换为新的
```jsx
<center>历史访问量：2645 | 昨日访问量: 280</center>
```
我们把 这一行文字 分成 五部分
<center>历史访问量：`$(total Pv)` | 昨日访问量: `$(yesterday Pv)`</center>
主要是两个数据，需要利用两个脚本分别算出来

为了让数据落盘
只能通过 `>>` 存到文件中，持久化

剩下的字符串也通过脚本写入文件中

最后再用一条 `echo $(cat xxx)`
把文件中的字符串压成一行

得到
```bash
loglocal=/usr/local/nginx/logs/access.log
echo "<center>累计访问量:" > log/pv
awk '{if($9==200)print $1}' $loglocal|sort | uniq -c |wc -l >> log/pv
echo "| 昨日访问量:" >> log/pv
awk '{if($9==200){split($4,array,"[");if(array[2]>="08\/Sep\/2018:00:00:00" && array[2]<="08\/Sep\/2018:23:59:59"){print $1}}}' $loglocal|sort | uniq -c | wc -l >> log/pv
echo "</center>" >> log/pv
sed -i '$d' docs/README.md
echo $(cat log/pv) >> docs/README.md
```

这样的脚本能用，但需要每天改时间

于是，同理把时间改为变量,再在最后调用部署脚本

```bash
loglocal=/usr/local/nginx/logs/access.log
echo "<center>累计访问量:" > log/pv
awk '{if($9==200)print $1}' $loglocal|sort | uniq -c |wc -l >> log/pv
echo "| 昨日访问量:" >> log/pv
yMonth=`date -d yesterday +%B`
today="$(date -d yesterday +%d)/${yMonth:0:3}/$(date -d yesterday +%Y)"
am="$today:00:00:00"
pm="$today:23:59:59"
awk '{if($9==200){split($4,array,"[");if(array[2]>=am && array[2]<=pm){print $1}}}' am="$am" pm="$pm" $loglocal|sort | uniq -c | wc -l >> log/pv
echo "</center>" >> log/pv
sed -i '$d' docs/README.md
echo $(cat log/pv) >> docs/README.md
```

### 定时任务

Linux下crontab作为定时任务托管平台

通过`crontab -e`定制

但是定时任务的环境与直接运行脚本不太一样

定时任务相当于在/目录下运行command

lz因为这个问题查了好久，最后发现build.sh 里因为一句话权限不够导致不能执行

最后加了一个`sudo`就解决了 坑爹

如果出现定时任务不生效的情况，可以使用打日志的方式

```bash
*/10 * * * * cd /usr/local/www/wyydsb/blog && bash pv.sh >> log/crontab.log 2>&1
# 2>&1 打日志
# 五个* 分别代表 分 时 天 月 年
# * 代表任意
# */10 时间除以10变化时更新一次 即每个10执行一次
```
