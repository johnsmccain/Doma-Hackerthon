from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.core.database import get_db
from app.models.user import User
from app.services.auth import AuthService
from app.services.market_trends import MarketTrendsService

router = APIRouter()
auth_service = AuthService()
trends_service = MarketTrendsService()

@router.get("/trends")
async def get_market_trends(
    category: Optional[str] = Query(None, description="Category filter"),
    limit: int = Query(10, ge=1, le=100, description="Number of trends to return"),
    db: Session = Depends(get_db),
    current_user: User = Depends(auth_service.get_current_user)
):
    """Get market trends and analysis."""
    try:
        trends = trends_service.get_market_trends(
            db, 
            category=category,
            limit=limit
        )
        return trends
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching market trends: {str(e)}")

@router.get("/trends/tlds")
async def get_tld_trends(
    limit: int = Query(20, ge=1, le=50, description="Number of TLDs to return"),
    db: Session = Depends(get_db),
    current_user: User = Depends(auth_service.get_current_user)
):
    """Get trending TLDs."""
    try:
        tld_trends = trends_service.get_tld_trends(db, limit=limit)
        return tld_trends
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching TLD trends: {str(e)}")

@router.get("/trends/keywords")
async def get_trending_keywords(
    tld: Optional[str] = Query(None, description="TLD filter"),
    limit: int = Query(20, ge=1, le=100, description="Number of keywords to return"),
    db: Session = Depends(get_db),
    current_user: User = Depends(auth_service.get_current_user)
):
    """Get trending keywords."""
    try:
        keywords = trends_service.get_trending_keywords(db, tld=tld, limit=limit)
        return keywords
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching trending keywords: {str(e)}")

@router.get("/trends/sentiment")
async def get_market_sentiment(
    db: Session = Depends(get_db),
    current_user: User = Depends(auth_service.get_current_user)
):
    """Get overall market sentiment."""
    try:
        sentiment = trends_service.get_market_sentiment(db)
        return sentiment
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching market sentiment: {str(e)}")
