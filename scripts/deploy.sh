#!/bin/bash

npm run build

cp ./dist/ClChart.js ./samples
cp ./dist/ClChart.js.map ./samples

node ./scripts/gh-pages.js

rm -rf ./samples/ClChart.js
rm -rf ./samples/ClChart.js.map