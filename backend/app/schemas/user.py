from pydantic import BaseModel, Field
from typing import Dict, Any, Optional
from datetime import datetime

class UserCreate(BaseModel):
    wallet_address: str = Field(..., min_length=42, max_length=42)
    risk_profile: str = Field(default="moderate", pattern="^(conservative|moderate|aggressive)$")
    budget: int = Field(default=0, ge=0)
    preferences: Dict[str, Any] = Field(default_factory=dict)

class UserUpdate(BaseModel):
    risk_profile: Optional[str] = Field(None, pattern="^(conservative|moderate|aggressive)$")
    budget: Optional[int] = Field(None, ge=0)
    preferences: Optional[Dict[str, Any]] = None

class UserResponse(BaseModel):
    id: int
    wallet_address: str
    risk_profile: str
    budget: int
    preferences: Dict[str, Any]
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
