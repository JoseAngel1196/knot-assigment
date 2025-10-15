from pydantic import BaseModel

from knot_backend.schemas.base import Response


class UserCreate(BaseModel):
    username: str


class UserResponseObj(BaseModel):
    id: str | None
    username: str | None

    class Config:
        from_attributes = True


class UserCreateResponse(Response[UserResponseObj]):
    pass


class ListUsersResponse(Response[list[UserResponseObj]]):
    pass
