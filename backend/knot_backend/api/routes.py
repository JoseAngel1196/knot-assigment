from http import HTTPStatus
from fastapi import APIRouter
from fastapi.responses import JSONResponse

from knot_backend.api.user import router as user_router
from knot_backend.api.contact import router as contact_router

root_router = APIRouter()


@root_router.get("/healthz")
def health_check():
    return JSONResponse(content={}, status_code=HTTPStatus.OK)


root_router.include_router(user_router, prefix="/users")
root_router.include_router(contact_router, prefix="/contacts")