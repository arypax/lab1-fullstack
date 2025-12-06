from __future__ import annotations

from fastapi.testclient import TestClient


def test_health(client: TestClient):
    r = client.get("/health")
    assert r.status_code == 200
    body = r.json()
    assert body.get("status") == "ok"
    assert "timestamp" in body


def test_echo(client: TestClient):
    r = client.get("/echo", params={"msg": "hello"})
    assert r.status_code == 200
    assert r.json() == {"echo": "hello"}


