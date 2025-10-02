#!/bin/sh

if [ -e $ENV ]; then
    echo "No ENV given! (this should be the appropriate .env file suffix)"
    exit 1
fi
ENV_FILE=".env.$ENV"
set -o allexport
. ./$ENV_FILE
set +o allexport

npx ts-node -P ./tsconfig.typeorm.json ./node_modules/typeorm/cli -d src/config/database/datasource.ts $@
