ENV_FILE=".env.$NODE_ENV"

set -o allexport
. ./$ENV_FILE
set +o allexport

## check for pending migrations
node_modules/.bin/ts-node -P ./tsconfig.typeorm.json node_modules/.bin/typeorm -d src/config/database/datasource.ts migration:run

node dist/main.js
