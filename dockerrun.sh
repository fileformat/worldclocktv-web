#!/bin/bash

docker build -t wctv .
docker run \
	-p 4000:4000 \
	-t wctv 
