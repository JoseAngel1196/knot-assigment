from abc import ABC
from http import HTTPStatus
from fastapi import HTTPException


class KnotHTTPException(ABC, HTTPException):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)


class UnexpectedError(KnotHTTPException):
    def __init__(
        self,
        status_code: int = HTTPStatus.INTERNAL_SERVER_ERROR,
        detail: str = "An unexpected error occurred",
    ):
        super().__init__(status_code=status_code, detail=detail)


class ConflictException(KnotHTTPException):
    def __init__(
        self,
        status_code: int = HTTPStatus.CONFLICT,
        detail: str = "Conflict occurred",
    ):
        super().__init__(status_code=status_code, detail=detail)
