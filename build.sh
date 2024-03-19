#!/bin/sh
node -e "require('fs').copyFileSync(process.execPath, 'node')"
mkdir -p dist
mv node dist/awsp
node --experimental-sea-config sea-config.json
npx postject dist/awsp NODE_SEA_BLOB build/sea-prep.blob --sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2
