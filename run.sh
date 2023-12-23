#!/bin/bash
#
# run server locally
#
export PORT=4000

export $(cat .env)

node server.js
