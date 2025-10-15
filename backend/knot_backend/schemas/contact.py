from typing import Optional
import uuid
from pydantic import BaseModel

from knot_backend.schemas.base import Response


class Contact(BaseModel):
    first_name: str
    last_name: str
    email: str
    phone: str


class ContactBaseResponseObj(Contact):
    id: Optional[uuid.UUID]

    class Config:
        from_attributes = True


class ContactResponse(Response[ContactBaseResponseObj]):
    pass


class ContactCreate(Contact):
    user_id: uuid.UUID


class ContactUpdate(Contact):
    user_id: uuid.UUID


class ListContactsResponse(Response[list[ContactBaseResponseObj]]):
    pass
