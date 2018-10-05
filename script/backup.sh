#!/usr/bin/env bash

# Backup

cp /usr/local/nginx/logs/access.log log/

git add .
git commit -m "backup $(date +%Y/%m/%d)"
git push origin develop

