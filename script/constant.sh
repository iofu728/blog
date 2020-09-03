#!/usr/bin/env bash
# @Author: gunjianpan
# @Date:   2018-11-09 16:09:31
# @Last Modified by:   gunjianpan
# @Last Modified time: 2020-09-03 15:49:36

# File Path in your Service !important
LOG_PATH=/usr/local/tengine/logs/access.log
BACKUP_PATH=/usr/local/www/wyydsb/access.log
GIT_PATH=/usr/local/www/wyydsb/blog
NGINX_DIR=/usr/local/wyydsb
BLACK_PATH=/usr/local/tengine/conf/block_ip.conf
NGINX=/usr/local/bin/tengine
HTTPSSET=/usr/bin/certbot
BASIC_DIR=log/
