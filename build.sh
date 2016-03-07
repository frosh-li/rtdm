#!/bin/bash
# 打包脚本
# By Horizon<root@yinhongbo.com>

ROOT=$(cd `dirname $0`; pwd)"/"

cd $ROOT && rm -rf $ROOT/output && mkdir $ROOT/output
#COPY文件
cp -r *.js *.json sql sqls sessions  $ROOT/output/

cd $ROOT/output;
tar zcf srs.tar.gz *
ls | egrep -v srs.tar.gz | awk '{printf("%s ",$0);}END{print}' | xargs rm -rf
