from sqlalchemy import Column, String, ForeignKey, Text
from sqlalchemy.orm import relationship
from .base import BaseModel


class ContactORM(BaseModel):
    __tablename__ = "contacts"

    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    email = Column(String(100), unique=True, nullable=False, index=True)
    phone = Column(String(20), nullable=False)

    # Relationship to contact history
    history = relationship(
        "ContactHistory", back_populates="contact", cascade="all, delete-orphan"
    )


class ContactHistory(BaseModel):
    __tablename__ = "contact_history"

    contact_id = Column(String, ForeignKey("contacts.id"), nullable=False)
    action = Column(String(20), nullable=False)  # 'created', 'updated', 'deleted'
    field_name = Column(
        String(50), nullable=True
    )  # which field was changed (for updates)
    old_value = Column(Text, nullable=True)  # previous value
    new_value = Column(Text, nullable=True)  # new value

    # Relationship back to contact
    contact = relationship("Contact", back_populates="history")
