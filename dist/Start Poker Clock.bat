@echo off
setlocal

REM Start a tiny web server and open the app in your default browser.

REM Pick a port
set PORT=8000

REM Try python launcher first (Windows)
where py >nul 2>nul
if %ERRORLEVEL%==0 (
  start "" http://localhost:%PORT%/
  py -m http.server %PORT% >nul
  goto :eof
)

REM Try python
where python >nul 2>nul
if %ERRORLEVEL%==0 (
  start "" http://localhost:%PORT%/
  python -m http.server %PORT% >nul
  goto :eof
)

echo.
echo Python is not installed (or not on PATH).
echo To run Poker Clock:
echo 1) Install Python from python.org (check "Add python to PATH")
echo 2) Re-run this file.
echo.
pause