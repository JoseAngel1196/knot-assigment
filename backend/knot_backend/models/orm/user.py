from sqlalchemy import Column, String

from knot_backend.models.orm.base import BaseModel


class UserORM(BaseModel):
    __tablename__ = "users"

    username = Column(String, unique=True, nullable=False)
