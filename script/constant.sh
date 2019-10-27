#!/usr/bin/env bash
# @Author: gunjianpan
# @Date:   2018-11-09 16:09:31
# @Last Modified by:   gunjianpan
# @Last Modified time: 2019-10-27 16:02:55

# File Path in your Service !important
logpath=/usr/local/tengine/logs/access.log
backuppath=/usr/local/www/wyydsb/access.log
gitpath=/usr/local/www/wyydsb/blog
nginxpath=/usr/local/wyydsb
blockpath=/usr/local/tengine/conf/block_ip.conf
NGINX=/usr/local/bin/tengine
HTTPSSET=/usr/bin/certbot
