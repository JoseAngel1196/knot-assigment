from sqlalchemy.orm import Session, selectinload

from knot_backend.managers.base import BaseManager
from knot_backend.models.canonical.contact import Contact
from knot_backend.models.orm.contact import ContactORM
from knot_backend.managers.contact_history import contact_history_manager


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
            .options(selectinload(self.model.contact_histories))
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

    def update_contact(
        self, db_session: Session, contact_id: str, contact: Contact
    ) -> ContactORM | None:
        db_obj = self.get(db_session, contact_id)
        if not db_obj:
            return None

        field_mapping = {
            "first_name": (db_obj.first_name, contact.first_name),
            "last_name": (db_obj.last_name, contact.last_name),
            "email": (db_obj.email, contact.email),
            "phone": (db_obj.phone, contact.phone),
        }

        for field_name, (old_value, new_value) in field_mapping.items():
            if str(old_value) != str(new_value):
                contact_history_manager.record_history(
                    db_session=db_session,
                    contact_id=contact_id,
                    user_id=contact.user_id,
                    field_name=field_name,
                    old_value=str(old_value),
                    new_value=str(new_value),
                )

        db_obj.first_name = contact.first_name
        db_obj.last_name = contact.last_name
        db_obj.email = contact.email
        db_obj.phone = contact.phone

        db_session.add(db_obj)
        db_session.flush()

        return db_obj

    def delete_contact(self, db_session: Session, contact_id: str) -> None:
        db_obj = self.get(db_session, contact_id)
        if not db_obj:
            return None

        db_session.delete(db_obj)
        db_session.flush()

        return None


contact_manager = ContactManager(ContactORM)
