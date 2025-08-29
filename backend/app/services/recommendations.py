from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
import random
from datetime import datetime, timedelta

from app.models.user import User
from app.models.recommendation import Recommendation
from app.services.domain_scoring import domain_scoring_service

class RecommendationService:
    def get_recommendations(
        self, 
        db: Session, 
        user_id: str, 
        risk_profile: Optional[str] = None,
        limit: int = 10
    ) -> List[Dict[str, Any]]:
        """Get personalized investment recommendations."""
        # Mock recommendations based on user profile
        # In a real implementation, this would use ML models
        
        mock_recommendations = [
            {
                "domain": "web3.eth",
                "action": "buy",
                "confidence": 85,
                "reasoning": "Strong growth potential in Web3 sector, high keyword value, and increasing market demand.",
                "expected_return": 25.5,
                "risk_level": "medium",
                "price_target": 3000000  # $30,000
            },
            {
                "domain": "ai.crypto",
                "action": "buy",
                "confidence": 78,
                "reasoning": "AI and crypto convergence trend, short domain name, high rarity score.",
                "expected_return": 18.2,
                "risk_level": "high",
                "price_target": 2500000  # $25,000
            },
            {
                "domain": "defi.dao",
                "action": "hold",
                "confidence": 65,
                "reasoning": "Current market volatility suggests holding position until market stabilizes.",
                "expected_return": 5.0,
                "risk_level": "medium",
                "price_target": 1800000  # $18,000
            },
            {
                "domain": "nft.gallery",
                "action": "sell",
                "confidence": 72,
                "reasoning": "NFT market cooling, consider taking profits and reallocating to higher-growth sectors.",
                "expected_return": -8.5,
                "risk_level": "low",
                "price_target": 1200000  # $12,000
            },
            {
                "domain": "metaverse.world",
                "action": "buy",
                "confidence": 82,
                "reasoning": "Metaverse trend gaining momentum, premium keyword combination, strong market sentiment.",
                "expected_return": 32.0,
                "risk_level": "high",
                "price_target": 4000000  # $40,000
            }
        ]
        
        # Filter by risk profile if specified
        if risk_profile:
            if risk_profile == "conservative":
                mock_recommendations = [r for r in mock_recommendations if r["risk_level"] == "low"]
            elif risk_profile == "aggressive":
                mock_recommendations = [r for r in mock_recommendations if r["risk_level"] == "high"]
        
        return mock_recommendations[:limit]

    def get_domain_recommendation(
        self, 
        db: Session, 
        user_id: str, 
        domain: str
    ) -> Dict[str, Any]:
        """Get specific domain recommendation for user."""
        # Score the domain first
        domain_score = domain_scoring_service.score_domain(domain)
        
        # Generate recommendation based on score and user profile
        if domain_score.score >= 80:
            action = "buy"
            confidence = 85
            expected_return = 20.0
            risk_level = "low"
        elif domain_score.score >= 60:
            action = "buy"
            confidence = 70
            expected_return = 12.0
            risk_level = "medium"
        elif domain_score.score >= 40:
            action = "hold"
            confidence = 60
            expected_return = 5.0
            risk_level = "medium"
        else:
            action = "sell"
            confidence = 75
            expected_return = -10.0
            risk_level = "high"
        
        recommendation = {
            "domain": domain,
            "action": action,
            "confidence": confidence,
            "reasoning": f"Based on domain score of {domain_score.score}/100. {domain_score.reasoning}",
            "expected_return": expected_return,
            "risk_level": risk_level,
            "price_target": domain_score.valuation,
            "domain_score": domain_score.score,
            "domain_valuation": domain_score.valuation
        }
        
        return recommendation

    def submit_feedback(
        self, 
        db: Session, 
        recommendation_id: int, 
        feedback: str
    ) -> bool:
        """Submit feedback on a recommendation."""
        # In a real implementation, this would store feedback in database
        # and use it to improve the recommendation model
        return True

    def get_recommendation_history(
        self, 
        db: Session, 
        user_id: str, 
        limit: int = 20
    ) -> List[Dict[str, Any]]:
        """Get user's recommendation history."""
        # Mock recommendation history
        history = [
            {
                "domain": "crypto.eth",
                "action": "buy",
                "recommended_date": "2024-01-10T15:30:00Z",
                "executed": True,
                "execution_date": "2024-01-11T10:15:00Z",
                "performance": 25.0,
                "accuracy": "correct"
            },
            {
                "domain": "nft.dao",
                "action": "buy",
                "recommended_date": "2024-01-05T12:15:00Z",
                "executed": True,
                "execution_date": "2024-01-06T09:30:00Z",
                "performance": 20.0,
                "accuracy": "correct"
            },
            {
                "domain": "defi.crypto",
                "action": "hold",
                "recommended_date": "2024-01-15T09:45:00Z",
                "executed": False,
                "execution_date": None,
                "performance": -12.5,
                "accuracy": "correct"
            }
        ]
        
        return history[:limit]

    def get_recommendation_accuracy(self, db: Session, user_id: str) -> Dict[str, Any]:
        """Get recommendation accuracy statistics."""
        # Mock accuracy statistics
        accuracy_stats = {
            "total_recommendations": 25,
            "correct_predictions": 18,
            "accuracy_percentage": 72.0,
            "avg_return": 15.5,
            "best_recommendation": {
                "domain": "crypto.eth",
                "return": 45.2
            },
            "worst_recommendation": {
                "domain": "defi.crypto",
                "return": -8.5
            }
        }
        
        return accuracy_stats
