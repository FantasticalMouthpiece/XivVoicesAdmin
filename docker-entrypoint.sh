#!/bin/sh
set -e

# Wait for PostgreSQL to be ready
echo "Waiting for database to be ready..."
npx wait-on tcp:postgres:5432

# Run Prisma migrations
echo "Applying database migrations..."
npx prisma migrate deploy

# Start the application
echo "Starting the application..."
NODE_ENV=production exec node server.js
