from typing import Generic, Optional, Type, TypeVar
from uuid import UUID

from sqlalchemy.orm import Session

from knot_backend.models.orm.base import BaseModel


ModelType = TypeVar("ModelType", bound=BaseModel)


class BaseManager(Generic[ModelType]):
    def __init__(self, model: Type[ModelType]):
        self.model = model

    def get(self, db_session: Session, id: UUID) -> Optional[ModelType]:
        return db_session.query(self.model).filter(self.model.id == id).first()
