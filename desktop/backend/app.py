from flask import Flask
from flask_cors import CORS
import sys
import os
import signal
import subprocess
import threading
import time

from tesseract_config import configure_tesseract
from security import load_env

load_env()

app = Flask(__name__)

# ---------------------------------------------------------------------------
# CORS — restrict to an explicit allowlist.
#
# Locally the Electron renderer runs on file:// or http://localhost:<port>.
# On Render, set the ALLOWED_ORIGINS env var to your real frontend URL(s),
# e.g. "https://your-app.onrender.com,https://pentasec.app"
#
# Multiple origins: comma-separated, no spaces.
# ---------------------------------------------------------------------------
_raw_origins = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:3000,http://127.0.0.1:3000,http://localhost:5000,http://127.0.0.1:5000,app://index.html,file://"
)
ALLOWED_ORIGINS = [o.strip() for o in _raw_origins.split(",") if o.strip()]

CORS(
    app,
    origins=ALLOWED_ORIGINS,
    supports_credentials=True,
    allow_headers=["Content-Type", "Authorization"],
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
)

try:
    configure_tesseract()
except RuntimeError as e:
    print(f"[WARNING] Tesseract setup failed: {e}")
    print("[WARNING] Image redaction features will be unavailable.")

from routes.auth_routes import auth_bp
from routes.project_routes import project_bp
from routes.ai_routes import ai_bp
from routes.report_routes import report_bp
from routes.settings_routes import settings_bp
from routes.status_routes import status_bp

app.register_blueprint(auth_bp)
app.register_blueprint(project_bp)
app.register_blueprint(ai_bp)
app.register_blueprint(report_bp)
app.register_blueprint(settings_bp)
app.register_blueprint(status_bp)

import atexit

nextjs_process = None

def cleanup_processes():
    global nextjs_process
    if nextjs_process:
        print("Terminating Next.js process...")
        if sys.platform == 'win32':
            subprocess.run(['taskkill', '/F', '/T', '/PID', str(nextjs_process.pid)])
        else:
            os.killpg(os.getpgid(nextjs_process.pid), signal.SIGTERM)
        nextjs_process = None

atexit.register(cleanup_processes)

def run_flask(port):
    app.run(host='127.0.0.1', port=port)

def run_nextjs():
    """Start Next.js dev server"""
    global nextjs_process
    current_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(current_dir)
    
    print(f"Starting Next.js dev server from {project_root}...")
    
    npm_cmd = 'npm.cmd' if sys.platform == 'win32' else 'npm'
    
    kwargs = {}
    if sys.platform != 'win32':
        kwargs['preexec_fn'] = os.setsid
        
    nextjs_process = subprocess.Popen(
        [npm_cmd, 'run', 'dev'], 
        cwd=project_root,
        **kwargs
    )

def run_electron():
    if getattr(sys, 'frozen', False):
        pass
    else:
        current_dir = os.path.dirname(os.path.abspath(__file__))
        project_root = os.path.dirname(current_dir)
        
        run_nextjs()
        
        print("Waiting for Next.js dev server to start...")
        time.sleep(5)
        
        print(f"Starting Electron from {project_root}...")
        
        npm_cmd = 'npm.cmd' if sys.platform == 'win32' else 'npm'
        
        subprocess.run([npm_cmd, 'run', 'electron:only'], cwd=project_root)

if __name__ == '__main__':
    no_electron = '--no-electron' in sys.argv
    if no_electron:
        sys.argv.remove('--no-electron')

    port = 5000
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except ValueError:
            pass

    flask_thread = threading.Thread(target=run_flask, args=(port,))
    flask_thread.daemon = True
    flask_thread.start()
    
    if getattr(sys, 'frozen', False):
        try:
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            cleanup_processes()
            sys.exit(0)
    else:
        time.sleep(2)
        
        if no_electron:
            print(f"Running in server-only mode on port {port}. Press Ctrl+C to stop.")
            try:
                while True:
                    time.sleep(1)
            except KeyboardInterrupt:
                cleanup_processes()
                sys.exit(0)
        else:
            try:
                run_electron()
            finally:
                print("Electron exited. Shutting down...")
                cleanup_processes()
        sys.exit(0)
