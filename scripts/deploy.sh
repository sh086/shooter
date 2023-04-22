#!/usr/bin/env sh
# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
yarn build

# 进入部署文件夹
cd dist

# 强制上传到仓库
git init
git add -A
git commit -m 'Actions自动部署'
git push -f https://github.com/sh086/course.git master:gh-pages

# 删除dist
cd -
rm -rf dist
