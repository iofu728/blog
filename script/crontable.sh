# @Author: gunjianpan
# @Date:   2018-10-28 22:21:08
# @Last Modified by:   gunjianpan
# @Last Modified time: 2018-11-09 17:21:22
#!/bin/bash

source ./constant.sh

step=5

for (( i = 0; i < 60; i=(i+step) ));
do
    cd $gitpath && zsh script/pv.sh >> log/crontab.log 2>&1
    sleep $step
done

