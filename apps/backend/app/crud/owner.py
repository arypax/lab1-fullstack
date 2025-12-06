from sqlalchemy.orm import Session

from app.models import Owner
from app.schemas.owner import OwnerCreate, OwnerUpdate


def create_owner(db: Session, data: OwnerCreate) -> Owner:
    owner = Owner(firstname=data.firstname, lastname=data.lastname)
    db.add(owner)
    db.commit()
    db.refresh(owner)
    return owner


def get_owners(db: Session) -> list[Owner]:
    return db.query(Owner).all()


def get_owner_by_id(db: Session, owner_id: int) -> Owner | None:
    return db.get(Owner, owner_id)


def update_owner(db: Session, owner_id: int, data: OwnerUpdate) -> Owner | None:
    owner = db.get(Owner, owner_id)
    if not owner:
        return None
    
    if data.firstname is not None:
        owner.firstname = data.firstname
    if data.lastname is not None:
        owner.lastname = data.lastname
    
    db.commit()
    db.refresh(owner)
    return owner


def delete_owner(db: Session, owner_id: int) -> bool:
    owner = db.get(Owner, owner_id)
    if not owner:
        return False
    db.delete(owner)
    db.commit()
    return True


