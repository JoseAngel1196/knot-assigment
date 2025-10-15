from sqlalchemy.orm import Session

from knot_backend.managers.base import BaseManager
from knot_backend.models.canonical.contact import Contact
from knot_backend.models.orm.contact import ContactORM


class ContactManager(BaseManager[ContactORM]):
    def get_contact_by_email(
        self, db_session: Session, email: str, user_id: str
    ) -> ContactORM | None:
        return (
            db_session.query(self.model)
            .filter(self.model.email == email, self.model.user_id == user_id)
            .first()
        )

    def get_contacts_by_user(
        self, db_session: Session, user_id: str
    ) -> list[ContactORM]:
        return (
            db_session.query(self.model)
            .filter(self.model.user_id == str(user_id))
            .all()
        )

    def create_contact(self, db_session: Session, contact: Contact) -> ContactORM:
        db_obj = self.model(
            first_name=contact.first_name,
            last_name=contact.last_name,
            email=contact.email,
            phone=contact.phone,
            user_id=contact.user_id,
        )
        db_session.add(db_obj)
        db_session.flush()

        return db_obj


contact_manager = ContactManager(ContactORM)
