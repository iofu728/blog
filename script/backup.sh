#!/usr/bin/env bash

# Backup

cp /usr/local/nginx/logs/access.log /usr/local/www/wyydsb

git add .
git commit -m ":label: backup $(date +%Y/%m/%d)"
git push origin develop

