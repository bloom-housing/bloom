#!/bin/sh
set -e

DB_HOST="${DB_HOST:-db}"
DB_PORT="${DB_PORT:-5432}"
DB_USER="${DB_USER:-postgres}"
DB_PASS="${DB_PASSWORD:-postgres}"
DB_NAME="bloom_prisma"

echo "⏳ Waiting for Postgres at ${DB_HOST}:${DB_PORT}..."
until pg_isready -h "$DB_HOST" -p "$DB_PORT"; do
  sleep 1
done

echo "✅ Postgres is up"

if [ "$RESET_DB" = "true" ]; then
  echo "🔄 Resetting database..."

  export PGPASSWORD="$DB_PASS"

  # Drop & recreate
  psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -c "DROP DATABASE IF EXISTS ${DB_NAME} WITH (FORCE);"
  psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -c "CREATE DATABASE ${DB_NAME};"

  # Enable uuid‑ossp
  psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" \
    -c "CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";"
fi

echo "⏳ Running migrations..."
yarn db:migration:run

if [ "$RUN_SEED" = "true" ]; then
  # Default to 'staging' if SEED_ENV not set
  SEED_ENV="${SEED_ENV:-staging}"
  echo "🌱 Seeding database (env=${SEED_ENV}, jurisdiction=${JURISDICTION_NAME})..."
  # this resolves to yarn db:seed:staging -- --environment staging --jurisdictionName $JURISDICTION_NAME
  yarn db:seed:"$SEED_ENV" -- --environment "$SEED_ENV" --jurisdictionName "$JURISDICTION_NAME"
fi

echo "🚀 Starting API"
exec yarn dev

