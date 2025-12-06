from __future__ import annotations

from typing import Iterable

from fastapi import Depends, HTTPException, Header, Query

from app.security import parse_token


def get_current_username(
    authorization: str | None = Header(default=None, alias="Authorization"),
    authorization_q: str | None = Query(default=None, alias="authorization"),
) -> str:
    token_value = authorization or authorization_q
    if not token_value or not token_value.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Требуется авторизация")
    token = token_value.split(" ", 1)[1]
    username = parse_token(token)
    if not username:
        raise HTTPException(status_code=401, detail="Недействительный токен")
    return username


def require_roles(*roles: Iterable[str]):
    def _dep(_: str = Depends(get_current_username)) -> None:
        return None

    return _dep


