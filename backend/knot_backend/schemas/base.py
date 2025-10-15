from typing import Generic, TypeVar

from pydantic.generics import GenericModel


DataT = TypeVar("DataT")


class Response(GenericModel, Generic[DataT]):
    data: DataT
