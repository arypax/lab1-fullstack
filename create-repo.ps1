# Скрипт для создания GitHub репозитория
Write-Host "Проверяю авторизацию..." -ForegroundColor Yellow

# Проверяем авторизацию
gh auth status
if ($LASTEXITCODE -ne 0) {
    Write-Host "Требуется авторизация. Запускаю процесс..." -ForegroundColor Red
    gh auth login --web
    Write-Host "Пожалуйста, авторизуйтесь в браузере, затем нажмите Enter..." -ForegroundColor Yellow
    Read-Host
}

# Создаем репозиторий
Write-Host "Создаю репозиторий lab1-fullstack..." -ForegroundColor Green
gh repo create lab1-fullstack --public --source=. --remote=origin --push

if ($LASTEXITCODE -eq 0) {
    Write-Host "Успешно! Репозиторий создан и код загружен." -ForegroundColor Green
    $username = gh api user --jq .login
    Write-Host "URL: https://github.com/$username/lab1-fullstack" -ForegroundColor Cyan
} else {
    Write-Host "Ошибка при создании репозитория" -ForegroundColor Red
}

