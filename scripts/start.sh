#!/bin/sh

cd dist
npx nodemon -x "clear; node --inspect=5858 ."
