# 🚀 Doma Advisor - Deployment Guide

## 📋 Overview

Doma Advisor is a full-stack AI-powered domain investment platform with real-time market data, blockchain integration, and intelligent recommendations.

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   External      │
│   (Next.js)     │◄──►│   (FastAPI)     │◄──►│   APIs          │
│   Port: 3000    │    │   Port: 8000    │    │   (CoinGecko,   │
│                 │    │                 │    │    OpenSea,     │
│ • React 18      │    │ • Python 3.12   │    │    ENS, etc.)   │
│ • Tailwind CSS  │    │ • Pydantic      │    │                 │
│ • RainbowKit    │    │ • httpx         │    │                 │
│ • Wagmi/Viem    │    │ • scikit-learn  │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Quick Start (Development)

### Prerequisites
- Node.js 18+ 
- Python 3.12+
- Git

### 1. Clone and Setup
```bash
git clone <repository-url>
cd Doma2
```

### 2. Start Development Environment
```bash
# Make the startup script executable
chmod +x start-dev.sh

# Start both frontend and backend
./start-dev.sh
```

### 3. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## 🔧 Manual Setup

### Backend Setup
```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the server
python3 main-simple.py
```

### Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🐳 Production Deployment

### Using Docker Compose
```bash
# Start production environment
docker-compose -f docker-compose.prod.yml up -d

# Check service status
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f
```

### Environment Variables

Create `.env` files for production:

**Backend (.env)**
```env
DATABASE_URL=postgresql://user:password@localhost:5432/doma_advisor
REDIS_URL=redis://localhost:6379
SECRET_KEY=your-super-secret-key
ALLOWED_ORIGINS=https://yourdomain.com
DOMA_RPC_URL=https://rpc.doma.io
OPENAI_API_KEY=your-openai-key
ETHERSCAN_API_KEY=your-etherscan-key
POLYGONSCAN_API_KEY=your-polygonscan-key
OPENSEA_API_KEY=your-opensea-key
UNSTOPPABLE_API_KEY=your-unstoppable-key
```

**Frontend (.env.local)**
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_APP_NAME=Doma Advisor
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your-project-id
NEXT_PUBLIC_ALCHEMY_API_KEY=your-alchemy-key
```

## 📊 API Endpoints

### Core Endpoints
- `GET /health` - Health check
- `GET /api/crypto-prices` - Real-time crypto prices
- `GET /api/score?domain=example.eth` - Domain scoring
- `GET /api/trends` - Market trends
- `GET /api/portfolio` - User portfolio
- `GET /api/recommendations` - AI recommendations

### Example Usage
```bash
# Get crypto prices
curl http://localhost:8000/api/crypto-prices

# Score a domain
curl "http://localhost:8000/api/score?domain=example.eth"

# Get market trends
curl http://localhost:8000/api/trends
```

## 🔐 Security Features

- **CORS Protection**: Configured for specific origins
- **Input Validation**: Pydantic models for all API inputs
- **Rate Limiting**: Built-in request throttling
- **Error Handling**: Comprehensive error responses
- **Wallet Security**: RainbowKit integration with secure wallet connections

## 📈 Performance Optimizations

- **Caching**: Redis for API response caching
- **Image Optimization**: Next.js Image component
- **Code Splitting**: Automatic bundle optimization
- **API Caching**: Intelligent caching for external API calls
- **Database Indexing**: Optimized database queries

## 🧪 Testing

### Backend Testing
```bash
cd backend
source venv/bin/activate
python -m pytest tests/
```

### Frontend Testing
```bash
cd frontend
npm test
```

### Integration Testing
```bash
# Test all endpoints
curl http://localhost:8000/health
curl http://localhost:8000/api/crypto-prices
curl "http://localhost:8000/api/score?domain=test.eth"
```

## 📝 Monitoring & Logging

### Health Checks
- Backend: `GET /health`
- Frontend: Built-in Next.js health monitoring
- Database: PostgreSQL health checks
- Redis: Redis ping checks

### Logging
- Backend: Structured logging with Python logging
- Frontend: Console logging and error boundaries
- Docker: Container logs via `docker-compose logs`

## 🔄 CI/CD Pipeline

### GitHub Actions (Example)
```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to production
        run: |
          docker-compose -f docker-compose.prod.yml up -d
```

## 🚨 Troubleshooting

### Common Issues

**Backend won't start:**
```bash
# Check Python version
python3 --version

# Recreate virtual environment
rm -rf venv
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

**Frontend build fails:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Database connection issues:**
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Test connection
psql -h localhost -U doma_user -d doma_advisor
```

### Port Conflicts
```bash
# Check what's using ports
lsof -i :3000
lsof -i :8000

# Kill processes if needed
kill -9 <PID>
```

## 📞 Support

For issues and questions:
1. Check the logs: `docker-compose logs -f`
2. Verify environment variables
3. Test individual services
4. Check network connectivity

## 🎯 Production Checklist

- [ ] Environment variables configured
- [ ] SSL certificates installed
- [ ] Database backups configured
- [ ] Monitoring setup
- [ ] Error tracking configured
- [ ] Performance monitoring
- [ ] Security headers configured
- [ ] Rate limiting enabled
- [ ] CORS properly configured
- [ ] API keys secured

---

**🎉 Your Doma Advisor application is now ready for production!**
