#!/bin/bash
# Скрипт для подготовки backend к деплою на AWS Elastic Beanstalk

echo "Подготовка backend к деплою..."

# Экспорт зависимостей из Poetry в requirements.txt
echo "Экспорт зависимостей..."
poetry export -f requirements.txt --output requirements.txt --without-hashes

# Создание ZIP архива для Elastic Beanstalk
echo "Создание ZIP архива..."
zip -r backend.zip . \
    -x "*.git*" \
    -x "*__pycache__*" \
    -x "*.pyc" \
    -x "*.pytest_cache*" \
    -x "tests/*" \
    -x "*.log" \
    -x ".env*" \
    -x "backend.zip"

echo "Готово! Файл backend.zip создан и готов к загрузке в Elastic Beanstalk."

