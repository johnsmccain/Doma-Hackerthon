from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.core.database import get_db
from app.models.user import User
from app.services.auth import AuthService
from app.services.recommendations import RecommendationService

router = APIRouter()
auth_service = AuthService()
recommendation_service = RecommendationService()

@router.get("/recommendations")
async def get_recommendations(
    user_id: str = Query(..., description="User ID"),
    risk_profile: Optional[str] = Query(None, description="Risk profile filter"),
    limit: int = Query(10, ge=1, le=50, description="Number of recommendations"),
    db: Session = Depends(get_db),
    current_user: User = Depends(auth_service.get_current_user)
):
    """Get personalized investment recommendations."""
    try:
        recommendations = recommendation_service.get_recommendations(
            db, 
            user_id, 
            risk_profile=risk_profile,
            limit=limit
        )
        return recommendations
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching recommendations: {str(e)}")

@router.get("/recommendations/{domain}")
async def get_domain_recommendation(
    domain: str,
    user_id: str = Query(..., description="User ID"),
    db: Session = Depends(get_db),
    current_user: User = Depends(auth_service.get_current_user)
):
    """Get specific domain recommendation for user."""
    try:
        recommendation = recommendation_service.get_domain_recommendation(
            db, 
            user_id, 
            domain
        )
        return recommendation
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching domain recommendation: {str(e)}")

@router.post("/recommendations/feedback")
async def submit_recommendation_feedback(
    recommendation_id: int,
    feedback: str = Query(..., pattern="^(buy|sell|hold|ignore)$"),
    db: Session = Depends(get_db),
    current_user: User = Depends(auth_service.get_current_user)
):
    """Submit feedback on a recommendation."""
    try:
        result = recommendation_service.submit_feedback(
            db, 
            recommendation_id, 
            feedback
        )
        return {"success": True, "message": "Feedback submitted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error submitting feedback: {str(e)}")
