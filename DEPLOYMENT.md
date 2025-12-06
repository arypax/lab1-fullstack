# Инструкция по деплою приложения

Это руководство описывает процесс деплоя Full-Stack приложения (FastAPI + Next.js) на AWS и Netlify.

> ⚠️ **Если у вас проблемы с регистрацией в AWS**, см. [DEPLOYMENT_ALTERNATIVE.md](./DEPLOYMENT_ALTERNATIVE.md) для альтернативных вариантов деплоя без AWS (Supabase, Railway, Render, Vercel).

## Содержание

1. [Деплой базы данных PostgreSQL на AWS RDS](#деплой-базы-данных-postgresql-на-aws-rds)
2. [Деплой Backend (FastAPI) на AWS Elastic Beanstalk](#деплой-backend-fastapi-на-aws-elastic-beanstalk)
3. [Деплой Frontend (Next.js) на Netlify](#деплой-frontend-nextjs-на-netlify)
4. [Использование Docker контейнеров](#использование-docker-контейнеров)

---

## Деплой базы данных PostgreSQL на AWS RDS

### Шаг 1: Создание аккаунта AWS

1. Создайте бесплатный аккаунт AWS Free Tier на [aws.amazon.com](https://aws.amazon.com/)
2. Подтвердите email и добавьте способ оплаты (не будет списаний в рамках Free Tier)

### Шаг 2: Создание базы данных в RDS

1. Войдите в AWS Console
2. В поиске введите "RDS" и выберите сервис RDS
3. Нажмите "Create database" (Создать базу данных)
4. Выберите:
   - **Engine type**: PostgreSQL
   - **Version**: PostgreSQL 16 (или последняя версия)
   - **Template**: Free tier
5. Настройте параметры:
   - **DB instance identifier**: lab1-database (или другое имя)
   - **Master username**: postgres (или ваш выбор)
   - **Master password**: создайте надежный пароль (сохраните его!)
6. В разделе **Connectivity**:
   - **Public access**: Yes (для доступа извне)
7. В разделе **Additional configuration**:
   - **Initial database name**: lab1db
8. Нажмите "Create database"
9. Дождитесь создания базы (5-10 минут)

### Шаг 3: Настройка безопасности

1. После создания базы, откройте её в списке RDS
2. Перейдите на вкладку **Connectivity & security**
3. Нажмите на Security group (например, `sg-xxxxx`)
4. Перейдите на вкладку **Inbound rules**
5. Нажмите **Edit inbound rules**
6. Добавьте правило:
   - **Type**: PostgreSQL
   - **Port**: 5432
   - **Source**: My IP (для тестирования) или Security group вашего Elastic Beanstalk
7. Сохраните правила

### Шаг 4: Получение данных подключения

1. В RDS Console откройте вашу базу данных
2. Нажмите "View connection details"
3. Скопируйте **Endpoint** (например: `lab1-database.xxxxx.us-east-1.rds.amazonaws.com`)
4. Сохраните:
   - Endpoint
   - Port: 5432
   - Database name: lab1db
   - Username: postgres
   - Password: (ваш пароль)

### Шаг 5: Тестирование локального подключения

1. Обновите `apps/backend/app/db.py` или создайте `.env` файл:
   ```bash
   DATABASE_URL=postgresql+psycopg2://postgres:your_password@your-endpoint:5432/lab1db
   ```

2. Запустите миграции:
   ```bash
   cd apps/backend
   poetry run alembic upgrade head
   ```

3. Запустите приложение:
   ```bash
   poetry run uvicorn app.main:app --reload
   ```

---

## Деплой Backend (FastAPI) на AWS Elastic Beanstalk

### Шаг 1: Подготовка приложения

1. Убедитесь, что `apps/backend/app/db.py` использует переменную окружения `DATABASE_URL`
2. Создайте файл `apps/backend/Procfile` (для Elastic Beanstalk):
   ```
   web: uvicorn app.main:app --host 0.0.0.0 --port 8000
   ```

3. Создайте файл `apps/backend/requirements.txt` из Poetry:
   ```bash
   cd apps/backend
   poetry export -f requirements.txt --output requirements.txt --without-hashes
   ```

### Шаг 2: Создание IAM роли

1. В AWS Console найдите сервис **IAM**
2. Перейдите в **Roles** → **Create role**
3. Выберите **AWS service** → **EC2**
4. Добавьте политики:
   - `AWSElasticBeanstalkWebTier`
   - `AWSElasticBeanstalkWorkerTier`
5. Назовите роль: `elastic-beanstalk-ec2-role`
6. Создайте роль

### Шаг 3: Создание ZIP архива

1. Создайте ZIP архив с содержимым `apps/backend/`:
   ```bash
   cd apps/backend
   zip -r backend.zip . -x "*.git*" -x "*__pycache__*" -x "*.pyc" -x "*.pytest_cache*" -x "tests/*"
   ```

   **Важно**: Включите файлы:
   - `app/` (весь код)
   - `alembic/` (миграции)
   - `alembic.ini`
   - `pyproject.toml`
   - `requirements.txt` (если создали)
   - `Procfile`

### Шаг 4: Создание приложения в Elastic Beanstalk

1. В AWS Console найдите **Elastic Beanstalk**
2. Нажмите **Create application**
3. Введите имя приложения: `lab1-backend`
4. Нажмите **Create**

### Шаг 5: Создание окружения

1. В созданном приложении нажмите **Create environment**
2. Выберите **Web server environment**
3. Настройте:
   - **Platform**: Python
   - **Platform branch**: Python 3.11
   - **Platform version**: (рекомендуемая)
4. В разделе **Application code**:
   - Выберите **Upload your code**
   - Выберите **Local file**
   - Загрузите `backend.zip`
   - **Version label**: v1.0.0
5. Нажмите **Next**

### Шаг 6: Настройка сервисного доступа

1. В разделе **Service access**:
   - **EC2 instance profile**: выберите созданную роль `elastic-beanstalk-ec2-role`
2. Нажмите **Next**

### Шаг 7: Настройка переменных окружения

1. В разделе **Configure updates, monitoring, and logging**:
2. В секции **Environment properties** добавьте:
   - `DATABASE_URL`: `postgresql+psycopg2://postgres:password@your-rds-endpoint:5432/lab1db`
   - `PORT`: `8000`
3. Нажмите **Next** → **Submit**

### Шаг 8: Ожидание деплоя

1. Дождитесь завершения деплоя (5-10 минут)
2. После успешного деплоя скопируйте **Domain** (URL вашего API)

### Шаг 9: Настройка безопасности базы данных

1. Вернитесь в RDS
2. Откройте Security group вашей базы данных
3. Удалите правило для "My IP"
4. Добавьте правило:
   - **Type**: PostgreSQL
   - **Source**: Security group вашего Elastic Beanstalk (начинается с `awseb-`)

### Шаг 10: Тестирование

1. Откройте Postman или curl
2. Проверьте health endpoint:
   ```bash
   curl https://your-app-env.elasticbeanstalk.com/health
   ```

---

## Деплой Frontend (Next.js) на Netlify

### Шаг 1: Подготовка проекта

1. Убедитесь, что в `apps/frontend/` есть файл `netlify.toml`
2. Обновите `.env` или создайте `.env.production`:
   ```
   NEXT_PUBLIC_API_BASE_URL=https://your-app-env.elasticbeanstalk.com
   ```

### Шаг 2: Создание GitHub репозитория

1. Создайте репозиторий на GitHub
2. Инициализируйте Git в проекте:
   ```bash
   cd apps/frontend
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/your-username/your-repo.git
   git push -u origin main
   ```

### Шаг 3: Регистрация в Netlify

1. Зарегистрируйтесь на [netlify.com](https://www.netlify.com/)
2. Войдите в аккаунт

### Шаг 4: Импорт проекта

1. В Netlify Dashboard нажмите **Sites** → **Import an existing project**
2. Нажмите **Deploy with GitHub**
3. Авторизуйте доступ к GitHub
4. Выберите ваш репозиторий
5. Настройте:
   - **Base directory**: `apps/frontend` (если репозиторий монорепо)
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
6. В разделе **Environment variables** добавьте:
   - `NEXT_PUBLIC_API_BASE_URL`: `https://your-app-env.elasticbeanstalk.com`
7. Нажмите **Deploy site**

### Шаг 5: Ожидание деплоя

1. Дождитесь завершения сборки и деплоя
2. После успешного деплоя откройте ваш сайт по сгенерированному URL

### Шаг 6: Настройка кастомного домена (опционально)

1. В настройках сайта перейдите в **Domain settings**
2. Добавьте ваш домен
3. Следуйте инструкциям по настройке DNS

---

## Использование Docker контейнеров

### Локальный запуск с Docker Compose

1. Обновите `infra/docker-compose.yml` при необходимости
2. Запустите все сервисы:
   ```bash
   cd infra
   docker-compose up -d
   ```

3. Проверьте логи:
   ```bash
   docker-compose logs -f
   ```

4. Остановите сервисы:
   ```bash
   docker-compose down
   ```

### Создание Docker образов

#### Backend

```bash
cd apps/backend
docker build -t lab1-backend:latest .
```

#### Frontend

```bash
cd apps/frontend
docker build --build-arg NEXT_PUBLIC_API_BASE_URL=http://localhost:4000 -t lab1-frontend:latest .
```

### Запуск контейнеров

#### Backend

```bash
docker run -d \
  --name lab1-backend \
  -p 4000:4000 \
  -e DATABASE_URL=postgresql+psycopg2://app:app@postgres:5432/lab1db \
  --link lab1_postgres:postgres \
  lab1-backend:latest
```

#### Frontend

```bash
docker run -d \
  --name lab1-frontend \
  -p 3000:3000 \
  lab1-frontend:latest
```

### Деплой Docker контейнеров на AWS ECS

1. Создайте ECR репозиторий в AWS
2. Загрузите образы:
   ```bash
   aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin your-account.dkr.ecr.us-east-1.amazonaws.com
   docker tag lab1-backend:latest your-account.dkr.ecr.us-east-1.amazonaws.com/lab1-backend:latest
   docker push your-account.dkr.ecr.us-east-1.amazonaws.com/lab1-backend:latest
   ```

3. Создайте ECS кластер и сервисы
4. Настройте Load Balancer и Security Groups

---

## Полезные ссылки

- [AWS RDS Documentation](https://docs.aws.amazon.com/rds/)
- [AWS Elastic Beanstalk Documentation](https://docs.aws.amazon.com/elasticbeanstalk/)
- [Netlify Documentation](https://docs.netlify.com/)
- [Docker Documentation](https://docs.docker.com/)

---

## Важные замечания

⚠️ **Безопасность**:
- Никогда не коммитьте `.env` файлы в Git
- Используйте переменные окружения в облачных сервисах
- Регулярно обновляйте пароли

⚠️ **Стоимость**:
- AWS Free Tier имеет ограничения
- Удаляйте неиспользуемые ресурсы
- Мониторьте использование через AWS Billing Dashboard

⚠️ **Резервное копирование**:
- Настройте автоматические снапшоты RDS
- Регулярно делайте бэкапы базы данных

