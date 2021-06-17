#!/bin/bash

set -eux -o pipefail

echo "App linking...\n"

cd dist
npm link
cd ../
npm link $1/node_modules/react
cd $1
npm link @ae-nuna/dq-components

echo "Linking for $1 success"