from sqlalchemy.orm import Session


from backend.managers.base import BaseManager
from backend.models.canonical.user import User
from backend.models.orm.user import UserORM


class UserManager(BaseManager[UserORM]):
    def create_user(self, db_session: Session, user: User) -> UserORM:
        db_obj = self.model(
            username=user.username,
        )
        db_session.add(db_obj)
        db_session.flush()

        return db_obj


user_manager = UserManager(UserORM)
