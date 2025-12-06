from sqlalchemy.orm import Session
from sqlalchemy import and_, func

from app.models import Car
from app.schemas.car import CarCreate, CarUpdate


def create_car(db: Session, data: CarCreate) -> Car:
    car = Car(
        brand=data.brand,
        model=data.model,
        color=data.color,
        registration_number=data.registration_number,
        model_year=data.model_year,
        price=data.price,
        owner_id=data.owner_id,
    )
    db.add(car)
    db.commit()
    db.refresh(car)
    return car


def get_cars(db: Session) -> list[Car]:
    return db.query(Car).all()


def get_car_by_id(db: Session, car_id: int) -> Car | None:
    return db.get(Car, car_id)


def update_car(db: Session, car_id: int, data: CarUpdate) -> Car | None:
    car = db.get(Car, car_id)
    if not car:
        return None
    
    if data.brand is not None:
        car.brand = data.brand
    if data.model is not None:
        car.model = data.model
    if data.color is not None:
        car.color = data.color
    if data.registration_number is not None:
        car.registration_number = data.registration_number
    if data.model_year is not None:
        car.model_year = data.model_year
    if data.price is not None:
        car.price = data.price
    if data.owner_id is not None:
        car.owner_id = data.owner_id
    
    db.commit()
    db.refresh(car)
    return car


def delete_car(db: Session, car_id: int) -> bool:
    car = db.get(Car, car_id)
    if not car:
        return False
    db.delete(car)
    db.commit()
    return True


def get_cars_by_brand(db: Session, brand: str) -> list[Car]:
    # Case-insensitive equality
    return db.query(Car).filter(func.lower(Car.brand) == brand.lower()).all()


def get_cars_by_color(db: Session, color: str) -> list[Car]:
    # Case-insensitive equality
    return db.query(Car).filter(func.lower(Car.color) == color.lower()).all()


def get_cars_by_model_year(db: Session, year: int) -> list[Car]:
    return db.query(Car).filter(Car.model_year == year).all()


def get_cars_by_owner(db: Session, owner_id: int) -> list[Car]:
    return db.query(Car).filter(Car.owner_id == owner_id).all()


def get_cars_with_filters(
    db: Session, 
    brand: str | None = None,
    color: str | None = None,
    model_year: int | None = None,
    owner_id: int | None = None
) -> list[Car]:
    query = db.query(Car)
    filters = []
    
    if brand:
        filters.append(func.lower(Car.brand) == brand.lower())
    if color:
        filters.append(func.lower(Car.color) == color.lower())
    if model_year:
        filters.append(Car.model_year == model_year)
    if owner_id:
        filters.append(Car.owner_id == owner_id)
    
    if filters:
        query = query.filter(and_(*filters))
    
    return query.all()


