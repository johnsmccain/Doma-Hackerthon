from pydantic_settings import BaseSettings
from typing import List, Optional
import os

class Settings(BaseSettings):
    # Application
    APP_NAME: str = "Doma Advisor API"
    VERSION: str = "1.0.0"
    DEBUG: bool = False
    
    # Database
    DATABASE_URL: str = "postgresql://user:password@localhost/doma_advisor"
    
    # Security
    SECRET_KEY: str = "your-secret-key-here"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # CORS
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:3001",
        "https://doma-advisor.vercel.app",
    ]
    ALLOWED_HOSTS: List[str] = ["*"]
    
    # OpenAI
    OPENAI_API_KEY: Optional[str] = None
    
    # Doma Protocol
    DOMA_RPC_URL: str = "https://testnet.doma.io"
    DOMA_PRIVATE_KEY: Optional[str] = None
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379"
    
    # External APIs
    DOMAIN_ORACLE_URL: str = "https://api.domainoracle.com"
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
