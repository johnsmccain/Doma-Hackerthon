from datetime import datetime, timedelta
from typing import Optional
from sqlalchemy.orm import Session
from jose import JWTError, jwt
from passlib.context import CryptContext
import hashlib
import hmac

from app.core.config import settings
from app.models.user import User

class AuthService:
    def __init__(self):
        self.pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
        self.secret_key = settings.SECRET_KEY
        self.algorithm = settings.ALGORITHM
        self.access_token_expire_minutes = settings.ACCESS_TOKEN_EXPIRE_MINUTES

    def verify_signature(self, wallet_address: str, signature: str, message: str) -> bool:
        """Verify wallet signature (simplified for demo)."""
        # In a real implementation, this would verify the signature using the wallet's public key
        # For demo purposes, we'll accept any signature for now
        return True

    def get_or_create_user(self, db: Session, wallet_address: str) -> User:
        """Get existing user or create new one."""
        user = db.query(User).filter(User.wallet_address == wallet_address).first()
        
        if not user:
            user = User(
                wallet_address=wallet_address,
                risk_profile="moderate",
                budget=0,
                preferences={
                    "categories": [],
                    "min_score": 60,
                    "max_risk": "medium"
                }
            )
            db.add(user)
            db.commit()
            db.refresh(user)
        
        return user

    def create_access_token(self, wallet_address: str) -> str:
        """Create JWT access token."""
        expire = datetime.utcnow() + timedelta(minutes=self.access_token_expire_minutes)
        to_encode = {
            "sub": wallet_address,
            "exp": expire
        }
        encoded_jwt = jwt.encode(to_encode, self.secret_key, algorithm=self.algorithm)
        return encoded_jwt

    def verify_token(self, token: str) -> Optional[str]:
        """Verify JWT token and return wallet address."""
        try:
            payload = jwt.decode(token, self.secret_key, algorithms=[self.algorithm])
            wallet_address: str = payload.get("sub")
            if wallet_address is None:
                return None
            return wallet_address
        except JWTError:
            return None

    def get_current_user(self, db: Session, token: str) -> Optional[User]:
        """Get current user from token."""
        wallet_address = self.verify_token(token)
        if wallet_address is None:
            return None
        
        user = db.query(User).filter(User.wallet_address == wallet_address).first()
        return user
