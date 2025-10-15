from fastapi import APIRouter
from fastapi import Depends

from knot_backend.api.deps.db import get_db
from knot_backend.logging.logger import KnotLogger
from knot_backend.schemas.user import UserCreate, UserCreateResponse, UserResponseObj
from knot_backend.managers.user import user_manager

_LOGGER = KnotLogger(__name__)

router = APIRouter()


@router.post("/", response_model=UserCreateResponse)
def create_user(obj_in: UserCreate, db_session=Depends(get_db)):
    try:
        existing_user = user_manager.get_username(db_session, obj_in.username)
        if existing_user:
            _LOGGER.info("Username already exists", extra={"username": obj_in.username})
            return UserCreateResponse(data=existing_user)

        user = user_manager.create_user(db_session, obj_in)
    except Exception as exc:
        _LOGGER.error(f"Error creating user: {exc}")
        return UserCreateResponse(data=UserResponseObj(id=None, username=None))

    db_session.commit()

    return UserCreateResponse(data=user)
