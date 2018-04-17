#!/bin/bash

npm run build

cp ./dist/clchart.js ./samples
cp ./dist/clchart.js.map ./samples

node ./scripts/gh-pages.js

rm -rf ./samples/clchart.js
rm -rf ./samples/clchart.js.map