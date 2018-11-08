# @Author: gunjianpan
# @Date:   2018-10-28 22:21:08
# @Last Modified by:   gunjianpan
# @Last Modified time: 2018-11-09 00:57:50
#!/bin/bash

step=5

for (( i = 0; i < 60; i=(i+step) ));
do
    cd /usr/local/www/wyydsb/blog && zsh script/pv.sh >> log/crontab.log 2>&1
    sleep $step
done

