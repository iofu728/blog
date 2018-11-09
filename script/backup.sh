#!/usr/bin/env bash

# Backup
git add .
git commit -m ":label: backup $(date +%Y/%m/%d)"
git push origin develop

