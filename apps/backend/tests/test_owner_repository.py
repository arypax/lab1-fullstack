from __future__ import annotations

from sqlalchemy.orm import Session

from app.crud.owner import create_owner, get_owners, get_owner_by_id, update_owner, delete_owner
from app.schemas.owner import OwnerCreate, OwnerUpdate


def test_create_and_get_owner(db_session: Session):
    created = create_owner(db_session, OwnerCreate(firstname="Lucy", lastname="Smith"))
    assert created.id is not None

    fetched = get_owner_by_id(db_session, created.id)
    assert fetched is not None
    assert fetched.firstname == "Lucy"
    assert fetched.lastname == "Smith"


def test_list_and_delete_owners(db_session: Session):
    create_owner(db_session, OwnerCreate(firstname="Lisa", lastname="Morrison"))
    assert len(get_owners(db_session)) >= 1

    # delete all
    for owner in list(get_owners(db_session)):
        delete_owner(db_session, owner.id)
    assert len(get_owners(db_session)) == 0


def test_update_owner(db_session: Session):
    created = create_owner(db_session, OwnerCreate(firstname="john", lastname="doe"))

    updated = update_owner(db_session, created.id, OwnerUpdate(firstname="Jack"))
    assert updated is not None
    # validators Title-Case the names
    assert updated.firstname == "Jack"
    assert updated.lastname == "Doe"


