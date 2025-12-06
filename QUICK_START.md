# Быстрый старт - Деплой приложения

## 🚀 Локальный запуск с Docker

```bash
# Запуск всех сервисов
cd infra
docker-compose up -d

# Просмотр логов
docker-compose logs -f

# Остановка
docker-compose down
```

После запуска:
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000
- PostgreSQL: localhost:5432
- pgAdmin: http://localhost:5050

## 📦 Подготовка к деплою

### Backend (FastAPI)

1. **Экспорт зависимостей**:
   ```bash
   cd apps/backend
   poetry export -f requirements.txt --output requirements.txt --without-hashes
   ```

2. **Создание ZIP для AWS**:
   ```bash
   # Linux/Mac
   ./prepare-deployment.sh
   
   # Windows PowerShell
   .\prepare-deployment.ps1
   ```

3. **Переменные окружения для AWS Elastic Beanstalk**:
   - `DATABASE_URL`: `postgresql+psycopg2://user:pass@rds-endpoint:5432/dbname`
   - `CORS_ORIGINS`: `https://your-netlify-site.netlify.app,http://localhost:3000`
   - `PORT`: `8000`

### Frontend (Next.js)

1. **Переменные окружения для Netlify**:
   - `NEXT_PUBLIC_API_BASE_URL`: `https://your-eb-env.elasticbeanstalk.com`

2. **Деплой через GitHub**:
   - Подключите репозиторий в Netlify
   - Укажите base directory: `apps/frontend`
   - Build command: `npm run build`
   - Publish directory: `.next`

## 📚 Подробные инструкции

- [DEPLOYMENT.md](./DEPLOYMENT.md) - деплой на AWS и Netlify
- [DEPLOYMENT_ALTERNATIVE.md](./DEPLOYMENT_ALTERNATIVE.md) - **альтернативный деплой без AWS** (Supabase, Railway, Render, Vercel)

## 🔧 Структура проекта

```
lab1/
├── apps/
│   ├── backend/          # FastAPI приложение
│   │   ├── app/          # Код приложения
│   │   ├── alembic/      # Миграции БД
│   │   ├── Dockerfile    # Docker образ для backend
│   │   └── Procfile      # Для Elastic Beanstalk
│   │
│   └── frontend/         # Next.js приложение
│       ├── app/          # Next.js App Router
│       ├── Dockerfile    # Docker образ для frontend
│       └── netlify.toml  # Конфигурация Netlify
│
└── infra/
    └── docker-compose.yml  # Локальная разработка
```

## ⚙️ Переменные окружения

### Backend

```bash
DATABASE_URL=postgresql+psycopg2://user:pass@host:5432/dbname
CORS_ORIGINS=http://localhost:3000,https://your-site.netlify.app
PORT=4000
```

### Frontend

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
```

## 🐳 Docker команды

### Сборка образов

```bash
# Backend
cd apps/backend
docker build -t lab1-backend:latest .

# Frontend
cd apps/frontend
docker build --build-arg NEXT_PUBLIC_API_BASE_URL=http://localhost:4000 -t lab1-frontend:latest .
```

### Запуск контейнеров

```bash
# Backend
docker run -d -p 4000:4000 \
  -e DATABASE_URL=postgresql+psycopg2://app:app@postgres:5432/lab1db \
  --name lab1-backend lab1-backend:latest

# Frontend
docker run -d -p 3000:3000 \
  --name lab1-frontend lab1-frontend:latest
```

## 📝 Полезные ссылки

- [AWS Elastic Beanstalk](https://aws.amazon.com/elasticbeanstalk/)
- [Netlify Documentation](https://docs.netlify.com/)
- [Docker Documentation](https://docs.docker.com/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Next.js Documentation](https://nextjs.org/docs)

