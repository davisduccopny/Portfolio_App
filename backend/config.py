from dotenv import load_dotenv
import os
import cloudinary
import cloudinary.uploader
import cloudinary.api

load_dotenv(dotenv_path=".env",encoding="utf-8",override=True) 
BASE_URL_IMAGE = os.getenv("BASE_URL_IMAGE")
DATABASE_URL = os.getenv("DATABASE_URL")
allowed_origins = os.getenv("ORIGINS_URL", "")
ORIGINS_URL = [origin.strip() for origin in allowed_origins.split(",") if origin.strip()]
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True
)
