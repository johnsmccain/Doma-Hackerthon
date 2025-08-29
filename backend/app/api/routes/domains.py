from fastapi import APIRouter, HTTPException, Query, Depends
from sqlalchemy.orm import Session
from typing import Optional
import re

from app.core.database import get_db
from app.services.domain_scoring import domain_scoring_service
from app.schemas.domain import DomainScore, DomainTradeRequest
from app.services.doma_integration import DomaIntegrationService

router = APIRouter()
doma_service = DomaIntegrationService()

@router.get("/score", response_model=DomainScore)
async def get_domain_score(
    domain: str = Query(..., description="Domain name to score"),
    db: Session = Depends(get_db)
):
    """Get domain score and valuation."""
    try:
        # Validate domain format
        if not re.match(r'^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}$', domain):
            raise HTTPException(status_code=400, detail="Invalid domain format")
        
        # Score the domain
        score_result = domain_scoring_service.score_domain(domain)
        
        return score_result
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error scoring domain")

@router.get("/doma/domain/{domain_name}")
async def get_doma_domain_info(
    domain_name: str,
    db: Session = Depends(get_db)
):
    """Get domain information from Doma Protocol."""
    try:
        # Get domain info from Doma
        domain_info = await doma_service.get_domain_info(domain_name)
        return domain_info
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching domain info: {str(e)}")

@router.get("/doma/trending")
async def get_trending_domains(
    limit: int = Query(20, ge=1, le=100, description="Number of trending domains to return"),
    db: Session = Depends(get_db)
):
    """Get trending domains from Doma Protocol."""
    try:
        trending_domains = await doma_service.get_trending_domains(limit)
        return trending_domains
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching trending domains: {str(e)}")

@router.post("/doma/buy")
async def buy_domain(
    request: DomainTradeRequest,
    db: Session = Depends(get_db)
):
    """Buy a domain on Doma Protocol."""
    try:
        if request.action != "buy":
            raise HTTPException(status_code=400, detail="Invalid action for buy endpoint")
        
        result = await doma_service.buy_domain(
            domain_id=request.domain,  # In practice, this would be a domain ID
            wallet_address=request.wallet_address,
            price=request.price
        )
        
        return {
            "success": True,
            "transaction_hash": result.get("transaction_hash"),
            "message": "Domain purchase initiated"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error buying domain: {str(e)}")

@router.post("/doma/sell")
async def sell_domain(
    request: DomainTradeRequest,
    db: Session = Depends(get_db)
):
    """Sell a domain on Doma Protocol."""
    try:
        if request.action != "sell":
            raise HTTPException(status_code=400, detail="Invalid action for sell endpoint")
        
        result = await doma_service.sell_domain(
            domain_id=request.domain,  # In practice, this would be a domain ID
            wallet_address=request.wallet_address,
            price=request.price
        )
        
        return {
            "success": True,
            "transaction_hash": result.get("transaction_hash"),
            "message": "Domain sale initiated"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error selling domain: {str(e)}")

@router.post("/trade")
async def execute_trade(
    request: DomainTradeRequest,
    db: Session = Depends(get_db)
):
    """Execute a domain trade (buy or sell)."""
    try:
        if request.action == "buy":
            result = await doma_service.buy_domain(
                domain_id=request.domain,
                wallet_address=request.wallet_address,
                price=request.price
            )
        elif request.action == "sell":
            result = await doma_service.sell_domain(
                domain_id=request.domain,
                wallet_address=request.wallet_address,
                price=request.price
            )
        else:
            raise HTTPException(status_code=400, detail="Invalid action")
        
        return {
            "success": True,
            "transaction_hash": result.get("transaction_hash"),
            "message": f"Domain {request.action} initiated"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error executing trade: {str(e)}")
