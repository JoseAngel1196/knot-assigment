from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine

from knot_backend import settings
from knot_backend.api.routes import root_router
from knot_backend.db.connection import close_db_conn, set_db_conn


def get_app() -> FastAPI:
    app = FastAPI()

    def open_database_connection():
        engine = create_engine(
            settings.DATABASE_URL,
        )
        set_db_conn(engine)

    def close_database_connection():
        close_db_conn()

    app.add_event_handler("startup", open_database_connection)
    app.add_event_handler("shutdown", close_database_connection)

    app.include_router(router=root_router)

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_methods=["*"],
        allow_headers=["*"],
    )

    return app


app = get_app()


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "klevrpay_agents.app:app",
        host="0.0.0.0",  # type: ignore
        port=int(settings.PORT),
        log_level="info",
    )
