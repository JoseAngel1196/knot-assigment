from backend.models.canonical.base import BaseCanonicalModel


class User(BaseCanonicalModel):
    username: str
