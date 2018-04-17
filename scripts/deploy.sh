#!/bin/bash

npm run build

cp ./dist/ClChart.js ./samples

node ./scripts/gh-pages.js