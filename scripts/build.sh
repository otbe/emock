#!/usr/bin/env bash

mkdir -p dist

cp generated/emock.js dist/emock.js

find generated/ | grep '.d.ts' | xargs awk 'BEGINFILE {print "/* file:", FILENAME, "*/"} {print $0}' >> dist/emock.d.ts

node scripts/polish-type-definitions.js
