# Lab1-3 — Полный стек (Next.js + FastAPI + PostgreSQL + RESTful API)

## Структура

```
lab1/
  apps/
    frontend/        # Next.js (App Router, TS)
    backend/         # FastAPI + SQLAlchemy + Alembic
  infra/
    docker-compose.yml   # PostgreSQL + pgAdmin (единая БД)
  package.json           # корневые скрипты (pnpm)
  pnpm-workspace.yaml
  README.md
  .gitignore
```

## Требования
- Node 18+ и pnpm 9+
- Python 3.11+ и Poetry
- Docker Desktop (Docker Compose v2)

## Установка инструментов (Windows)
- Установить pnpm:
```powershell
npm i -g pnpm
```
- Установить Poetry (любой из вариантов):
```powershell
py -m pip install --user poetry
# или официальный инсталлятор
(Invoke-WebRequest -Uri https://install.python-poetry.org -UseBasicParsing).Content | py -
```
Перезапустите терминал, чтобы PATH обновился.

## Установка зависимостей
```powershell
# корень монорепо
cd lab1
# установить dev-зависимость concurrently и подготовить workspace
pnpm install
# backend зависимости через Poetry
cd apps/backend
poetry install
cd ../../..
```

## Демо-сценарий ЛР3 (5 минут)

### 1) Поднять единую БД:
```powershell
docker compose -f infra/docker-compose.yml up -d
```

### 2) Настроить backend:
```powershell
cd apps/backend
# Установить зависимости
py -m pip install fastapi uvicorn sqlalchemy psycopg2-binary alembic pydantic loguru

# Применить миграции
py -m alembic upgrade head
```

### 3) Открыть pgAdmin `http://localhost:5050`:
- Email: `admin@example.com`
- Password: `admin`
- Подключиться к серверу:
  - Host: `lab1_postgres`
  - Port: `5432`
  - DB: `lab1db`
  - User: `app`
  - Password: `app`

### 4) Запустить проект:
```powershell
# В корне проекта
pnpm dev
```

### 5) Проверить работу:
- **Фронтенд**: http://localhost:3000 (CRUD интерфейс)
- **Swagger UI**: http://localhost:4000/docs (API документация)
- **ReDoc**: http://localhost:4000/redoc (альтернативная документация)

### 6) Тестирование:
- **Postman**: Импортировать `apps/backend/postman_collection.json`
- **Swagger UI**: Протестировать CRUD операции
- **pgAdmin**: Просмотреть данные в таблицах `owners` и `cars`

### 7) Остановка:
```powershell
pnpm stop:db
```

## Возможности ЛР3:
- ✅ **Полный CRUD** для владельцев и автомобилей
- ✅ **Фильтрация** автомобилей по марке, цвету, году
- ✅ **Валидация данных** с автоматическим форматированием
- ✅ **Автоматическая документация** API (Swagger UI + ReDoc)
- ✅ **Postman коллекция** для тестирования
- ✅ **Адаптивный фронтенд** с управлением данными

## 🚀 Деплой приложения

### Быстрый старт
См. [QUICK_START.md](./QUICK_START.md) для быстрого руководства по деплою.

### Подробные инструкции

**Вариант 1 (AWS):** [DEPLOYMENT.md](./DEPLOYMENT.md) - деплой на:
- **AWS RDS** - база данных PostgreSQL
- **AWS Elastic Beanstalk** - backend (FastAPI)
- **Netlify** - frontend (Next.js)

**Вариант 2 (Без AWS):** [DEPLOYMENT_ALTERNATIVE.md](./DEPLOYMENT_ALTERNATIVE.md) - **рекомендуется, если нет доступа к AWS**:
- **Supabase/Neon** - база данных PostgreSQL (бесплатно)
- **Railway/Render** - backend (FastAPI) (бесплатно)
- **Vercel/Netlify** - frontend (Next.js) (бесплатно)

### Docker Compose (локальная разработка)
```powershell
cd infra
docker-compose up -d
```

Это запустит:
- PostgreSQL на порту 5432
- pgAdmin на порту 5050
- Backend на порту 4000
- Frontend на порту 3000
