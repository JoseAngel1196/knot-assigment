from sqlalchemy.orm import Session
from knot_backend.managers.base import BaseManager
from knot_backend.models.canonical.contact import Contact
from knot_backend.models.orm.contact import ContactORM


class ContactManager(BaseManager[ContactORM]):
    def create_contact(self, db_session: Session, contact: Contact) -> ContactORM:
        db_obj = self.model(
            first_name=contact.first_name,
            last_name=contact.last_name,
            email=contact.email,
            phone=contact.phone,
        )
        db_session.add(db_obj)
        db_session.flush()

        return db_obj


contact_manager = ContactManager(ContactORM)
