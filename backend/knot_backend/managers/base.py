from typing import Generic, Type, TypeVar
from knot_backend.models.orm.base import BaseModel


ModelType = TypeVar("ModelType", bound=BaseModel)


class BaseManager(Generic[ModelType]):
    def __init__(self, model: Type[ModelType]):
        self.model = model
