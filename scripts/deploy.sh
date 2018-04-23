#!/bin/bash

npm run build

cp ./dist/clchart.js ./samples/web
cp ./dist/clchart.js.map ./samples/web

node ./scripts/gh-pages.js

rm -rf ./samples/web/clchart.js
rm -rf ./samples/web/clchart.js.map