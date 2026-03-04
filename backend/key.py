import os
import secrets
from pathlib import Path
from dotenv import load_dotenv

# Load .env from backend folder, not from cwd
dotenv_path = Path(__file__).parent.parent / ".env"
if dotenv_path.exists():
    load_dotenv(dotenv_path=dotenv_path)
else:
    load_dotenv()  # fallback


def get_jwt_secret_key() -> str:
    jwt_secret = os.getenv("JWT_SECRET_KEY")
    
    if jwt_secret:
        return jwt_secret
    
    jwt_secret = secrets.token_urlsafe(32)
    
    env_path = os.path.join(os.path.dirname(__file__), ".env")
    with open(env_path, "a") as env_file:
        env_file.write(f"\nJWT_SECRET_KEY={jwt_secret}\n")
    
    print(f"✅ Generated and saved JWT_SECRET_KEY to .env file")
    
    return jwt_secret


SECRET_KEY = get_jwt_secret_key()
