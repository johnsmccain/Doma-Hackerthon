from sqlalchemy import Column, Integer, String, Float, DateTime, JSON
from sqlalchemy.sql import func
from app.core.database import Base

class Domain(Base):
    __tablename__ = "domains"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    tld = Column(String, index=True, nullable=False)
    score = Column(Float, default=0.0)
    valuation = Column(Integer, default=0)  # in USD cents
    owner = Column(String, index=True)
    traits = Column(JSON, default={
        "length": 0,
        "keyword_value": 0.0,
        "rarity": 0.0,
        "on_chain_activity": 0.0
    })
    last_trade = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
