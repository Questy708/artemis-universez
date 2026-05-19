#!/bin/bash
# University of Artemis - Server Start Script
# Uses Python to start the Node.js server in a new session so it persists

cd /home/z/my-project

# Kill any existing server
if [ -f server.pid ]; then
    OLD_PID=$(cat server.pid)
    if kill -0 "$OLD_PID" 2>/dev/null; then
        echo "Stopping existing server (PID: $OLD_PID)..."
        kill "$OLD_PID" 2>/dev/null
        sleep 1
    fi
    rm -f server.pid
fi

# Start the server using Python (which creates a new session that persists)
python3 << 'PYEOF'
import subprocess, os

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

print(f"Server started with PID: {proc.pid}")
PYEOF

# Wait for server to be ready
for i in $(seq 1 10); do
    if curl -s -o /dev/null http://127.0.0.1:3000/ 2>/dev/null; then
        echo "Server is ready! PID: $(cat server.pid)"
        echo "Preview available at: http://localhost:81/"
        exit 0
    fi
    sleep 1
done

echo "Warning: Server may not be fully ready yet. Check server.pid for the process."
