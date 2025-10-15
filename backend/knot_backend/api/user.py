from fastapi import APIRouter
from fastapi import Depends

from knot_backend.api.deps.db import get_db
from knot_backend.api.exceptions import UnexpectedError
from knot_backend.logging.logger import KnotLogger
from knot_backend.schemas.user import ListUsersResponse, UserCreate, UserCreateResponse
from knot_backend.managers.user import user_manager

_LOGGER = KnotLogger(__name__)

router = APIRouter()


@router.post("/", response_model=UserCreateResponse)
def create_user(obj_in: UserCreate, db_session=Depends(get_db)) -> UserCreateResponse:
    try:
        existing_user = user_manager.get_username(db_session, obj_in.username)
        if existing_user:
            _LOGGER.info("Username already exists", extra={"username": obj_in.username})
            return UserCreateResponse(data=existing_user)

        user = user_manager.create_user(db_session, obj_in)
    except Exception as exc:
        _LOGGER.error(f"Error creating user: {exc}")
        raise UnexpectedError()

    db_session.commit()

    return UserCreateResponse(data=user)


@router.get("/", response_model=ListUsersResponse)
def list_users(db_session=Depends(get_db)) -> ListUsersResponse:
    users = user_manager.list_users(db_session)
    return ListUsersResponse(data=users)
