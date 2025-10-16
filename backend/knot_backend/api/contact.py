import uuid
from fastapi import APIRouter
from fastapi.params import Depends

from knot_backend.api.deps.db import get_db
from knot_backend.api.exceptions import ConflictException, UnexpectedError
from knot_backend.logging.logger import KnotLogger
from knot_backend.schemas.base import Response
from knot_backend.schemas.contact import (
    ContactCreate,
    ContactResponse,
    ContactUpdate,
    ListContactsResponse,
)
from knot_backend.managers.contact import contact_manager

_LOGGER = KnotLogger(__name__)

router = APIRouter()


@router.get("/user/{user_id}", response_model=ListContactsResponse)
def get_contacts_by_user(
    user_id: uuid.UUID, db_session=Depends(get_db)
) -> ListContactsResponse:
    try:
        contacts = contact_manager.get_contacts_by_user(db_session, user_id)
        
    except Exception as exc:
        _LOGGER.error(f"Error retrieving contacts for user {user_id}: {exc}")
        raise UnexpectedError()

    return ListContactsResponse(data=contacts)


@router.post("/", response_model=ContactResponse)
def create_contact(
    obj_in: ContactCreate, db_session=Depends(get_db)
) -> ContactResponse:
    user_id_str = str(obj_in.user_id)
    contact = contact_manager.get_contact_by_email(
        db_session, obj_in.email, user_id_str
    )
    if contact:
        raise ConflictException(
            detail="Contact with this email already exists for the user."
        )

    try:
        contact = contact_manager.create_contact(db_session, obj_in)
    except Exception as exc:
        _LOGGER.error(f"Error creating contact: {exc}")
        raise UnexpectedError()

    db_session.commit()

    return ContactResponse(data=contact)


@router.put("/{contact_id}", response_model=ContactResponse)
def update_contact(contact_id: str, obj_in: ContactUpdate, db_session=Depends(get_db)):
    try:
        contact = contact_manager.update_contact(db_session, contact_id, obj_in)
        if not contact:
            raise UnexpectedError(detail="Contact not found.")
    except Exception as exc:
        _LOGGER.error(f"Error updating contact {contact_id}: {exc}")
        raise UnexpectedError()

    db_session.commit()

    return ContactResponse(data=contact)


@router.delete("/{contact_id}", response_model=Response)
def delete_contact(contact_id: str, db_session=Depends(get_db)) -> Response:
    try:
        contact_manager.delete_contact(db_session, contact_id)
    except Exception as exc:
        _LOGGER.error(f"Error deleting contact {contact_id}: {exc}")
        raise UnexpectedError()

    db_session.commit()

    return {"data": "deleted"}
