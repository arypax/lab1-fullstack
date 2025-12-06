from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session

from app.db import get_db
from app.models import User
from app.schemas.auth import LoginRequest, TokenResponse
from app.security import verify_password, create_access_token, hash_password


router = APIRouter(prefix="", tags=["auth"])  # /login


@router.post("/login", response_model=TokenResponse, summary="Аутентификация и выдача JWT")
def login(payload: LoginRequest, response: Response, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == payload.username).first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Неверные учетные данные")

    token = create_access_token(subject=user.username)
    # Экспорт заголовка Authorization для фронтенда
    response.headers["Authorization"] = f"Bearer {token}"
    response.headers["Access-Control-Expose-Headers"] = "Authorization"
    return TokenResponse(token=token)


@router.post("/admin/init", summary="Одноразовое создание администратора")
def init_admin(payload: LoginRequest, db: Session = Depends(get_db)):
    if len(payload.password.encode("utf-8")) > 72:
        raise HTTPException(status_code=400, detail="Пароль слишком длинный (max 72 байта)")
    exists = db.query(User).filter(User.username == payload.username).first()
    if exists:
        raise HTTPException(status_code=409, detail="Пользователь уже существует")
    db.add(User(username=payload.username, password_hash=hash_password(payload.password), role="ADMIN"))
    db.commit()
    return {"status": "ok"}


