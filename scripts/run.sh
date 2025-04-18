#!/bin/bash

docker run --rm --name typephoon \
  -p 3000:3000 \
  localhost:5000/test/typephoon:test
