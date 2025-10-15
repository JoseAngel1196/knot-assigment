from os import environ

from dotenv import load_dotenv


load_dotenv()

PORT = environ.get("PORT", "3000")

DATABASE_URL = environ.get("DATABASE_URL", "sqlite:///./contacts.db")
