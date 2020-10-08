#!/bin/sh

# Load up .env
set -o allexport
[[ -f .env ]] && source .env
set +o allexport

ssh -L $MONGO_TUNNEL_LOCAL_PORT:localhost:$MONGO_REMOTE_PORT root@$MONGO_HOST -f -N
