#!/bin/bash
set -euo pipefail

PROJECT_DIR="/home/z/my-project"
cd "$PROJECT_DIR"

# Kill any existing server
if [ -f server.pid ]; then
    OLD_PID=$(cat server.pid)
    if kill -0 "$OLD_PID" 2>/dev/null; then
        kill "$OLD_PID" 2>/dev/null || true
        sleep 1
    fi
    rm -f server.pid
fi

# Check if standalone build exists; if not, build it
if [ ! -f ".next/standalone/server.js" ]; then
  echo "[DEV] No production build found. Building..."
  bun install
  bun run build
fi

# Start the server using Python (creates new session that persists across shell termination)
python3 << 'PYEOF'
import subprocess, os, time

os.chdir("/home/z/my-project")
env = os.environ.copy()
env["PORT"] = "3000"
env["HOSTNAME"] = "0.0.0.0"
env["NODE_ENV"] = "production"

proc = subprocess.Popen(
    ["node", ".next/standalone/server.js"],
    cwd="/home/z/my-project",
    env=env,
    stdin=subprocess.DEVNULL,
    stdout=open("/home/z/my-project/server-stdout.log", "w"),
    stderr=open("/home/z/my-project/server-stderr.log", "w"),
    start_new_session=True,
)

with open("/home/z/my-project/server.pid", "w") as f:
    f.write(str(proc.pid))

print(f"[DEV] Server started with PID: {proc.pid}")
time.sleep(1)
if proc.poll() is None:
    print("[DEV] Server is alive and ready!")
else:
    print(f"[DEV] Server exited with code: {proc.poll()}")
PYEOF

# Wait for server to be ready
for i in $(seq 1 10); do
    if curl -s -o /dev/null http://127.0.0.1:3000/ 2>/dev/null; then
        echo "[DEV] Server is ready! PID: $(cat server.pid)"
        exit 0
    fi
    sleep 1
done

echo "[DEV] Warning: Server may not be fully ready yet."
