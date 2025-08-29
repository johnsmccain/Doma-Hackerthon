from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional

from app.core.database import get_db
from app.models.user import User
from app.models.portfolio import Portfolio, PortfolioDomain
from app.services.auth import AuthService
from app.services.portfolio import PortfolioService

router = APIRouter()
auth_service = AuthService()
portfolio_service = PortfolioService()

class PortfolioCreateRequest(BaseModel):
    user_id: str
    domains: List[str]

class PortfolioResponse(BaseModel):
    user_id: str
    total_value: int
    total_domains: int
    performance_24h: float
    performance_7d: float
    performance_30d: float
    domains: List[dict]

@router.get("/{user_id}", response_model=PortfolioResponse)
async def get_portfolio(
    user_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(auth_service.get_current_user)
):
    """Get user portfolio."""
    try:
        portfolio = portfolio_service.get_user_portfolio(db, user_id)
        return portfolio
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching portfolio: {str(e)}")

@router.post("/", response_model=PortfolioResponse)
async def create_portfolio(
    request: PortfolioCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(auth_service.get_current_user)
):
    """Create or update user portfolio."""
    try:
        portfolio = portfolio_service.create_or_update_portfolio(
            db, 
            request.user_id, 
            request.domains
        )
        return portfolio
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating portfolio: {str(e)}")

@router.get("/{user_id}/domains")
async def get_portfolio_domains(
    user_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(auth_service.get_current_user)
):
    """Get portfolio domains."""
    try:
        domains = portfolio_service.get_portfolio_domains(db, user_id)
        return domains
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching portfolio domains: {str(e)}")

@router.get("/{user_id}/performance")
async def get_portfolio_performance(
    user_id: str,
    period: str = Query("30d", pattern="^(24h|7d|30d|1y)$"),
    db: Session = Depends(get_db),
    current_user: User = Depends(auth_service.get_current_user)
):
    """Get portfolio performance for a specific period."""
    try:
        performance = portfolio_service.get_portfolio_performance(db, user_id, period)
        return performance
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching performance: {str(e)}")
