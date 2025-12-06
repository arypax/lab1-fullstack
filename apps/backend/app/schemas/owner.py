from __future__ import annotations

from pydantic import BaseModel, Field, validator
from typing import Optional


class OwnerBase(BaseModel):
    firstname: str = Field(..., min_length=1, max_length=100, description="Имя владельца")
    lastname: str = Field(..., min_length=1, max_length=100, description="Фамилия владельца")

    @validator('firstname', 'lastname')
    def validate_names(cls, v):
        if not v.strip():
            raise ValueError('Имя и фамилия не могут быть пустыми')
        return v.strip().title()


class OwnerCreate(OwnerBase):
    pass


class OwnerUpdate(BaseModel):
    firstname: Optional[str] = Field(None, min_length=1, max_length=100)
    lastname: Optional[str] = Field(None, min_length=1, max_length=100)

    @validator('firstname', 'lastname')
    def validate_names(cls, v):
        if v is not None and not v.strip():
            raise ValueError('Имя и фамилия не могут быть пустыми')
        return v.strip().title() if v else v


class OwnerRead(OwnerBase):
    id: int

    class Config:
        from_attributes = True


