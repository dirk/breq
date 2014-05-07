#!/bin/bash
# uglifyjs breq.js -b beautify=false,max-line-len=72 -o breq.min.js
yuicompressor --type js --line-break 72 -o breq.min.js breq.js
