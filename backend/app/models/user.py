from sqlalchemy import Column, Integer, String, DateTime, JSON
from sqlalchemy.sql import func
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    wallet_address = Column(String, unique=True, index=True, nullable=False)
    risk_profile = Column(String, default="moderate")  # conservative, moderate, aggressive
    budget = Column(Integer, default=0)  # in USD cents
    preferences = Column(JSON, default={
        "categories": [],
        "min_score": 60,
        "max_risk": "medium"
    })
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
