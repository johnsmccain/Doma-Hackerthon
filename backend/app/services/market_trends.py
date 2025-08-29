from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
import random
from datetime import datetime, timedelta

class MarketTrendsService:
    def get_market_trends(
        self, 
        db: Session, 
        category: Optional[str] = None,
        limit: int = 10
    ) -> List[Dict[str, Any]]:
        """Get market trends and analysis."""
        # Mock market trends data
        trends = [
            {
                "tld": "eth",
                "volume_24h": 50000000000000000000,  # 50 ETH
                "price_change_24h": 12.5,
                "trending_keywords": ["crypto", "web3", "defi", "nft"],
                "market_sentiment": "bullish"
            },
            {
                "tld": "dao",
                "volume_24h": 30000000000000000000,  # 30 ETH
                "price_change_24h": 8.2,
                "trending_keywords": ["governance", "voting", "community"],
                "market_sentiment": "bullish"
            },
            {
                "tld": "crypto",
                "volume_24h": 40000000000000000000,  # 40 ETH
                "price_change_24h": -2.1,
                "trending_keywords": ["bitcoin", "ethereum", "altcoin"],
                "market_sentiment": "neutral"
            },
            {
                "tld": "nft",
                "volume_24h": 25000000000000000000,  # 25 ETH
                "price_change_24h": -5.8,
                "trending_keywords": ["art", "collectibles", "gaming"],
                "market_sentiment": "bearish"
            },
            {
                "tld": "ai",
                "volume_24h": 35000000000000000000,  # 35 ETH
                "price_change_24h": 18.7,
                "trending_keywords": ["machine", "learning", "automation"],
                "market_sentiment": "bullish"
            }
        ]
        
        # Filter by category if specified
        if category:
            if category == "tech":
                trends = [t for t in trends if t["tld"] in ["eth", "ai"]]
            elif category == "finance":
                trends = [t for t in trends if t["tld"] in ["dao", "crypto"]]
            elif category == "gaming":
                trends = [t for t in trends if t["tld"] in ["nft"]]
        
        return trends[:limit]

    def get_tld_trends(self, db: Session, limit: int = 20) -> List[Dict[str, Any]]:
        """Get trending TLDs."""
        # Mock TLD trends
        tld_trends = [
            {
                "tld": "eth",
                "total_volume": 150000000000000000000,  # 150 ETH
                "avg_price": 2000000000000000000,  # 2 ETH
                "growth_rate": 15.2,
                "market_cap": 5000000000000000000000,  # 5000 ETH
                "trending_score": 95
            },
            {
                "tld": "dao",
                "total_volume": 80000000000000000000,  # 80 ETH
                "avg_price": 1500000000000000000,  # 1.5 ETH
                "growth_rate": 12.8,
                "market_cap": 2000000000000000000000,  # 2000 ETH
                "trending_score": 87
            },
            {
                "tld": "crypto",
                "total_volume": 120000000000000000000,  # 120 ETH
                "avg_price": 1800000000000000000,  # 1.8 ETH
                "growth_rate": 8.5,
                "market_cap": 3000000000000000000000,  # 3000 ETH
                "trending_score": 72
            },
            {
                "tld": "nft",
                "total_volume": 60000000000000000000,  # 60 ETH
                "avg_price": 1200000000000000000,  # 1.2 ETH
                "growth_rate": -3.2,
                "market_cap": 1500000000000000000000,  # 1500 ETH
                "trending_score": 45
            },
            {
                "tld": "ai",
                "total_volume": 90000000000000000000,  # 90 ETH
                "avg_price": 2500000000000000000,  # 2.5 ETH
                "growth_rate": 22.1,
                "market_cap": 4000000000000000000000,  # 4000 ETH
                "trending_score": 98
            }
        ]
        
        # Sort by trending score
        tld_trends.sort(key=lambda x: x["trending_score"], reverse=True)
        
        return tld_trends[:limit]

    def get_trending_keywords(
        self, 
        db: Session, 
        tld: Optional[str] = None,
        limit: int = 20
    ) -> List[Dict[str, Any]]:
        """Get trending keywords."""
        # Mock trending keywords
        keywords = [
            {"keyword": "crypto", "tld": "eth", "volume": 5000000000000000000, "growth": 25.5},
            {"keyword": "web3", "tld": "eth", "volume": 4000000000000000000, "growth": 18.2},
            {"keyword": "defi", "tld": "eth", "volume": 3500000000000000000, "growth": 12.8},
            {"keyword": "nft", "tld": "nft", "volume": 3000000000000000000, "growth": -5.2},
            {"keyword": "dao", "tld": "dao", "volume": 2800000000000000000, "growth": 15.7},
            {"keyword": "ai", "tld": "ai", "volume": 4500000000000000000, "growth": 32.1},
            {"keyword": "machine", "tld": "ai", "volume": 2200000000000000000, "growth": 28.5},
            {"keyword": "learning", "tld": "ai", "volume": 1800000000000000000, "growth": 24.3},
            {"keyword": "governance", "tld": "dao", "volume": 1500000000000000000, "growth": 10.2},
            {"keyword": "voting", "tld": "dao", "volume": 1200000000000000000, "growth": 8.7}
        ]
        
        # Filter by TLD if specified
        if tld:
            keywords = [k for k in keywords if k["tld"] == tld]
        
        # Sort by volume
        keywords.sort(key=lambda x: x["volume"], reverse=True)
        
        return keywords[:limit]

    def get_market_sentiment(self, db: Session) -> Dict[str, Any]:
        """Get overall market sentiment."""
        # Mock market sentiment data
        sentiment = {
            "overall_sentiment": "bullish",
            "sentiment_score": 0.72,  # -1 to 1 scale
            "confidence": 0.85,
            "trending_up": ["eth", "dao", "ai"],
            "trending_down": ["nft"],
            "stable": ["crypto"],
            "market_indicators": {
                "total_volume_24h": 250000000000000000000,  # 250 ETH
                "avg_price_change": 8.5,
                "volatility_index": 0.35,
                "market_correlation": 0.68
            },
            "sector_analysis": {
                "tech": {"sentiment": "bullish", "growth": 18.2},
                "finance": {"sentiment": "neutral", "growth": 5.5},
                "gaming": {"sentiment": "bearish", "growth": -3.2},
                "ai": {"sentiment": "bullish", "growth": 25.8}
            }
        }
        
        return sentiment

    def get_market_forecast(self, db: Session, days: int = 30) -> Dict[str, Any]:
        """Get market forecast for the next N days."""
        # Mock market forecast
        forecast = {
            "prediction_period": f"{days} days",
            "overall_trend": "bullish",
            "confidence": 0.78,
            "key_factors": [
                "Increasing adoption of Web3 domains",
                "Growing AI sector demand",
                "Stabilizing crypto markets",
                "New TLD launches"
            ],
            "risk_factors": [
                "Market volatility",
                "Regulatory changes",
                "Economic uncertainty"
            ],
            "price_predictions": {
                "eth": {"current": 2.0, "predicted": 2.4, "confidence": 0.82},
                "dao": {"current": 1.5, "predicted": 1.8, "confidence": 0.75},
                "ai": {"current": 2.5, "predicted": 3.2, "confidence": 0.88},
                "crypto": {"current": 1.8, "predicted": 2.0, "confidence": 0.70},
                "nft": {"current": 1.2, "predicted": 1.1, "confidence": 0.65}
            }
        }
        
        return forecast
