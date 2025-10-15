from fastapi import APIRouter

from backend.schemas.user import UserCreate, UserCreateResponse
from backend.managers.user import user_manager

router = APIRouter()


@router.post("/", response_model=UserCreate)
def create_user(obj_in: UserCreate):
    user = user_manager.create_user(db_session=None, user=obj_in)
    return UserCreateResponse(data=user)
