from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.db import get_db
from app.deps import get_current_username, require_roles
from app.crud.car import (
    create_car,
    get_cars,
    get_car_by_id,
    get_cars_by_brand,
    get_cars_by_color,
    get_cars_by_model_year,
    update_car,
    delete_car,
)
from app.schemas.car import CarCreate, CarRead, CarUpdate


router = APIRouter(prefix="/cars", tags=["cars"])


@router.post("", response_model=CarRead, status_code=201)
def post_car(
    payload: CarCreate,
    db: Session = Depends(get_db),
    _: str = Depends(get_current_username),
):
    return create_car(db, payload)


@router.get("", response_model=list[CarRead])
def list_cars(
    brand: str | None = Query(None),
    color: str | None = Query(None),
    model_year: int | None = Query(None),
    db: Session = Depends(get_db),
    _: str = Depends(get_current_username),
):
    if brand:
        return get_cars_by_brand(db, brand)
    if color:
        return get_cars_by_color(db, color)
    if model_year is not None:
        return get_cars_by_model_year(db, model_year)
    return get_cars(db)


@router.get("/{car_id}", response_model=CarRead)
def get_car(car_id: int, db: Session = Depends(get_db), _: str = Depends(get_current_username)):
    car = get_car_by_id(db, car_id)
    if not car:
        raise HTTPException(status_code=404, detail="Car not found")
    return car


@router.put("/{car_id}", response_model=CarRead)
def put_car(
    car_id: int,
    payload: CarUpdate,
    db: Session = Depends(get_db),
    _: str = Depends(get_current_username),
):
    car = update_car(db, car_id, payload)
    if not car:
        raise HTTPException(status_code=404, detail="Car not found")
    return car


@router.delete("/{car_id}", status_code=204)
def delete_car_endpoint(car_id: int, db: Session = Depends(get_db), _: str = Depends(get_current_username)):
    ok = delete_car(db, car_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Car not found")
    return None


