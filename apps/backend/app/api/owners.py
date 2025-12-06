from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db import get_db
from app.deps import get_current_username, require_roles
from app.crud.owner import create_owner, get_owners, get_owner_by_id, update_owner, delete_owner
from app.schemas.owner import OwnerCreate, OwnerRead, OwnerUpdate


router = APIRouter(prefix="/owners", tags=["owners"])


@router.post("", response_model=OwnerRead, status_code=201, summary="Создать владельца")
def post_owner(
    payload: OwnerCreate,
    db: Session = Depends(get_db),
    _: None = Depends(require_roles("ADMIN")),
):
    """Создать нового владельца автомобиля"""
    return create_owner(db, payload)


@router.get("", response_model=list[OwnerRead], summary="Получить всех владельцев")
def list_owners(db: Session = Depends(get_db), _: str = Depends(get_current_username)):
    """Получить список всех владельцев"""
    return get_owners(db)


@router.get("/{owner_id}", response_model=OwnerRead, summary="Получить владельца по ID")
def get_owner(owner_id: int, db: Session = Depends(get_db), _: str = Depends(get_current_username)):
    """Получить владельца по его ID"""
    owner = get_owner_by_id(db, owner_id)
    if not owner:
        raise HTTPException(status_code=404, detail="Владелец не найден")
    return owner


@router.put("/{owner_id}", response_model=OwnerRead, summary="Обновить владельца")
def put_owner(
    owner_id: int,
    payload: OwnerUpdate,
    db: Session = Depends(get_db),
    _: None = Depends(require_roles("ADMIN")),
):
    """Обновить данные владельца"""
    owner = update_owner(db, owner_id, payload)
    if not owner:
        raise HTTPException(status_code=404, detail="Владелец не найден")
    return owner


@router.delete("/{owner_id}", status_code=204, summary="Удалить владельца")
def delete_owner_endpoint(
    owner_id: int,
    db: Session = Depends(get_db),
    _: None = Depends(require_roles("ADMIN")),
):
    """Удалить владельца по ID"""
    success = delete_owner(db, owner_id)
    if not success:
        raise HTTPException(status_code=404, detail="Владелец не найден")
    return None


