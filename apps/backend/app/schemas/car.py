from __future__ import annotations

from pydantic import BaseModel, Field, validator
from typing import Optional
from datetime import datetime


class CarBase(BaseModel):
    brand: str = Field(..., min_length=1, max_length=100, description="Марка автомобиля")
    model: str = Field(..., min_length=1, max_length=100, description="Модель автомобиля")
    color: str = Field(..., min_length=1, max_length=50, description="Цвет автомобиля")
    registration_number: str = Field(..., min_length=1, max_length=50, description="Регистрационный номер")
    model_year: int = Field(..., ge=1900, le=datetime.now().year + 1, description="Год выпуска")
    price: float = Field(..., gt=0, description="Цена автомобиля")
    owner_id: int = Field(..., gt=0, description="ID владельца")

    @validator('brand', 'model', 'color')
    def validate_strings(cls, v):
        if not v.strip():
            raise ValueError('Поле не может быть пустым')
        return v.strip().title()

    @validator('registration_number')
    def validate_registration(cls, v):
        if not v.strip():
            raise ValueError('Регистрационный номер не может быть пустым')
        return v.strip().upper()


class CarCreate(CarBase):
    pass


class CarUpdate(BaseModel):
    brand: Optional[str] = Field(None, min_length=1, max_length=100)
    model: Optional[str] = Field(None, min_length=1, max_length=100)
    color: Optional[str] = Field(None, min_length=1, max_length=50)
    registration_number: Optional[str] = Field(None, min_length=1, max_length=50)
    model_year: Optional[int] = Field(None, ge=1900, le=datetime.now().year + 1)
    price: Optional[float] = Field(None, gt=0)
    owner_id: Optional[int] = Field(None, gt=0)

    @validator('brand', 'model', 'color')
    def validate_strings(cls, v):
        if v is not None and not v.strip():
            raise ValueError('Поле не может быть пустым')
        return v.strip().title() if v else v

    @validator('registration_number')
    def validate_registration(cls, v):
        if v is not None and not v.strip():
            raise ValueError('Регистрационный номер не может быть пустым')
        return v.strip().upper() if v else v


class CarRead(CarBase):
    id: int

    class Config:
        from_attributes = True


