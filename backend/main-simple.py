from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from dotenv import load_dotenv
import os
import random
import asyncio
from typing import List, Dict, Any
from pydantic import BaseModel

# Load environment variables
load_dotenv()

# Create FastAPI app
app = FastAPI(
    title="Doma Advisor API",
    description="AI-driven Domain Investment Advisor API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class DomainScore(BaseModel):
    domain: str
    score: float
    valuation: int
    traits: Dict[str, Any]
    reasoning: str

class MarketTrend(BaseModel):
    tld: str
    volume_24h: int
    price_change_24h: float
    trending_keywords: List[str]
    market_sentiment: str

class Recommendation(BaseModel):
    domain: str
    action: str
    confidence: float
    reasoning: str
    expected_return: float
    risk_level: str
    price_target: int

class Portfolio(BaseModel):
    user_id: str
    total_value: int
    total_domains: int
    performance_24h: float
    performance_7d: float
    performance_30d: float
    domains: List[Dict[str, Any]]

class DomainTradeRequest(BaseModel):
    action: str
    domain: str
    wallet_address: str
    price: int

# Mock data
MOCK_DOMAINS = [
    "crypto.eth", "nft.dao", "defi.crypto", "web3.eth", "ai.crypto",
    "metaverse.nft", "gaming.eth", "finance.dao", "tech.crypto", "art.nft"
]

@app.get("/")
async def root():
    return {
        "message": "Welcome to Doma Advisor API",
        "version": "1.0.0",
        "docs": "/docs",
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "doma-advisor-api"}

@app.get("/api/score", response_model=DomainScore)
async def get_domain_score(domain: str):
    """Get domain score and valuation."""
    # Simple scoring algorithm
    score = random.uniform(30, 95)
    valuation = int(score * 1000)  # $1 per point
    
    traits = {
        "length": len(domain.split('.')[0]),
        "tld": domain.split('.')[-1],
        "keyword_value": random.uniform(0.1, 0.9),
        "rarity": random.uniform(0.1, 0.9),
        "on_chain_activity": random.uniform(0.1, 0.9)
    }
    
    reasoning = f"Domain {domain} shows {score:.1f}/100 score based on length, TLD rarity, and keyword value."
    
    return DomainScore(
        domain=domain,
        score=score,
        valuation=valuation,
        traits=traits,
        reasoning=reasoning
    )

@app.get("/api/trends", response_model=List[MarketTrend])
async def get_market_trends(category: str = None, limit: int = 10):
    """Get market trends and analysis."""
    trends = [
        MarketTrend(
            tld="eth",
            volume_24h=50000000000000000000,
            price_change_24h=12.5,
            trending_keywords=["crypto", "web3", "defi"],
            market_sentiment="bullish"
        ),
        MarketTrend(
            tld="dao",
            volume_24h=30000000000000000000,
            price_change_24h=8.2,
            trending_keywords=["governance", "voting"],
            market_sentiment="bullish"
        ),
        MarketTrend(
            tld="crypto",
            volume_24h=40000000000000000000,
            price_change_24h=-2.1,
            trending_keywords=["bitcoin", "ethereum"],
            market_sentiment="neutral"
        ),
        MarketTrend(
            tld="nft",
            volume_24h=25000000000000000000,
            price_change_24h=-5.8,
            trending_keywords=["art", "collectibles"],
            market_sentiment="bearish"
        ),
        MarketTrend(
            tld="ai",
            volume_24h=35000000000000000000,
            price_change_24h=18.7,
            trending_keywords=["machine", "learning"],
            market_sentiment="bullish"
        )
    ]
    
    return trends[:limit]

@app.get("/api/recommendations", response_model=List[Recommendation])
async def get_recommendations(user_id: str, risk_profile: str = None, limit: int = 10):
    """Get personalized investment recommendations."""
    recommendations = [
        Recommendation(
            domain="web3.eth",
            action="buy",
            confidence=85,
            reasoning="Strong growth potential in Web3 sector",
            expected_return=25.5,
            risk_level="medium",
            price_target=3000000
        ),
        Recommendation(
            domain="ai.crypto",
            action="buy",
            confidence=78,
            reasoning="AI and crypto convergence trend",
            expected_return=18.2,
            risk_level="high",
            price_target=2500000
        ),
        Recommendation(
            domain="defi.dao",
            action="hold",
            confidence=65,
            reasoning="Current market volatility suggests holding",
            expected_return=5.0,
            risk_level="medium",
            price_target=1800000
        ),
        Recommendation(
            domain="nft.gallery",
            action="sell",
            confidence=72,
            reasoning="NFT market cooling, consider taking profits",
            expected_return=-8.5,
            risk_level="low",
            price_target=1200000
        )
    ]
    
    return recommendations[:limit]

@app.get("/api/portfolio/{user_id}", response_model=Portfolio)
async def get_portfolio(user_id: str):
    """Get user portfolio."""
    domains = [
        {
            "domain": "crypto.eth",
            "purchase_price": 2000000,
            "current_value": 2500000,
            "performance": 25.0,
            "score": 85,
            "status": "active",
            "purchase_date": "2024-01-10T15:30:00Z"
        },
        {
            "domain": "nft.dao",
            "purchase_price": 1500000,
            "current_value": 1800000,
            "performance": 20.0,
            "score": 78,
            "status": "active",
            "purchase_date": "2024-01-05T12:15:00Z"
        }
    ]
    
    return Portfolio(
        user_id=user_id,
        total_value=4300000,
        total_domains=2,
        performance_24h=2.5,
        performance_7d=8.7,
        performance_30d=15.2,
        domains=domains
    )

@app.get("/api/doma/trending")
async def get_trending_domains(limit: int = 20):
    """Get trending domains from Doma Protocol."""
    trending = [
        {
            "name": "crypto.eth",
            "price": 5000000000000000000,
            "volume_24h": 10000000000000000000,
            "price_change_24h": 15.5,
            "owner": "0x1234567890abcdef1234567890abcdef12345678"
        },
        {
            "name": "nft.dao",
            "price": 3000000000000000000,
            "volume_24h": 8000000000000000000,
            "price_change_24h": 8.2,
            "owner": "0xabcdef1234567890abcdef1234567890abcdef12"
        }
    ]
    
    return trending[:limit]

@app.post("/api/trade")
async def execute_trade(request: DomainTradeRequest):
    """Execute a domain trade (buy or sell)."""
    import hashlib
    import time
    
    # Simulate transaction processing
    await asyncio.sleep(0.5)
    
    # Generate mock transaction hash
    tx_data = f"{request.domain}{request.wallet_address}{request.price}{int(time.time())}"
    transaction_hash = f"0x{hashlib.md5(tx_data.encode()).hexdigest()[:16]}"
    
    return {
        "success": True,
        "transaction_hash": transaction_hash,
        "message": f"Domain {request.action} initiated successfully",
        "domain": request.domain,
        "price": request.price,
        "wallet_address": request.wallet_address
    }

@app.post("/api/doma/buy")
async def buy_domain(request: DomainTradeRequest):
    """Buy a domain on Doma Protocol."""
    if request.action != "buy":
        return {"success": False, "error": "Invalid action for buy endpoint"}
    
    return await execute_trade(request)

@app.post("/api/doma/sell")
async def sell_domain(request: DomainTradeRequest):
    """Sell a domain on Doma Protocol."""
    if request.action != "sell":
        return {"success": False, "error": "Invalid action for sell endpoint"}
    
    return await execute_trade(request)

if __name__ == "__main__":
    uvicorn.run(
        "main-simple:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info",
    )
