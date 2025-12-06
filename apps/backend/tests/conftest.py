from __future__ import annotations

import os
import tempfile
from typing import Generator

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.main import create_app
from app.db import Base, get_db


@pytest.fixture(scope="session")
def _test_db_engine():
    """Session-wide SQLite engine in a temporary file to share across tests."""
    # Use file-based SQLite to persist data within a test, but isolate per test via create/drop
    tmp_db = tempfile.NamedTemporaryFile(suffix=".db", delete=False)
    tmp_db.close()
    db_url = f"sqlite+pysqlite:///{tmp_db.name}"
    engine = create_engine(db_url, connect_args={"check_same_thread": False})
    try:
        yield engine
    finally:
        # Ensure all connections are closed before deleting the file (Windows lock avoidance)
        try:
            engine.dispose()
        except Exception:
            pass
        try:
            os.unlink(tmp_db.name)
        except FileNotFoundError:
            pass


@pytest.fixture()
def db_session(_test_db_engine) -> Generator:
    """Function-scoped DB with fresh schema for isolation."""
    Base.metadata.create_all(bind=_test_db_engine)
    TestingSessionLocal = sessionmaker(bind=_test_db_engine, autoflush=False, autocommit=False, expire_on_commit=False)
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=_test_db_engine)


@pytest.fixture()
def app_with_overrides(db_session):
    """FastAPI app with dependency overrides to use the test DB session."""
    app = create_app()

    def override_get_db() -> Generator:
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    # Ensure deterministic JWT for tests
    os.environ.setdefault("JWT_SECRET", "test-secret")
    return app


@pytest.fixture()
def client(app_with_overrides) -> Generator[TestClient, None, None]:
    with TestClient(app_with_overrides) as c:
        yield c


