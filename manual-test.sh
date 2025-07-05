#!/bin/bash
# Manual verification script for path traversal check
# Starts the server and requests /../../package.json
# Requires express dependencies installed.

set -e
PORT=3000

node server/index.js >/tmp/test_server.log 2>&1 &
PID=$!
# give server time to start
sleep 1

status_code=$(curl -o /tmp/resp -w "%{http_code}" -s http://localhost:$PORT/../../package.json || true)
kill $PID
wait $PID 2>/dev/null || true

cat /tmp/test_server.log
cat /tmp/resp

echo "Status: $status_code"
