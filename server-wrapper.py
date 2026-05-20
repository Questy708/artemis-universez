#!/usr/bin/env python3
"""
Persistent server wrapper - keeps the Node.js production server alive.
Python processes survive the sandbox's process reaper.
"""
import subprocess
import os
import time
import signal
import sys

PROJECT_DIR = "/home/z/my-project"
SERVER_PATH = os.path.join(PROJECT_DIR, ".next/standalone/server.js")

os.chdir(PROJECT_DIR)
os.environ["PORT"] = "3000"
os.environ["HOSTNAME"] = "0.0.0.0"
os.environ["NODE_ENV"] = "production"

def signal_handler(sig, frame):
    sys.exit(0)

signal.signal(signal.SIGTERM, signal_handler)
signal.signal(signal.SIGINT, signal_handler)

print(f"[SERVER] Starting persistent Node.js server wrapper...", flush=True)

while True:
    try:
        proc = subprocess.Popen(
            ["node", SERVER_PATH],
            cwd=PROJECT_DIR,
            env=os.environ.copy(),
        )
        print(f"[SERVER] Node.js process started (PID: {proc.pid})", flush=True)
        
        # Wait for the process to exit
        retcode = proc.wait()
        print(f"[SERVER] Node.js exited with code {retcode}, restarting in 1s...", flush=True)
        time.sleep(1)
    except Exception as e:
        print(f"[SERVER] Error: {e}, restarting in 2s...", flush=True)
        time.sleep(2)
