# 🚀 Quick Start Guide - Doma Advisor

Get the AI-driven Domain Investment Advisor up and running in minutes!

## Prerequisites

- **Docker** and **Docker Compose** installed
- **Node.js 18+** (for local development)
- **Python 3.9+** (for local development)
- **MetaMask** or **WalletConnect** wallet

## 🏃‍♂️ Quick Start (Docker)

1. **Clone and setup**:
   ```bash
   git clone <repository-url>
   cd Doma2
   ./setup.sh
   ```

2. **Access the platform**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

3. **Connect your wallet** and start trading!

## 🛠️ Manual Setup

### Frontend (Next.js)
```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

### Backend (FastAPI)
```bash
cd backend
pip install -r requirements.txt
cp env.example .env
uvicorn main:app --reload
```

### Database
```bash
# Install PostgreSQL
sudo apt install postgresql postgresql-contrib

# Create database
sudo -u postgres createdb doma_advisor
sudo -u postgres createuser doma_user
sudo -u postgres psql -c "ALTER USER doma_user PASSWORD 'doma_password';"
```

## 🎯 Key Features

### ✅ Implemented
- **Wallet Connection**: MetaMask/WalletConnect integration
- **Domain Scoring**: AI-powered domain valuation
- **Portfolio Management**: Track your domain investments
- **Market Trends**: Real-time market analysis
- **AI Recommendations**: Buy/Sell/Hold suggestions
- **Responsive UI**: Modern, mobile-friendly interface
- **Dark/Light Mode**: Theme switching
- **Real-time Data**: Live portfolio updates

### 🔄 Mock Data (For Demo)
- Domain valuations and scores
- Market trends and sentiment
- Portfolio performance
- Trading recommendations
- Blockchain transactions

## 🏗️ Architecture

```
Frontend (Next.js) ↔ Backend (FastAPI) ↔ AI Engine ↔ Doma Protocol ↔ Database
```

- **Frontend**: React with TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: FastAPI with SQLAlchemy, JWT auth
- **AI**: Domain scoring and recommendation engine
- **Blockchain**: Doma Protocol integration (simulated)
- **Database**: PostgreSQL with Redis caching

## 🔧 Configuration

### Environment Variables

**Frontend** (`frontend/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_DOMA_RPC_URL=https://testnet.doma.io
```

**Backend** (`backend/.env`):
```env
DATABASE_URL=postgresql://doma_user:doma_password@localhost/doma_advisor
SECRET_KEY=your-secret-key
OPENAI_API_KEY=your-openai-key
DOMA_PRIVATE_KEY=your-doma-key
```

## 🧪 Testing

### Frontend Tests
```bash
cd frontend
npm run test
```

### Backend Tests
```bash
cd backend
pytest
```

### API Testing
```bash
# Test domain scoring
curl "http://localhost:8000/api/score?domain=example.com"

# Test market trends
curl "http://localhost:8000/api/trends"

# Test recommendations
curl "http://localhost:8000/api/recommendations?user_id=123"
```

## 🚀 Deployment

### Production Deployment
```bash
# Build production images
docker-compose -f docker-compose.prod.yml up --build -d

# Or deploy to cloud platforms
# Frontend: Vercel
# Backend: Render/Heroku
# Database: Supabase/AWS RDS
```

## 📊 Monitoring

- **Health Checks**: `/health` endpoints
- **Logs**: `docker-compose logs -f`
- **Metrics**: Built-in FastAPI metrics
- **Error Tracking**: Structured logging

## 🔒 Security

- **JWT Authentication**: Wallet-based auth
- **CORS Protection**: Configured origins
- **Input Validation**: Pydantic schemas
- **Rate Limiting**: API protection
- **HTTPS**: Production requirement

## 🆘 Troubleshooting

### Common Issues

1. **Port conflicts**: Change ports in `docker-compose.yml`
2. **Database connection**: Check PostgreSQL is running
3. **Wallet connection**: Ensure MetaMask is installed
4. **API errors**: Check backend logs

### Debug Commands
```bash
# View all logs
docker-compose logs -f

# Restart services
docker-compose restart

# Check service status
docker-compose ps

# Access database
docker-compose exec postgres psql -U doma_user -d doma_advisor
```

## 📚 Next Steps

1. **Customize AI Models**: Enhance domain scoring algorithms
2. **Add Real Blockchain**: Integrate actual Doma Protocol
3. **Advanced Analytics**: Portfolio optimization tools
4. **Social Features**: Community and sharing
5. **Mobile App**: React Native version

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

---

**Ready to start trading domains?** 🚀

Open http://localhost:3000 and connect your wallet!
