from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Enum, Text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import enum
from app.core.database import Base

class RecommendationAction(enum.Enum):
    BUY = "buy"
    SELL = "sell"
    HOLD = "hold"

class RiskLevel(enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"

class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    domain_id = Column(Integer, ForeignKey("domains.id"), nullable=False)
    action = Column(Enum(RecommendationAction), nullable=False)
    confidence = Column(Float, nullable=False)  # 0-100
    reasoning = Column(Text, nullable=False)
    expected_return = Column(Float, default=0.0)  # percentage
    risk_level = Column(Enum(RiskLevel), default=RiskLevel.MEDIUM)
    price_target = Column(Integer, default=0)  # in USD cents
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    user = relationship("User")
    domain = relationship("Domain")
