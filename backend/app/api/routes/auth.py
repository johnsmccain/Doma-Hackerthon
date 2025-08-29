from fastapi import APIRouter, HTTPException, Depends, Header
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional

from app.core.database import get_db
from app.models.user import User
from app.services.auth import AuthService

router = APIRouter()
auth_service = AuthService()

class WalletAuthRequest(BaseModel):
    wallet_address: str
    signature: str
    message: str

class AuthResponse(BaseModel):
    token: str
    user: dict

@router.post("/wallet", response_model=AuthResponse)
async def authenticate_wallet(
    request: WalletAuthRequest,
    db: Session = Depends(get_db)
):
    """Authenticate user with wallet signature."""
    try:
        # Verify signature
        is_valid = auth_service.verify_signature(
            request.wallet_address,
            request.signature,
            request.message
        )
        
        if not is_valid:
            raise HTTPException(status_code=401, detail="Invalid signature")
        
        # Get or create user
        user = auth_service.get_or_create_user(db, request.wallet_address)
        
        # Generate JWT token
        token = auth_service.create_access_token(user.wallet_address)
        
        return AuthResponse(
            token=token,
            user={
                "id": user.id,
                "wallet_address": user.wallet_address,
                "risk_profile": user.risk_profile,
                "budget": user.budget,
                "preferences": user.preferences
            }
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Authentication failed: {str(e)}")

@router.get("/me")
async def get_current_user(
    authorization: str = Header(None),
    db: Session = Depends(get_db)
):
    """Get current authenticated user."""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header")
    
    token = authorization.replace("Bearer ", "")
    current_user = auth_service.get_current_user(db, token)
    
    if not current_user:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    return {
        "id": current_user.id,
        "wallet_address": current_user.wallet_address,
        "risk_profile": current_user.risk_profile,
        "budget": current_user.budget,
        "preferences": current_user.preferences
    }
