# 🚀 AI-Driven Domain Investment Advisor

A comprehensive platform for domain traders to manage portfolios, get AI-driven recommendations, and execute trades on the Doma Protocol.

## 🎯 Overview

This platform addresses the challenges faced by domain traders managing large portfolios (10K-1M+ domains) by providing:

- **AI-Powered Recommendations**: Buy/Sell/Hold suggestions with reasoning
- **Portfolio Management**: Real-time valuation and health scoring
- **Market Analysis**: Trending TLDs and keyword domains
- **On-Chain Trading**: Direct integration with Doma Protocol
- **Competition Platform**: Trading competitions with prize pools

## 🏗️ Architecture

```
Frontend (Next.js) ↔ Backend (FastAPI) ↔ AI Engine ↔ Doma Protocol ↔ Database
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.9+
- PostgreSQL
- MetaMask or WalletConnect

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd Doma2
```

2. **Install Frontend Dependencies**
```bash
cd frontend
npm install
```

3. **Install Backend Dependencies**
```bash
cd backend
pip install -r requirements.txt
```

4. **Set up Database**
```bash
# Create PostgreSQL database
createdb doma_advisor

# Run migrations
cd backend
alembic upgrade head
```

5. **Configure Environment Variables**
```bash
# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_DOMA_RPC_URL=https://testnet.doma.io

# Backend (.env)
DATABASE_URL=postgresql://user:password@localhost/doma_advisor
OPENAI_API_KEY=your_openai_key
DOMA_PRIVATE_KEY=your_doma_private_key
```

6. **Start Development Servers**
```bash
# Terminal 1 - Backend
cd backend
uvicorn main:app --reload

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## 📁 Project Structure

```
Doma2/
├── frontend/                 # Next.js 15 Dashboard
│   ├── app/                 # App Router
│   ├── components/          # Reusable UI components
│   ├── lib/                 # Utilities and configurations
│   └── public/              # Static assets
├── backend/                 # FastAPI Backend
│   ├── app/                 # Main application
│   ├── models/              # Database models
│   ├── services/            # Business logic
│   └── api/                 # API routes
├── blockchain/              # Doma Protocol Integration
│   ├── services/            # Blockchain services
│   └── contracts/           # Smart contract interactions
├── ai/                      # AI/ML Models
│   ├── scoring/             # Domain scoring engine
│   ├── recommendations/     # Recommendation engine
│   └── models/              # Trained models
├── docs/                    # Documentation
└── infrastructure/          # Deployment configs
```

## 🎨 Features

### Portfolio Dashboard
- Real-time portfolio valuation
- Domain health scoring
- Performance analytics
- Risk assessment

### AI Recommendations
- Personalized buy/sell/hold suggestions
- Risk-based filtering
- Category-specific recommendations
- Historical performance tracking

### Market Trends
- Trending TLDs analysis
- Keyword domain insights
- Volume and price movements
- Market sentiment indicators

### Trading Interface
- One-click domain transactions
- Wallet integration (MetaMask/WalletConnect)
- Transaction history
- Portfolio rebalancing

## 🔧 API Documentation

### Core Endpoints

#### Domain Scoring
```http
GET /api/score?domain=example.com
```

#### Market Trends
```http
GET /api/trends?category=tech&limit=10
```

#### Recommendations
```http
GET /api/recommendations?user_id=123&risk_profile=moderate
```

#### Portfolio Management
```http
POST /api/portfolio
{
  "user_id": "123",
  "domains": ["example.com", "test.io"]
}
```

### Blockchain Endpoints

#### Domain Information
```http
GET /api/doma/domain/example.com
```

#### Execute Trade
```http
POST /api/doma/trade
{
  "action": "buy",
  "domain": "example.com",
  "wallet_address": "0x...",
  "price": "1000000000000000000"
}
```

## 🧪 Testing

```bash
# Frontend tests
cd frontend
npm run test

# Backend tests
cd backend
pytest

# Integration tests
npm run test:integration
```

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd frontend
vercel --prod
```

### Backend (Render)
```bash
# Connect GitHub repository to Render
# Set environment variables
# Deploy automatically on push
```

### Database (Supabase)
```bash
# Create Supabase project
# Run migrations
# Update connection strings
```

## 📊 Monitoring

- **Application Metrics**: Response times, error rates
- **User Analytics**: Portfolio performance, recommendation accuracy
- **Blockchain Events**: Transaction success rates, gas costs
- **AI Model Performance**: Scoring accuracy, recommendation relevance

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

- **Documentation**: [docs/](docs/)
- **Issues**: GitHub Issues
- **Discord**: [Community Server](https://discord.gg/doma)

## 🔮 Roadmap

- [ ] Advanced AI models for domain valuation
- [ ] DeFi integration (lending, yield farming)
- [ ] Mobile app
- [ ] Social trading features
- [ ] Institutional tools
- [ ] Cross-chain domain trading
