from sqlalchemy.orm import Session

from knot_backend.managers.base import BaseManager
from knot_backend.models.canonical.user import User
from knot_backend.models.orm.user import UserORM


class UserManager(BaseManager[UserORM]):
    def get_username(self, db_session: Session, username: str) -> UserORM | None:
        return (
            db_session.query(self.model).filter(self.model.username == username).first()
        )

    def create_user(self, db_session: Session, user: User) -> UserORM:
        db_obj = self.model(
            username=user.username,
        )
        db_session.add(db_obj)
        db_session.flush()

        return db_obj

    def list_users(self, db_session: Session) -> list[UserORM]:
        return db_session.query(self.model).all()


user_manager = UserManager(UserORM)
