#!/usr/bin/env bash

init_script="./init.docker-compose.sql"

if [[ "$IN_RDS" == "true" ]]; then
    init_script="./init.rds.sql"
fi

PGPASSWORD="$DB_PASSWORD" psql \
  --host="$DB_HOSTNAME" --port="$DB_PORT" \
  --username="$DB_USERNAME" \
  --file="$init_script" \
  --echo-queries \
  postgres
