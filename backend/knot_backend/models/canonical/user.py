from knot_backend.models.canonical.base import BaseCanonicalModel


class User(BaseCanonicalModel):
    username: str
