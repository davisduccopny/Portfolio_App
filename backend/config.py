import os
BASE_URL = os.environ.get("BASE_URL")
ORIGINS_URL = [os.environ.get("ORIGINS_URL")]
SECRET_KEY = os.environ.get("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
