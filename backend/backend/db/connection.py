from sqlalchemy.engine import Engine as Database

_db_conn: Database


def set_db_conn(db_conn: Database) -> None:
    global _db_conn
    _db_conn = db_conn


def close_db_conn() -> None:
    global _db_conn
    if _db_conn:
        _db_conn.dispose()
