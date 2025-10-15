from pydantic import BaseModel

from backend.schemas.base import Response


class UserCreate(BaseModel):
    username: str


class UserResponseObj(BaseModel):
    id: str
    username: str

    class Config:
        orm_mode = True


class UserCreateResponse(Response[UserResponseObj]):
    pass
