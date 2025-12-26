#!/bin/bash

# Function to kill process running on a specific port
kill_port() {
    PORT=$1
    # specific to macOS/Linux
    PID=$(lsof -ti :$PORT)
    if [ -n "$PID" ]; then
        echo "⚠️  Port $PORT is in use by PID $PID. Killing it..."
        kill -9 $PID
        echo "✅  Port $PORT freed."
    else
        echo "✅  Port $PORT is free."
    fi
}

echo "=================================================="
echo "   Novela - Startup Script"
echo "=================================================="

# 1. Cleanup Ports
echo "Step 1: Checking and clearing ports..."
kill_port 8081 # Spring Boot Backend
kill_port 5173 # Vite Frontend

# 2. Start Database (Docker)
echo ""
echo "Step 2: Starting PostgreSQL Database..."
if ! docker info > /dev/null 2>&1; then
  echo "❌  Docker is not running. Please start Docker Desktop and try again."
  exit 1
fi

docker-compose up -d
echo "✅  Database container started."

# 3. Start Backend
echo ""
echo "Step 3: Starting Backend (Spring Boot)..."
# Set JAVA_HOME to OpenJDK 17 to match project configuration
export JAVA_HOME="/opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home"
cd backend
mvn spring-boot:run > ../backend.log 2>&1 &
BACKEND_PID=$!
echo "⏳  Backend starting in background (PID: $BACKEND_PID)..."
echo "    > Logs: tail -f backend.log"
cd ..

# 4. Start Frontend
echo ""
echo "Step 4: Starting Frontend (React)..."
cd frontend
npm run dev > ../frontend.log 2>&1 &
FRONTEND_PID=$!
echo "⏳  Frontend starting in background (PID: $FRONTEND_PID)..."
echo "    > Logs: tail -f frontend.log"
cd ..

echo ""
echo "=================================================="
echo "🚀  Application is running!"
echo "    - Backend: http://localhost:8081"
echo "    - Frontend: http://localhost:5173"
echo "    - Swagger: http://localhost:8081/swagger-ui/index.html"
echo ""
echo "    (Press Ctrl+C to stop everything)"
echo "=================================================="

# Helper function to cleanup background processes on exit
cleanup() {
    echo ""
    echo "🛑  Stopping services..."
    kill $BACKEND_PID
    kill $FRONTEND_PID
    exit
}

# Trap SIGINT (Ctrl+C) to run cleanup
trap cleanup SIGINT

# Keep script running to maintain logs/trap
wait
