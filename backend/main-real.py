from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from dotenv import load_dotenv
import os
import asyncio
from typing import List, Dict, Any, Optional
from pydantic import BaseModel
import logging

# Import our real data services
from app.services.blockchain_service import BlockchainService
from app.services.market_data_service import MarketDataService
from app.services.ai_recommendation_service import AIRecommendationService
from app.services.doma_integration import DomaIntegrationService

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="Doma Advisor API - Real Data",
    description="AI-driven Domain Investment Advisor API with real blockchain and market data",
    version="2.0.0",
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

# Initialize services
blockchain_service = BlockchainService()
market_data_service = MarketDataService()
ai_service = AIRecommendationService()
doma_service = DomaIntegrationService()

# Pydantic models
class DomainScore(BaseModel):
    domain: str
    score: float
    valuation: float
    traits: Dict[str, Any]
    reasoning: str
    risk_assessment: Dict[str, Any]
    market_analysis: Dict[str, Any]
    technical_analysis: Dict[str, Any]

class MarketTrend(BaseModel):
    tld: str
    domain: str
    volume_24h: float
    price_change_24h: float
    trending_keywords: List[str]
    market_sentiment: str
    source: str
    timestamp: str

class Recommendation(BaseModel):
    domain: str
    action: str
    confidence: float
    reasoning: str
    expected_return: float
    risk_level: str
    price_target: float
    analysis: Dict[str, Any]

class Portfolio(BaseModel):
    user_id: str
    total_value_usd: float
    total_domains: int
    performance_24h: float
    performance_7d: float
    performance_30d: float
    domains: List[Dict[str, Any]]

class DomainTradeRequest(BaseModel):
    action: str
    domain: str
    wallet_address: str
    price: float

class UserProfile(BaseModel):
    risk_profile: str
    budget: float
    preferences: Dict[str, Any]

@app.get("/")
async def root():
    return {
        "message": "Welcome to Doma Advisor API - Real Data Edition",
        "version": "2.0.0",
        "docs": "/docs",
        "features": [
            "Real blockchain data integration",
            "Live market data from multiple sources",
            "AI-powered domain analysis",
            "Multi-chain support (Ethereum, Polygon, etc.)",
            "Real-time ENS and Unstoppable Domains data"
        ]
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy", 
        "service": "doma-advisor-api-real",
        "services": {
            "blockchain": "active",
            "market_data": "active",
            "ai_recommendations": "active",
            "doma_integration": "active"
        }
    }

@app.get("/api/score/{domain}", response_model=DomainScore)
async def get_domain_score(domain: str):
    """Get real domain score and valuation using blockchain data and AI analysis."""
    try:
        # Get domain info from blockchain
        domain_info = None
        
        if domain.endswith('.eth'):
            domain_info = await blockchain_service.get_ens_domain_info(domain)
        elif any(domain.endswith(suffix) for suffix in ['.crypto', '.nft', '.dao']):
            domain_info = await blockchain_service.get_unstoppable_domain_info(domain)
        
        if not domain_info:
            # Fallback to basic domain data
            domain_info = {
                "name": domain,
                "owner": None,
                "is_available": True,
                "chain": "unknown"
            }
        
        # Get market data
        market_data = await market_data_service.get_domain_market_data(domain)
        
        # Combine blockchain and market data
        combined_data = {**domain_info, **market_data}
        
        # Analyze domain using AI
        analysis = await ai_service.analyze_domain(combined_data)
        
        if "error" in analysis:
            raise HTTPException(status_code=500, detail=f"Analysis failed: {analysis['error']}")
        
        # Extract traits for response
        traits = {
            "length": len(domain.split('.')[0]) if '.' in domain else len(domain),
            "tld": domain.split('.')[-1] if '.' in domain else "unknown",
            "keyword_value": combined_data.get("keyword_value", 0.5),
            "rarity": combined_data.get("rarity", 0.5),
            "on_chain_activity": combined_data.get("on_chain_activity", 0.5),
            "chain": combined_data.get("chain", "unknown"),
            "owner": combined_data.get("owner"),
            "is_available": combined_data.get("is_available", True)
        }
        
        return DomainScore(
            domain=domain,
            score=analysis.get("score", 50),
            valuation=analysis.get("valuation", 1000),
            traits=traits,
            reasoning=analysis.get("recommendations", ["Analysis completed"])[0] if analysis.get("recommendations") else "Analysis completed",
            risk_assessment=analysis.get("risk_assessment", {}),
            market_analysis=analysis.get("market_analysis", {}),
            technical_analysis=analysis.get("technical_analysis", {})
        )
        
    except Exception as e:
        logger.error(f"Error getting domain score for {domain}: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/trends", response_model=List[MarketTrend])
async def get_market_trends(category: str = None, limit: int = 10):
    """Get real market trends from blockchain and market data sources."""
    try:
        trends = await market_data_service.get_market_trends(category, limit)
        
        # Convert to response model format
        response_trends = []
        for trend in trends:
            response_trends.append(MarketTrend(
                tld=trend.get("tld", "unknown"),
                domain=trend.get("domain", "Unknown"),
                volume_24h=trend.get("volume_24h", 0),
                price_change_24h=trend.get("price_change_24h", 0),
                trending_keywords=trend.get("trending_keywords", []),
                market_sentiment=trend.get("market_sentiment", "neutral"),
                source=trend.get("source", "unknown"),
                timestamp=trend.get("timestamp", "")
            ))
        
        return response_trends
        
    except Exception as e:
        logger.error(f"Error getting market trends: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/recommendations", response_model=List[Recommendation])
async def get_recommendations(
    user_id: str, 
    risk_profile: str = "moderate", 
    budget: float = 10000,
    limit: int = 10
):
    """Get personalized investment recommendations using real data and AI analysis."""
    try:
        # Create user profile
        user_profile = {
            "risk_profile": risk_profile,
            "budget": budget,
            "preferences": {
                "categories": ["eth", "crypto", "nft", "dao"],
                "min_score": 60,
                "max_risk": "medium"
            }
        }
        
        # Get trending domains as candidate pool
        market_data = await market_data_service.get_market_trends(limit=limit*2)
        
        # Get AI recommendations
        recommendations = await ai_service.get_investment_recommendations(
            user_profile, market_data, limit
        )
        
        # Convert to response model format
        response_recommendations = []
        for rec in recommendations:
            response_recommendations.append(Recommendation(
                domain=rec.get("domain", "Unknown"),
                action=rec.get("action", "hold"),
                confidence=rec.get("confidence", 50),
                reasoning=rec.get("reasoning", "Analysis completed"),
                expected_return=rec.get("expected_return", 0),
                risk_level=rec.get("risk_level", "medium"),
                price_target=rec.get("price_target", 0),
                analysis=rec.get("analysis", {})
            ))
        
        return response_recommendations
        
    except Exception as e:
        logger.error(f"Error getting recommendations: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/portfolio/{user_id}", response_model=Portfolio)
async def get_portfolio(user_id: str):
    """Get user portfolio with real market data."""
    try:
        # In a real app, this would fetch from database
        # For now, use sample domains
        sample_domains = ["crypto.eth", "nft.dao", "defi.crypto"]
        
        # Get portfolio performance using real market data
        portfolio_data = await market_data_service.get_portfolio_performance(sample_domains)
        
        if "error" in portfolio_data:
            raise HTTPException(status_code=500, detail=portfolio_data["error"])
        
        return Portfolio(
            user_id=user_id,
            total_value_usd=portfolio_data.get("total_value_usd", 0),
            total_domains=portfolio_data.get("total_domains", 0),
            performance_24h=0,  # Would need historical data
            performance_7d=0,   # Would need historical data
            performance_30d=0,  # Would need historical data
            domains=portfolio_data.get("domains", [])
        )
        
    except Exception as e:
        logger.error(f"Error getting portfolio for {user_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/doma/trending")
async def get_trending_domains(limit: int = 20):
    """Get trending domains from Doma Protocol and other sources."""
    try:
        # Get trending from multiple sources
        trending = []
        
        # Get ENS trending
        ens_data = await market_data_service.get_ens_market_data(limit // 2)
        if ens_data and "recent_sales" in ens_data:
            for sale in ens_data["recent_sales"][:limit // 2]:
                trending.append({
                    "name": sale["domain"],
                    "price": sale["price"],
                    "price_usd": sale["price_usd"],
                    "volume_24h": sale.get("price_usd", 0),
                    "price_change_24h": 0,  # Would need historical data
                    "owner": sale.get("buyer"),
                    "source": "opensea",
                    "chain": "ethereum"
                })
        
        # Get Unstoppable trending
        unstoppable_data = await market_data_service.get_unstoppable_market_data(limit // 2)
        if unstoppable_data:
            for item in unstoppable_data[:limit // 2]:
                trending.append({
                    "name": item.get("name", ""),
                    "price": item.get("price", 0),
                    "price_usd": item.get("price_usd", 0),
                    "volume_24h": item.get("volume_24h", 0),
                    "price_change_24h": item.get("price_change_24h", 0),
                    "owner": item.get("owner"),
                    "source": "unstoppable",
                    "chain": "polygon"
                })
        
        # Sort by volume and return top results
        trending.sort(key=lambda x: x.get("volume_24h", 0), reverse=True)
        return trending[:limit]
        
    except Exception as e:
        logger.error(f"Error getting trending domains: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/trade")
async def execute_trade(request: DomainTradeRequest):
    """Execute a domain trade using real blockchain integration."""
    try:
        if request.action == "buy":
            result = await doma_service.buy_domain(
                request.domain, 
                request.wallet_address, 
                int(request.price * 1e18)  # Convert to wei
            )
        elif request.action == "sell":
            result = await doma_service.sell_domain(
                request.domain, 
                request.wallet_address, 
                int(request.price * 1e18)  # Convert to wei
            )
        else:
            raise HTTPException(status_code=400, detail="Invalid action")
        
        return {
            "success": result.get("success", False),
            "transaction_hash": result.get("transaction_hash"),
            "message": f"Domain {request.action} initiated successfully",
            "domain": request.domain,
            "price": request.price,
            "wallet_address": request.wallet_address,
            "block_number": result.get("block_number"),
            "gas_used": result.get("gas_used")
        }
        
    except Exception as e:
        logger.error(f"Error executing trade: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/blockchain/ens/{domain}")
async def get_ens_domain(domain: str):
    """Get real ENS domain information from Ethereum blockchain."""
    try:
        if not domain.endswith('.eth'):
            domain = f"{domain}.eth"
        
        domain_info = await blockchain_service.get_ens_domain_info(domain)
        if not domain_info:
            raise HTTPException(status_code=404, detail="Domain not found")
        
        return domain_info
        
    except Exception as e:
        logger.error(f"Error getting ENS domain {domain}: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/blockchain/unstoppable/{domain}")
async def get_unstoppable_domain(domain: str):
    """Get real Unstoppable Domains information from Polygon blockchain."""
    try:
        domain_info = await blockchain_service.get_unstoppable_domain_info(domain)
        if not domain_info:
            raise HTTPException(status_code=404, detail="Domain not found")
        
        return domain_info
        
    except Exception as e:
        logger.error(f"Error getting Unstoppable domain {domain}: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/market/ens")
async def get_ens_market_data(limit: int = 20):
    """Get real ENS market data from OpenSea."""
    try:
        market_data = await market_data_service.get_ens_market_data(limit)
        return market_data
        
    except Exception as e:
        logger.error(f"Error getting ENS market data: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/market/crypto-prices")
async def get_crypto_prices(symbols: str = "ETH,MATIC,OP,ARB"):
    """Get real-time cryptocurrency prices."""
    try:
        symbol_list = [s.strip() for s in symbols.split(",")]
        prices = await market_data_service.get_crypto_prices(symbol_list)
        return prices
        
    except Exception as e:
        logger.error(f"Error getting crypto prices: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/ai/analyze/{domain}")
async def analyze_domain_ai(domain: str):
    """Get comprehensive AI analysis for a domain."""
    try:
        # Get domain data
        domain_info = None
        if domain.endswith('.eth'):
            domain_info = await blockchain_service.get_ens_domain_info(domain)
        elif any(domain.endswith(suffix) for suffix in ['.crypto', '.nft', '.dao']):
            domain_info = await blockchain_service.get_unstoppable_domain_info(domain)
        
        if not domain_info:
            domain_info = {"name": domain}
        
        # Get market data
        market_data = await market_data_service.get_domain_market_data(domain)
        
        # Combine data
        combined_data = {**domain_info, **market_data}
        
        # AI analysis
        analysis = await ai_service.analyze_domain(combined_data)
        
        if "error" in analysis:
            raise HTTPException(status_code=500, detail=analysis["error"])
        
        return analysis
        
    except Exception as e:
        logger.error(f"Error analyzing domain {domain}: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(
        "main-real:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info",
    )
