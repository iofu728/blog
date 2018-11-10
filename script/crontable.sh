# @Author: gunjianpan
# @Date:   2018-10-28 22:21:08
# @Last Modified by:   gunjianpan
# @Last Modified time: 2018-11-10 10:57:44
#!/bin/bash

source script/constant.sh

step=1

for (( i = 0; i < 60; i=(i+step) ));
do
    cd $gitpath && zsh script/pv.sh >> log/crontab.log 2>&1
    sleep $step
done

