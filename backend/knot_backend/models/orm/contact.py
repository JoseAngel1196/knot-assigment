from sqlalchemy import Column, String
from .base import BaseModel


class ContactORM(BaseModel):
    __tablename__ = "contacts"

    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    email = Column(String(100), unique=True, nullable=False, index=True)
    phone = Column(String(20), nullable=False)
