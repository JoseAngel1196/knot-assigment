from backend.models.canonical.base import BaseCanonicalModel


class Contact(BaseCanonicalModel):
    first_name: str
    last_name: str
    email: str
    phone: str
