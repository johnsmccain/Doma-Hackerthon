from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime

class PortfolioCreate(BaseModel):
    user_id: str
    domains: List[str] = Field(default_factory=list)

class PortfolioDomainResponse(BaseModel):
    domain: str
    purchase_price: int
    current_value: int
    performance: float
    score: float
    status: str
    purchase_date: datetime

    class Config:
        from_attributes = True

class PortfolioResponse(BaseModel):
    user_id: str
    total_value: int
    total_domains: int
    performance_24h: float
    performance_7d: float
    performance_30d: float
    domains: List[PortfolioDomainResponse]

    class Config:
        from_attributes = True
