# Используем официальный образ Python
FROM python:3.11-slim

# Устанавливаем рабочую директорию
WORKDIR /app

# Устанавливаем системные зависимости
RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Устанавливаем Poetry
RUN pip install --no-cache-dir poetry

# Копируем файлы конфигурации Poetry
COPY pyproject.toml ./

# Настраиваем Poetry (не создавать виртуальное окружение, так как мы в контейнере)
RUN poetry config virtualenvs.create false

# Устанавливаем зависимости
RUN poetry install --without dev

# Копируем код приложения
COPY . .

# Открываем порт
EXPOSE 4000

# Команда запуска (миграции будут применены через docker-compose или вручную)
CMD ["poetry", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "4000"]

