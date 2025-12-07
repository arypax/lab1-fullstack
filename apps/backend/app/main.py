from datetime import datetime, timezone
from typing import List

from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from loguru import logger

from app.api.cars import router as cars_router
from app.api.owners import router as owners_router
from app.api.auth import router as auth_router
from app.db import get_db, SessionLocal


def create_app() -> FastAPI:
    app = FastAPI(
        title="Car Database API",
        description="""
        ## RESTful API для управления автомобилями и владельцами
        
        ### Возможности:
        - **CRUD операции** для автомобилей и владельцев
        - **Фильтрация и поиск** автомобилей по различным критериям
        - **Валидация данных** с подробными сообщениями об ошибках
        - **Автоматическая документация** через OpenAPI 3.0
        
        ### Основные эндпоинты:
        - `/owners` - управление владельцами
        - `/cars` - управление автомобилями
        - `/health` - проверка состояния API
        
        ### Фильтрация автомобилей:
        - `GET /cars?brand=Toyota` - по марке
        - `GET /cars?color=red` - по цвету
        - `GET /cars?model_year=2023` - по году
        - `GET /cars?owner_id=1` - по владельцу
        """,
        version="1.0.0",
        contact={
            "name": "Lab Support",
            "email": "lab@example.com",
        },
        license_info={
            "name": "MIT",
        },
    )

    # CORS: разрешаем локальный фронт и продакшен-домены (Netlify, при необходимости другие)
    allowed_origins: List[str] = [
        "http://localhost:3000",
        "https://zesty-marshmallow-049df6.netlify.app",
        "https://6935c869b32d4073100617a8--zesty-marshmallow-049df6.netlify.app",
    ]
    app.add_middleware(
        CORSMiddleware,
        allow_origins=allowed_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
        expose_headers=["Authorization"],
    )

    @app.on_event("startup")
    async def on_startup() -> None:
        logger.info("Car Database API started")

    @app.get("/health", tags=["system"], summary="Проверка состояния API")
    async def health():
        """Проверка работоспособности API"""
        return {
            "status": "ok",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "version": "1.0.0",
        }

    @app.get("/echo", tags=["system"], summary="Эхо-тест")
    async def echo(msg: str = Query("", description="Сообщение для эхо")):
        """Простой эхо-тест для проверки API"""
        return {"echo": msg}

    # API роутеры
    app.include_router(auth_router)
    app.include_router(owners_router)
    app.include_router(cars_router)

    return app


app = create_app()


