from sqlalchemy import Column, String
from sqlalchemy.orm import relationship

from knot_backend.models.orm.base import BaseModel


class UserORM(BaseModel):
    __tablename__ = "users"

    username = Column(String, unique=True, nullable=False)

    contacts = relationship(
        "ContactORM",
        back_populates="user",
        innerjoin=True,
    )
    contact_histories = relationship(
        "ContactHistoryORM",
        back_populates="user",
        innerjoin=True,
    )
