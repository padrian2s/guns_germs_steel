#!/bin/bash
# Guns, Germs, and Steel - Interactive Study Guide
# Starts a local HTTP server to view the study guide

cd "$(dirname "$0")"

echo "================================"
echo "🚀 Starting Guns, Germs, and Steel"
echo "   Interactive Study Guide"
echo "================================"
echo ""
echo "📖 Open your browser and visit:"
echo "   http://localhost:8000"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

python3 -m http.server 8000
