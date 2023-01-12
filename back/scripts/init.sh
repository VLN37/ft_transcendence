#!/bin/sh
npm run typeorm:run-migrations
exec "$@"
