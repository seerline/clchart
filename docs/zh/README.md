---
home: true
heroImage: /logo.png
actionText: 快速上手 →
actionLink: /zh/guide/
features:
- title: 快速
  details: 能快速绘制大数据量的股票图。
- title: 简单
  details: 通过自定义以及默认配置相结合，可以快速使用ClChart轻松绘制专业的股票图表。
- title: 跨平台
  details: 支持html、微信小程序、react-native和weex。
footer: MIT Licensed | Copyright © 2018-present ClChart
---

# 安装 ClChart

## 手动下载

你可以在[GitHub releases](https://github.com/seerline/clchart/releases/latest)下载最新的 `clchart`版本

## npm

```bash
npm install clchart --save
```

## 源码安装

克隆github仓库并打包:

```shell
git clone git@github.com:seerline/clchart.git
cd clchart
npm install

# 打包
npm run build
```

## html文件引入

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <!-- import ClChart file -->
    <script src="./clchart.js"></script>
</head>
</html>
```
