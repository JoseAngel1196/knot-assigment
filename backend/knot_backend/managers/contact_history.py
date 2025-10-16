from sqlalchemy.orm import Session

from knot_backend.managers.base import BaseManager
from knot_backend.models.orm.contact_history import ContactHistoryORM


class ContactHistoryManager(BaseManager[ContactHistoryORM]):
    def record_history(
        self,
        db_session: Session,
        contact_id: str,
        user_id: str,
        field_name: str,
        old_value: str | None,
        new_value: str | None,
    ) -> ContactHistoryORM:
        history_entry = self.model(
            contact_id=contact_id,
            user_id=user_id,
            field_changed=field_name,
            old_value=old_value,
            new_value=new_value,
        )
        db_session.add(history_entry)
        db_session.flush()
        return history_entry

    def get_contact_history(
        self, db_session: Session, contact_id: str
    ) -> list[ContactHistoryORM]:
        return (
            db_session.query(self.model)
            .filter(self.model.contact_id == contact_id)
            .all()
        )


contact_history_manager = ContactHistoryManager(ContactHistoryORM)
