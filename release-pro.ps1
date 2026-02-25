# Poker Clock PRO release builder (Windows)
# Run from PowerShell in your Vite repo root

$ErrorActionPreference = "Stop"

# --- CONFIG: change these if you want ---
$RepoRoot     = Split-Path -Parent $MyInvocation.MyCommand.Path
$ReleaseRoot  = Join-Path $RepoRoot "..\PokerClock-Pro-Release"
$ZipPath      = Join-Path $RepoRoot "..\PokerClock-Pro-Release.zip"

# Where your Vite build output goes
$ViteDist     = Join-Path $RepoRoot "dist"

# Temporary folder where we build the launcher EXE
$LauncherWork = Join-Path $RepoRoot "..\PokerClock-Launcher-Build"

# Name of the exe we ship
$ExeName      = "PokerClock.exe"

Write-Host "RepoRoot:      $RepoRoot"
Write-Host "ReleaseRoot:   $ReleaseRoot"
Write-Host "ZipPath:       $ZipPath"
Write-Host ""

# --- 1) Build PRO web app (offline base ./) ---
Write-Host "1) Building Vite PRO (offline)..." -ForegroundColor Cyan
Push-Location $RepoRoot
npm run build:zip:pro
Pop-Location

if (!(Test-Path $ViteDist)) {
  throw "Vite dist folder not found: $ViteDist"
}

# --- 2) Recreate release folder cleanly ---
Write-Host "2) Creating clean release folder..." -ForegroundColor Cyan
if (Test-Path $ReleaseRoot) {
  Remove-Item -Recurse -Force $ReleaseRoot
}
New-Item -ItemType Directory -Path $ReleaseRoot | Out-Null
New-Item -ItemType Directory -Path (Join-Path $ReleaseRoot "app") | Out-Null

# --- 3) Copy dist/* into Release/app/* (NOT dist folder itself) ---
Write-Host "3) Copying dist contents into Release\app ..." -ForegroundColor Cyan
Copy-Item -Recurse -Force (Join-Path $ViteDist "*") (Join-Path $ReleaseRoot "app")

# --- 4) Create/Update server.py (launcher) in launcher work folder ---
Write-Host "4) Preparing launcher build folder..." -ForegroundColor Cyan
if (Test-Path $LauncherWork) {
  Remove-Item -Recurse -Force $LauncherWork
}
New-Item -ItemType Directory -Path $LauncherWork | Out-Null

$ServerPy = Join-Path $LauncherWork "server.py"

@'
import http.server
import socketserver
import webbrowser
import os
import sys
import socket
import time
import threading
import traceback
import re

APP_NAME = "Poker Clock"
START_PORT = 5173

def get_base_dir():
    if getattr(sys, "frozen", False):
        return os.path.dirname(sys.executable)
    return os.path.dirname(os.path.abspath(__file__))

def log(msg: str):
    base = get_base_dir()
    path = os.path.join(base, "server.log")
    with open(path, "a", encoding="utf-8") as f:
        f.write(msg + "\n")

def alert_windows(message: str):
    try:
        import ctypes
        ctypes.windll.user32.MessageBoxW(0, message, APP_NAME, 0x10)
    except Exception:
        pass

def find_free_port(start=START_PORT, tries=200):
    for port in range(start, start + tries):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            try:
                s.bind(("127.0.0.1", port))
                return port
            except OSError:
                continue
    raise RuntimeError("No free port found")

def validate_app_folder(app_dir: str):
    index_path = os.path.join(app_dir, "index.html")
    if not os.path.isfile(index_path):
        return False, f"Missing file: {index_path}"

    with open(index_path, "r", encoding="utf-8") as f:
        html = f.read()

    refs = re.findall(r'(?:(?:src|href)=")(\./assets/[^"]+)"', html)
    missing = []
    for r in refs:
        p = os.path.join(app_dir, r.replace("./", ""))
        if not os.path.isfile(p):
            missing.append(p)

    if missing:
        return False, "Missing asset files referenced by index.html:\n\n" + "\n".join(missing)

    return True, "OK"

class ThreadingHTTPServer(socketserver.ThreadingMixIn, socketserver.TCPServer):
    allow_reuse_address = True
    daemon_threads = True

class LoggingHandler(http.server.SimpleHTTPRequestHandler):
    # Quiet default console spam; we log ourselves
    def log_message(self, format, *args):
        try:
            log("HTTP: " + (format % args))
        except Exception:
            pass

    # Catch and log any handler crash that would otherwise be invisible in --noconsole
    def handle_one_request(self):
        try:
            super().handle_one_request()
        except Exception:
            log("HANDLER CRASH:\n" + traceback.format_exc())
            raise

def run_server():
    try:
        base = get_base_dir()
        app_dir = os.path.join(base, "app")

        log("\n--- START ---")
        log(f"Base dir: {base}")
        log(f"App dir:  {app_dir}")

        if not os.path.isdir(app_dir):
            msg = f"Could not find the 'app' folder next to the launcher.\n\nExpected:\n{app_dir}"
            log("ERROR: " + msg)
            alert_windows(msg)
            return

        ok, detail = validate_app_folder(app_dir)
        if not ok:
            log("ERROR: " + detail)
            alert_windows(detail + "\n\nFix: Re-copy your Vite dist contents into the app folder.")
            return

        os.chdir(app_dir)
        log("Serving from: " + os.getcwd())

        port = find_free_port()
        url = f"http://127.0.0.1:{port}/"
        log(f"Using port: {port}")
        log(f"URL: {url}")

        httpd = ThreadingHTTPServer(("127.0.0.1", port), LoggingHandler)

        def serve():
            try:
                httpd.serve_forever()
            except Exception:
                log("SERVER THREAD CRASH:\n" + traceback.format_exc())

        t = threading.Thread(target=serve, daemon=True)
        t.start()

        # Wait a touch longer to avoid “opened too fast” edge cases
        time.sleep(0.6)

        # Self-test: request / once so we know if handler crashes immediately
        try:
            import urllib.request
            urllib.request.urlopen(url, timeout=2).read(64)
            log("SELFTEST: OK")
        except Exception:
            log("SELFTEST FAILED:\n" + traceback.format_exc())
            alert_windows("Poker Clock started but failed to serve the page.\n\nCheck server.log next to the EXE.")
            # keep running so user can retry / you can inspect logs

        try:
            print("")
            print(f"Open: {url}")
            print("Poker Clock is running.")
            print("")
            print("To stop the clock, close this window.")
            print("")
            webbrowser.open(url)
        except Exception:
            log("webbrowser.open failed:\n" + traceback.format_exc())

        while True:
            time.sleep(0.5)

    except Exception:
        log("FATAL:\n" + traceback.format_exc())
        alert_windows("Poker Clock failed to start.\n\nCheck server.log next to the EXE.")
        return

if __name__ == "__main__":
    run_server()
'@ | Set-Content -Encoding UTF8 $ServerPy

# --- 5) Build EXE via PyInstaller ---
Write-Host "5) Building EXE with PyInstaller..." -ForegroundColor Cyan
Push-Location $LauncherWork

# Ensure pyinstaller exists
python -m pip show pyinstaller | Out-Null
python -m PyInstaller --onefile --console --name PokerClock server.py

Pop-Location

$BuiltExe = Join-Path $LauncherWork "dist\PokerClock.exe"
if (!(Test-Path $BuiltExe)) {
  throw "PyInstaller output not found: $BuiltExe"
}

# --- 6) Copy EXE into Release root (next to app folder) ---
Write-Host "6) Copying EXE into release folder..." -ForegroundColor Cyan
Copy-Item -Force $BuiltExe (Join-Path $ReleaseRoot $ExeName)

# --- 7) Create ZIP ---
Write-Host "7) Creating ZIP..." -ForegroundColor Cyan
if (Test-Path $ZipPath) {
  Remove-Item -Force $ZipPath
}
Compress-Archive -Path (Join-Path $ReleaseRoot "*") -DestinationPath $ZipPath

Write-Host ""
Write-Host "DONE ✅" -ForegroundColor Green
Write-Host "Release folder: $ReleaseRoot"
Write-Host "ZIP created:     $ZipPath"