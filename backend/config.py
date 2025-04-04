from dotenv import load_dotenv
import os
load_dotenv() 
BASE_URL = os.getenv("BASE_URL")
allowed_origins = os.getenv("ORIGINS_URL", "")
ORIGINS_URL = [origin.strip() for origin in allowed_origins.split(",") if origin.strip()]
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
