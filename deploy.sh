#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

rm -rf vuepress

# 生成静态文件
npm run docs:build


npm run build

cp ./dist/clchart.js ./samples/clchart.js
cp ./dist/clchart.js.map ./samples/clchart.js.map

cp -r ./samples ./vuepress

# 进入生成的文件夹
cd ./vuepress

# 如果是发布到自定义域名
# echo 'www.example.com' > CNAME

git init
git add -A
git commit -m 'deploy'

# 如果发布到 https://<USERNAME>.github.io
# git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git master

# 如果发布到 https://seerline.github.io/clchart
git push -f git@github.com:seerline/clchart.git master:gh-pages

cd -

rm -rf ./samples/clchart.js ./samples/clchart.js.map