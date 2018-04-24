#!/bin/bash

npm run build

cp ./dist/clchart.js ./samples/clchart.js
cp ./dist/clchart.js.map ./samples/clchart.js.map

node ./scripts/gh-pages.js

rm -rf ./samples/clchart.js
rm -rf ./samples/clchart.js.map