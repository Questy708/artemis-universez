#!/bin/bash
cd /home/z/my-project

# Kill any existing server
if [ -f server.pid ]; then
    OLD_PID=$(cat server.pid)
    kill "$OLD_PID" 2>/dev/null || true
    sleep 1
    rm -f server.pid
fi

# Build if needed
if [ ! -f ".next/standalone/server.js" ]; then
    bun install
    bun run build
fi

# Start persistent server via Python
python3 -c "
import subprocess, os, time
os.chdir('/home/z/my-project')
env = os.environ.copy()
env['PORT'] = '3000'
env['HOSTNAME'] = '0.0.0.0'
env['NODE_ENV'] = 'production'
proc = subprocess.Popen(
    ['node', '.next/standalone/server.js'],
    cwd='/home/z/my-project',
    env=env,
    stdin=subprocess.DEVNULL,
    stdout=open('/home/z/my-project/server-stdout.log', 'w'),
    stderr=open('/home/z/my-project/server-stderr.log', 'w'),
    start_new_session=True,
)
with open('/home/z/my-project/server.pid', 'w') as f:
    f.write(str(proc.pid))
print(f'Server started with PID: {proc.pid}')
time.sleep(1)
"

# Wait for server to be ready
for i in $(seq 1 10); do
    if curl -s -o /dev/null http://127.0.0.1:3000/ 2>/dev/null; then
        echo "✅ University of Artemis is running on port 3000"
        echo "   Preview: http://localhost:81/"
        exit 0
    fi
    sleep 1
done

echo "⚠️ Server may still be starting up. Check server.pid"
