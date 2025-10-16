from os import environ

from dotenv import load_dotenv


load_dotenv()

PORT = environ.get("PORT", "8000")

DATABASE_URL = environ.get("DATABASE_URL", "")
