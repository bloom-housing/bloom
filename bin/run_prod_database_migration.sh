#!/bin/bash

if [ -f ./.env ]; then
  . ./.env
else
  exit 1 ".env does not exist"
fi

wget https://dl.google.com/cloudsql/cloud_sql_proxy.linux.amd64 -O cloud_sql_proxy
chmod +x cloud_sql_proxy
./cloud_sql_proxy -instances=$INSTANCE_CONNECTION_NAME=tcp:5432 &

sleep 4s

cd ../backend/core

# Override the DATABASE_URL variable in backend/core/.env.
echo "DATABASE_URL=$DATABASE_URL" >> .env
yarn db:migration:run
# Now remove the last line.
head -n -1 .env | tee .env > /dev/null

cd -
kill %1
rm ./cloud_sql_proxy
