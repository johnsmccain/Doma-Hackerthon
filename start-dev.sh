#!/bin/bash

# Doma Advisor Development Startup Script
echo "🚀 Starting Doma Advisor Development Environment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check if port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo -e "${YELLOW}⚠️  Port $1 is already in use${NC}"
        return 1
    else
        echo -e "${GREEN}✅ Port $1 is available${NC}"
        return 0
    fi
}

# Function to wait for service to be ready
wait_for_service() {
    local url=$1
    local service_name=$2
    local max_attempts=30
    local attempt=1
    
    echo -e "${BLUE}⏳ Waiting for $service_name to be ready...${NC}"
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s "$url" > /dev/null 2>&1; then
            echo -e "${GREEN}✅ $service_name is ready!${NC}"
            return 0
        fi
        echo -e "${YELLOW}   Attempt $attempt/$max_attempts - waiting...${NC}"
        sleep 2
        attempt=$((attempt + 1))
    done
    
    echo -e "${RED}❌ $service_name failed to start after $max_attempts attempts${NC}"
    return 1
}

# Check if we're in the right directory
if [ ! -f "README.md" ] || [ ! -d "frontend" ] || [ ! -d "backend" ]; then
    echo -e "${RED}❌ Please run this script from the project root directory${NC}"
    exit 1
fi

echo -e "${BLUE}📋 Checking system requirements...${NC}"

# Check if Python 3 is available
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Python 3 is not installed${NC}"
    exit 1
fi

# Check if Node.js is available
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    exit 1
fi

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ All system requirements met${NC}"

# Check ports
echo -e "${BLUE}🔍 Checking port availability...${NC}"
check_port 3000
check_port 8000

# Start Backend
echo -e "${BLUE}🔧 Starting Backend (FastAPI)...${NC}"
cd backend

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo -e "${YELLOW}⚠️  Virtual environment not found. Creating one...${NC}"
    python3 -m venv venv
fi

# Activate virtual environment and install dependencies
source venv/bin/activate
pip install -q -r requirements.txt 2>/dev/null || echo -e "${YELLOW}⚠️  requirements.txt not found, using existing packages${NC}"

# Start backend in background
echo -e "${BLUE}🚀 Starting FastAPI server on http://localhost:8000${NC}"
python3 main-simple.py &
BACKEND_PID=$!

# Go back to project root
cd ..

# Start Frontend
echo -e "${BLUE}🔧 Starting Frontend (Next.js)...${NC}"
cd frontend

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}⚠️  Installing frontend dependencies...${NC}"
    npm install
fi

# Start frontend in background
echo -e "${BLUE}🚀 Starting Next.js server on http://localhost:3000${NC}"
npm run dev &
FRONTEND_PID=$!

# Go back to project root
cd ..

# Wait for services to be ready
wait_for_service "http://localhost:8000/health" "Backend API"
wait_for_service "http://localhost:3000" "Frontend App"

# Display final status
echo -e "\n${GREEN}🎉 Doma Advisor Development Environment is Ready!${NC}"
echo -e "\n${BLUE}📊 Service Status:${NC}"
echo -e "  ${GREEN}✅ Backend API:${NC}  http://localhost:8000"
echo -e "  ${GREEN}✅ Frontend App:${NC} http://localhost:3000"
echo -e "  ${GREEN}✅ API Docs:${NC}     http://localhost:8000/docs"

echo -e "\n${BLUE}🔗 Key Endpoints:${NC}"
echo -e "  • Health Check:    http://localhost:8000/health"
echo -e "  • Crypto Prices:   http://localhost:8000/api/crypto-prices"
echo -e "  • Domain Score:    http://localhost:8000/api/score?domain=example.eth"
echo -e "  • Market Trends:   http://localhost:8000/api/trends"

echo -e "\n${BLUE}🛠️  Development Features:${NC}"
echo -e "  • Hot Reload:      Both frontend and backend support hot reloading"
echo -e "  • Real Data:       Live cryptocurrency prices from CoinGecko"
echo -e "  • Wallet Connect:  RainbowKit + MetaMask integration"
echo -e "  • AI Analysis:     Domain scoring and investment recommendations"

echo -e "\n${YELLOW}💡 To stop the services, press Ctrl+C or run: kill $BACKEND_PID $FRONTEND_PID${NC}"

# Keep script running
echo -e "\n${BLUE}🔄 Services are running... Press Ctrl+C to stop${NC}"
trap "echo -e '\n${YELLOW}🛑 Stopping services...${NC}'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0" INT

# Wait for user to stop
wait
