# Poker Clock PRO release builder (Windows)
# Run from PowerShell in your Vite repo root

$ErrorActionPreference = "Stop"

# --- CONFIG: change these if you want ---
$RepoRoot     = Split-Path -Parent $MyInvocation.MyCommand.Path
$ReleaseRoot  = Join-Path $RepoRoot "..\PokerClock-Pro-Release"
$PackageJson  = Join-Path $RepoRoot "package.json"
$Version      = (Get-Content $PackageJson | ConvertFrom-Json).version
$ZipPath      = Join-Path $RepoRoot "..\PokerClock-Pro-v$Version.zip"

# Where your Vite build output goes
$ViteDist     = Join-Path $RepoRoot "dist"

# Temporary folder where we build the launcher EXE
$LauncherWork = Join-Path $RepoRoot "..\PokerClock-Launcher-Build"

# Name of the exe we ship
$ExeName      = "PokerClock.exe"

# Docs to include in the ZIP (place these files in your repo root)
$DocsToShip   = @("README.txt", "LICENSE.txt", "EULA.txt")

Write-Host "RepoRoot:      $RepoRoot"
Write-Host "ReleaseRoot:   $ReleaseRoot"
Write-Host "ZipPath:       $ZipPath"
Write-Host "Version:       $Version"
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

# --- Copy icon into launcher folder for PyInstaller ---
$IconSource = Join-Path $RepoRoot "pokerclock.ico"
$IconLocal  = Join-Path $LauncherWork "pokerclock.ico"

if (!(Test-Path $IconSource)) {
  throw "Icon file not found in repo root: $IconSource"
}
Copy-Item -Force $IconSource $IconLocal

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
import json
import urllib.request
import urllib.parse

APP_NAME = "Poker Clock"
START_PORT = 5173

# =========================
# Gumroad Licensing (Simple)
# =========================
# Product URL: https://pokerclockpro.gumroad.com/l/adklaq
GUMROAD_PERMALINK = "adklaq"
# Gumroad REQUIRED product_id for license verification (provided by Gumroad error message)
GUMROAD_PRODUCT_ID = "xcjHxXOrQ5aAXSmsT5Fu7g=="

# Logging mode:
# - Set to True if you want extra debugging for a customer issue.
VERBOSE_LOGGING = False

def get_base_dir():
    if getattr(sys, "frozen", False):
        return os.path.dirname(sys.executable)
    return os.path.dirname(os.path.abspath(__file__))

def get_log_dir():
    # Always writable log location
    return os.path.join(os.environ.get("LOCALAPPDATA", get_base_dir()), "Poker Clock")

def log_path():
    return os.path.join(get_log_dir(), "pokerclock-debug.log")

def log(msg: str):
    try:
        os.makedirs(get_log_dir(), exist_ok=True)
        with open(log_path(), "a", encoding="utf-8") as f:
            f.write(msg + "\n")
    except Exception:
        pass

def alert_windows(message: str):
    try:
        import ctypes
        ctypes.windll.user32.MessageBoxW(0, message, APP_NAME, 0x10)
    except Exception:
        pass

def _gumroad_verify_request(params: dict):
    url = "https://api.gumroad.com/v2/licenses/verify"
    form = urllib.parse.urlencode(params).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=form,
        method="POST",
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    with urllib.request.urlopen(req, timeout=8) as resp:
        body = resp.read().decode("utf-8", errors="ignore")
        return json.loads(body) if body else {}

def gumroad_verify(license_key: str):
    """
    Verify a Gumroad license key. No uses/device tracking.
    Uses product_id (required for this product). Includes a permalink fallback.
    """
    lk = (license_key or "").strip()

    data = _gumroad_verify_request({
        "product_id": GUMROAD_PRODUCT_ID,
        "license_key": lk,
        "increment_uses_count": "false",
    })
    if data.get("success"):
        return data

    # If Gumroad explicitly says product_id required, don't bother retrying permalink.
    msg = (data.get("message") or "").lower()
    if "product_id" in msg and "required" in msg:
        return data

    data2 = _gumroad_verify_request({
        "product_permalink": GUMROAD_PERMALINK,
        "license_key": lk,
        "increment_uses_count": "false",
    })
    data2["_first_attempt"] = data
    return data2

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

# --------------------------
# Local activation file
# --------------------------

def license_path():
    return os.path.join(get_log_dir(), "license.json")

def read_license():
    try:
        with open(license_path(), "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return None

def write_license(data: dict):
    os.makedirs(get_log_dir(), exist_ok=True)
    tmp = license_path() + ".tmp"
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    os.replace(tmp, license_path())

def is_activated():
    d = read_license()
    return bool(d and d.get("activated") is True)

def json_response(handler, obj: dict, status=200):
    b = json.dumps(obj).encode("utf-8")
    handler.send_response(status)
    handler.send_header("Content-Type", "application/json")
    handler.send_header("Content-Length", str(len(b)))
    handler.send_header("Access-Control-Allow-Origin", "*")
    handler.send_header("Access-Control-Allow-Headers", "Content-Type")
    handler.send_header("Access-Control-Allow-Methods", "GET,POST,OPTIONS")
    handler.end_headers()
    handler.wfile.write(b)

class ThreadingHTTPServer(socketserver.ThreadingMixIn, socketserver.TCPServer):
    allow_reuse_address = True
    daemon_threads = True

class LoggingHandler(http.server.SimpleHTTPRequestHandler):
    # Disable noisy per-request logging in production
    def log_message(self, format, *args):
        if VERBOSE_LOGGING:
            try:
                log("HTTP: " + (format % args))
            except Exception:
                pass
        return

    # Catch and log any handler crash
    def handle_one_request(self):
        try:
            super().handle_one_request()
        except Exception:
            log("HANDLER CRASH:\n" + traceback.format_exc())
            raise

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Access-Control-Allow-Methods", "GET,POST,OPTIONS")
        self.end_headers()

    def do_GET(self):
        if self.path == "/api/license/status":
            return json_response(self, {"ok": True, "activated": is_activated()}, 200)
        return super().do_GET()

    def do_POST(self):
        if self.path == "/api/license/activate":
            try:
                length = int(self.headers.get("Content-Length", "0"))
                raw = self.rfile.read(length) if length > 0 else b"{}"
                body = json.loads(raw.decode("utf-8", errors="ignore") or "{}")
                license_key = (body.get("licenseKey") or "").strip()

                if not license_key:
                    return json_response(self, {"ok": False, "error": "Missing licenseKey"}, 400)

                if is_activated():
                    return json_response(self, {"ok": True, "status": "already_activated"}, 200)

                data = gumroad_verify(license_key)
                if not data.get("success"):
                    msg = data.get("message") or "Invalid license key"
                    if VERBOSE_LOGGING:
                        log("GUMROAD VERIFY FAIL:\n" + json.dumps(data))
                    return json_response(self, {"ok": False, "error": msg}, 401)

                write_license({
                    "activated": True,
                    "licenseKey": license_key,
                    "activatedAt": int(time.time() * 1000),
                })

                return json_response(self, {"ok": True, "status": "activated"}, 200)

            except urllib.error.HTTPError as e:
                try:
                    detail = e.read().decode("utf-8", errors="ignore")
                except Exception:
                    detail = ""
                # Log details for debugging, but don't show to user
                log(f"GUMROAD HTTPError: {e}\n{detail}")
                return json_response(self, {"ok": False, "error": "Activation failed."}, 502)

            except Exception:
                log("ACTIVATE ERROR:\n" + traceback.format_exc())
                return json_response(self, {"ok": False, "error": "Activation failed."}, 500)

        return super().do_POST()

def run_server():
    try:
        print("Poker Clock starting...")
        log("\n--- START ---")
        base = get_base_dir()
        app_dir = os.path.join(base, "app")
        log(f"Base dir: {base}")
        log(f"App dir:  {app_dir}")
        log(f"Activated (local): {is_activated()}")

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

        # Small delay so browser open isn't "too fast"
        time.sleep(0.6)

        # Self-test
        try:
            urllib.request.urlopen(url, timeout=2).read(64)
            log("SELFTEST: OK")
        except Exception:
            log("SELFTEST FAILED:\n" + traceback.format_exc())
            alert_windows("Poker Clock started but failed to serve the page.\n\nSee pokerclock-debug.log in AppData.")

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

        # Keep process alive until user closes console window.
        while True:
            time.sleep(0.5)

    except Exception:
        log("FATAL:\n" + traceback.format_exc())
        alert_windows("Poker Clock failed to start.\n\nSee pokerclock-debug.log in AppData.")
        return

if __name__ == "__main__":
    run_server()
'@ | Set-Content -Encoding UTF8 $ServerPy

# --- 5) Build EXE via PyInstaller ---
Write-Host "5) Building EXE with PyInstaller..." -ForegroundColor Cyan
Push-Location $LauncherWork

python -m pip show pyinstaller | Out-Null

if (!(Test-Path (Join-Path $LauncherWork "pokerclock.ico"))) {
  throw "Icon file not found in launcher work folder."
}

if (Test-Path (Join-Path $LauncherWork "dist")) { Remove-Item -Recurse -Force (Join-Path $LauncherWork "dist") }
if (Test-Path (Join-Path $LauncherWork "build")) { Remove-Item -Recurse -Force (Join-Path $LauncherWork "build") }
Get-ChildItem -Path $LauncherWork -Filter "*.spec" -ErrorAction SilentlyContinue | Remove-Item -Force -ErrorAction SilentlyContinue

# Build options aimed at smaller EXE while keeping console:
# - --console: keep the window so closing it ends the process
# - --strip: strip symbols where possible
# - exclude Tkinter/Tk: common bloat, not needed for this app
$PyArgs = @(
  "--onefile",
  "--console",
  "--strip",
  "--name", "PokerClock",
  "--icon", "pokerclock.ico",
  "--distpath", (Join-Path $LauncherWork "dist"),
  "--workpath", (Join-Path $LauncherWork "build"),
  "--specpath", $LauncherWork,
  "--exclude-module", "tkinter",
  "--exclude-module", "tcl",
  "--exclude-module", "tk"
) + @("server.py")

python -m PyInstaller @PyArgs

if ($LASTEXITCODE -ne 0) {
  throw "PyInstaller failed (exit code $LASTEXITCODE). Scroll up to see the error output."
}

Write-Host "PyInstaller dist contents:" -ForegroundColor Yellow
Get-ChildItem -Path (Join-Path $LauncherWork "dist") -Force | Format-Table -AutoSize

Pop-Location

$BuiltExe = Join-Path $LauncherWork "dist\PokerClock.exe"
if (!(Test-Path $BuiltExe)) {
  throw "PyInstaller output not found: $BuiltExe"
}

# --- 6) Copy EXE into Release root (next to app folder) ---
Write-Host "6) Copying EXE into release folder..." -ForegroundColor Cyan
Copy-Item -Force $BuiltExe (Join-Path $ReleaseRoot $ExeName)

# --- 6b) Copy docs into release folder ---
Write-Host "6b) Copying docs into release folder..." -ForegroundColor Cyan
foreach ($d in $DocsToShip) {
  $src = Join-Path $RepoRoot $d
  if (!(Test-Path $src)) { throw "Missing required doc: $src" }
  Copy-Item -Force $src (Join-Path $ReleaseRoot $d)
}

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