from sqlalchemy import Column, ForeignKey, String
from sqlalchemy.orm import relationship

from knot_backend.models.orm.base import BaseModel


class ContactHistoryORM(BaseModel):
    __tablename__ = "contact_histories"

    field_changed = Column(String(100), nullable=False)
    old_value = Column(String(255), nullable=True)
    new_value = Column(String(255), nullable=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    contact_id = Column(String, ForeignKey("contacts.id", ondelete="CASCADE"), nullable=False)

    contact = relationship("ContactORM", back_populates="contact_histories")
    user = relationship("UserORM", foreign_keys=[user_id], innerjoin=True)
