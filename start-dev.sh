#!/bin/bash

# Kill any existing processes on ports 5005, 5002, and 3000
echo "Killing any existing processes on ports 5005, 5002, and 3000..."
lsof -ti:5005 | xargs kill -9 2>/dev/null
lsof -ti:5002 | xargs kill -9 2>/dev/null
lsof -ti:3000 | xargs kill -9 2>/dev/null

# Ensure environment variables are properly loaded
ENV_FILE="$(dirname "$0")/.env.local"
if [ -f "$ENV_FILE" ]; then
  echo "Loading environment variables from $ENV_FILE"
  export $(grep -v '^#' "$ENV_FILE" | xargs)
else
  echo "Warning: .env.local file not found!"
fi

# Verify Supabase environment variables
if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_KEY" ]; then
  echo "Warning: Supabase environment variables are missing or empty!"
  echo "SUPABASE_URL: ${SUPABASE_URL:-Not set}"
  echo "SUPABASE_SERVICE_KEY: ${SUPABASE_SERVICE_KEY:+Set (key hidden)}"
  echo "SUPABASE_SERVICE_KEY: ${SUPABASE_SERVICE_KEY:-Not set}"
fi

# Start the server in the background
echo "Starting server on port 5005..."
cd "$(dirname "$0")"
PORT=5005 NODE_ENV=development npm run dev &
SERVER_PID=$!

# Wait for the server to start
echo "Waiting for server to start..."
sleep 5

# Verify server is running
if ! curl -s http://localhost:5005/api/health > /dev/null; then
  echo "Warning: Server health check failed. Server may not be running properly."
else
  echo "Server health check passed."
  # Display Supabase connection status
  HEALTH=$(curl -s http://localhost:5005/api/health)
  echo "Server health: $HEALTH"
fi

# Start the client in a new terminal
echo "Starting client on port 3000..."
cd "$(dirname "$0")/client"
npm run dev &
CLIENT_PID=$!

# Function to handle script termination
cleanup() {
  echo "Stopping server and client..."
  kill $SERVER_PID 2>/dev/null
  kill $CLIENT_PID 2>/dev/null
  exit 0
}

# Set up trap to catch termination signals
trap cleanup INT TERM

# Keep the script running
echo "Development environment is running. Press Ctrl+C to stop."
wait
