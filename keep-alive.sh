#!/bin/bash
# This script keeps the Node.js server alive by restarting it in a loop
# It should be started with: setsid /home/z/my-project/keep-alive.sh

cd /home/z/my-project
export PORT=3000
export HOSTNAME="0.0.0.0"
export NODE_ENV=production

LOG="/home/z/my-project/server.log"

echo "[$(date)] keep-alive.sh starting..." >> "$LOG"

while true; do
    echo "[$(date)] Starting Node.js server..." >> "$LOG"
    node .next/standalone/server.js >> "$LOG" 2>&1
    EXIT_CODE=$?
    echo "[$(date)] Server exited with code $EXIT_CODE, restarting in 1s..." >> "$LOG"
    sleep 1
done
