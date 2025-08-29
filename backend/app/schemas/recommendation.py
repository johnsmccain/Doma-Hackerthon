from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class RecommendationResponse(BaseModel):
    domain: str
    action: str = Field(..., pattern="^(buy|sell|hold)$")
    confidence: float = Field(..., ge=0, le=100)
    reasoning: str
    expected_return: float
    risk_level: str = Field(..., pattern="^(low|medium|high)$")
    price_target: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
