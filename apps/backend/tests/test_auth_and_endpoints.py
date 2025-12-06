from __future__ import annotations

from typing import Dict

from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.models import User
from app.security import hash_password


def _init_admin_direct(db: Session, username: str = "admin", password: str = "admin") -> None:
    db.add(User(username=username, password_hash=hash_password(password), role="ADMIN"))
    db.commit()


def _auth_headers(token: str) -> Dict[str, str]:
    return {"Authorization": f"Bearer {token}"}


def test_login_flow(client: TestClient, db_session: Session):
    _init_admin_direct(db_session)
    resp = client.post("/login", json={"username": "admin", "password": "admin"})
    assert resp.status_code == 200
    data = resp.json()
    assert "token" in data
    assert resp.headers.get("Authorization", "").startswith("Bearer ")


def test_owners_crud_with_jwt(client: TestClient, db_session: Session):
    _init_admin_direct(db_session)
    token = client.post("/login", json={"username": "admin", "password": "admin"}).json()["token"]

    # Create owner
    r = client.post("/owners", json={"firstname": "Alice", "lastname": "Brown"}, headers=_auth_headers(token))
    assert r.status_code == 201
    owner = r.json()

    # Get owner by id
    r = client.get(f"/owners/{owner['id']}")
    assert r.status_code == 200

    # Update owner
    r = client.put(
        f"/owners/{owner['id']}",
        json={"firstname": "Alicia"},
        headers=_auth_headers(token),
    )
    assert r.status_code == 200
    assert r.json()["firstname"] == "Alicia"

    # List owners
    r = client.get("/owners")
    assert r.status_code == 200
    assert isinstance(r.json(), list)

    # Delete owner
    r = client.delete(f"/owners/{owner['id']}", headers=_auth_headers(token))
    assert r.status_code == 204


def test_cars_filters(client: TestClient, db_session: Session):
    _init_admin_direct(db_session)
    token = client.post("/login", json={"username": "admin", "password": "admin"}).json()["token"]

    # Create owner
    owner_id = client.post(
        "/owners",
        json={"firstname": "Bob", "lastname": "Smith"},
        headers=_auth_headers(token),
    ).json()["id"]

    cars_payload = [
        {
            "brand": "Toyota",
            "model": "Corolla",
            "color": "red",
            "registration_number": "AA111",
            "model_year": 2020,
            "price": 10000,
            "owner_id": owner_id,
        },
        {
            "brand": "Toyota",
            "model": "Camry",
            "color": "blue",
            "registration_number": "BB222",
            "model_year": 2023,
            "price": 20000,
            "owner_id": owner_id,
        },
        {
            "brand": "Honda",
            "model": "Civic",
            "color": "red",
            "registration_number": "CC333",
            "model_year": 2023,
            "price": 18000,
            "owner_id": owner_id,
        },
    ]

    for payload in cars_payload:
        r = client.post("/cars", json=payload, headers=_auth_headers(token))
        assert r.status_code == 201

    # Filters
    assert len(client.get("/cars", params={"brand": "Toyota"}).json()) == 2
    assert len(client.get("/cars", params={"color": "red"}).json()) == 2
    assert len(client.get("/cars", params={"model_year": 2023}).json()) == 2


