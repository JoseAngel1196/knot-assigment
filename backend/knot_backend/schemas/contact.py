from typing import Optional
import uuid
from pydantic import BaseModel, ConfigDict

from knot_backend.schemas.base import Response


class ContactHistory(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    field_changed: str
    old_value: Optional[str]
    new_value: Optional[str]


class Contact(BaseModel):
    first_name: str
    last_name: str
    email: str
    phone: str


class ContactBaseResponseObj(Contact):
    model_config = ConfigDict(from_attributes=True)

    id: Optional[uuid.UUID]


class ContactListResponseObj(ContactBaseResponseObj):
    model_config = ConfigDict(from_attributes=True)

    contact_histories: Optional[list[ContactHistory]] = []


class ContactResponse(Response[ContactBaseResponseObj]):
    pass


class ContactCreate(Contact):
    user_id: uuid.UUID


class ContactUpdate(Contact):
    user_id: uuid.UUID


class ListContactsResponse(Response[list[ContactListResponseObj]]):
    pass
