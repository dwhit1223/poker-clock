#!/bin/bash

PORT=8000

cd "$(dirname "$0")"

echo "Starting Poker Clock..."

# Try python3 first (most common on Mac)
if command -v python3 &> /dev/null
then
    open "http://localhost:$PORT"
    python3 -m http.server $PORT
    exit
fi

# Try python
if command -v python &> /dev/null
then
    open "http://localhost:$PORT"
    python -m http.server $PORT
    exit
fi

echo ""
echo "Poker Clock requires Python."
echo ""
echo "Install Python from:"
echo "https://www.python.org/downloads/mac-osx/"
echo ""
echo "After installing, run this file again."
echo ""

read -p "Press Enter to exit..."