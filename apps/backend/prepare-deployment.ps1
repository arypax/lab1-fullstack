# PowerShell скрипт для подготовки backend к деплою на AWS Elastic Beanstalk

Write-Host "Подготовка backend к деплою..." -ForegroundColor Green

# Экспорт зависимостей из Poetry в requirements.txt
Write-Host "Экспорт зависимостей..." -ForegroundColor Yellow
poetry export -f requirements.txt --output requirements.txt --without-hashes

# Создание ZIP архива для Elastic Beanstalk
Write-Host "Создание ZIP архива..." -ForegroundColor Yellow
$excludeItems = @(
    "*.git*",
    "*__pycache__*",
    "*.pyc",
    "*.pytest_cache*",
    "tests/*",
    "*.log",
    ".env*",
    "backend.zip"
)

# Используем Compress-Archive (встроенная команда PowerShell)
Get-ChildItem -Path . -Exclude $excludeItems | 
    Compress-Archive -DestinationPath backend.zip -Force

Write-Host "Готово! Файл backend.zip создан и готов к загрузке в Elastic Beanstalk." -ForegroundColor Green

