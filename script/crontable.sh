# @Author: gunjianpan
# @Date:   2018-10-28 22:21:08
# @Last Modified by:   gunjianpan
# @Last Modified time: 2020-09-03 15:45:53
#!/bin/bash

source script/constant.sh

step=1

for ((i = 0; i < 60; i = (i + step))); do
    cd ${GIT_PATH} && zsh script/pv.sh >>log/crontab.log 2>&1
    sleep $step
done
