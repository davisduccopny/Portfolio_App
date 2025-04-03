import os
BASE_URL = "http://localhost:8000"
ORIGINS_URL = ["http://127.0.0.1:5500", "http://localhost:5500"]
SECRET_KEY = os.environ.get("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
