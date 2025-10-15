from datetime import datetime
from typing import Optional
import uuid
from pydantic import BaseModel, Field


class BaseCanonicalModel(BaseModel):
    id: Optional[uuid.UUID] = Field(None)
    created_at: Optional[datetime.datetime] = Field(None)
    updated_at: Optional[datetime.datetime] = Field(None)

    class Config:
        orm_mode = True
