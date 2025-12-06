from __future__ import annotations

from sqlalchemy import ForeignKey, String, Integer, Numeric
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db import Base


class Car(Base):
    __tablename__ = "cars"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    brand: Mapped[str] = mapped_column(String(100))
    model: Mapped[str] = mapped_column(String(100))
    color: Mapped[str] = mapped_column(String(50))
    registration_number: Mapped[str] = mapped_column(String(50), unique=True)
    model_year: Mapped[int] = mapped_column(Integer())
    price: Mapped[float] = mapped_column(Numeric(12, 2))

    owner_id: Mapped[int] = mapped_column(ForeignKey("owners.id", ondelete="CASCADE"))
    owner: Mapped["Owner"] = relationship(back_populates="cars")


