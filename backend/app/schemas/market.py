from pydantic import BaseModel, Field
from typing import List, Dict, Any

class MarketTrendResponse(BaseModel):
    tld: str
    volume_24h: int
    price_change_24h: float
    trending_keywords: List[str]
    market_sentiment: str = Field(..., pattern="^(bullish|bearish|neutral)$")

    class Config:
        from_attributes = True
