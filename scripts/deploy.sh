#!/bin/bash

npm run build

cp ./dist/clchart.js ./samples/web/clchart.js
cp ./dist/clchart.js.map ./samples/web/clchart.js.map

node ./scripts/gh-pages.js

rm -rf ./samples/web/clchart.js
rm -rf ./samples/web/clchart.js.map