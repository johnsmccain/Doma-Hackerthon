from pydantic import BaseModel, Field
from typing import Dict, Any, Optional
from datetime import datetime

class DomainTraits(BaseModel):
    length: int
    tld: str
    keyword_value: float
    rarity: float
    on_chain_activity: float

class DomainScore(BaseModel):
    domain: str
    score: float = Field(..., ge=0, le=100)
    valuation: int  # in USD cents
    traits: DomainTraits
    reasoning: str

    class Config:
        from_attributes = True

class DomainResponse(BaseModel):
    id: int
    name: str
    tld: str
    score: float
    valuation: int
    owner: Optional[str] = None
    traits: Dict[str, Any]
    last_trade: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class DomainSearchRequest(BaseModel):
    domain: str = Field(..., min_length=1, max_length=253)

class DomainTradeRequest(BaseModel):
    action: str = Field(..., pattern="^(buy|sell)$")
    domain: str
    wallet_address: str
    price: int = Field(..., gt=0)  # in USD cents
