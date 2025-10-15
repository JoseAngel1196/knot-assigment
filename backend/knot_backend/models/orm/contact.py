from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.orm import relationship
from knot_backend.models.orm.base import BaseModel


class ContactORM(BaseModel):
    __tablename__ = "contacts"

    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    email = Column(String(100), unique=True, nullable=False, index=True)
    phone = Column(String(20), nullable=False)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)

    user = relationship("UserORM", foreign_keys=[user_id], innerjoin=True)
