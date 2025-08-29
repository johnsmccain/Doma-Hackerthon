from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import enum
from app.core.database import Base

class PortfolioStatus(enum.Enum):
    ACTIVE = "active"
    SOLD = "sold"
    PENDING = "pending"

class Portfolio(Base):
    __tablename__ = "portfolios"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    total_value = Column(Integer, default=0)  # in USD cents
    total_domains = Column(Integer, default=0)
    performance_24h = Column(Float, default=0.0)
    performance_7d = Column(Float, default=0.0)
    performance_30d = Column(Float, default=0.0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    domains = relationship("PortfolioDomain", back_populates="portfolio")
    user = relationship("User")

class PortfolioDomain(Base):
    __tablename__ = "portfolio_domains"

    id = Column(Integer, primary_key=True, index=True)
    portfolio_id = Column(Integer, ForeignKey("portfolios.id"), nullable=False)
    domain_id = Column(Integer, ForeignKey("domains.id"), nullable=False)
    purchase_price = Column(Integer, nullable=False)  # in USD cents
    current_value = Column(Integer, default=0)  # in USD cents
    performance = Column(Float, default=0.0)
    status = Column(Enum(PortfolioStatus), default=PortfolioStatus.ACTIVE)
    purchase_date = Column(DateTime(timezone=True), server_default=func.now())
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    portfolio = relationship("Portfolio", back_populates="domains")
    domain = relationship("Domain")
