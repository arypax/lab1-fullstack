# Скрипт для создания GitHub репозитория и загрузки кода
# Требуется: GitHub CLI (gh) или создание репозитория вручную

Write-Host "=== Создание GitHub репозитория ===" -ForegroundColor Green

# Проверяем наличие GitHub CLI
$hasGh = Get-Command gh -ErrorAction SilentlyContinue

if ($hasGh) {
    Write-Host "GitHub CLI найден. Создаю репозиторий..." -ForegroundColor Yellow
    
    # Проверяем авторизацию
    $authStatus = gh auth status 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Требуется авторизация в GitHub CLI" -ForegroundColor Red
        Write-Host "Выполните: gh auth login" -ForegroundColor Yellow
        exit 1
    }
    
    # Создаем репозиторий
    $repoName = "lab1-fullstack"
    Write-Host "Создаю репозиторий: $repoName" -ForegroundColor Yellow
    gh repo create $repoName --public --source=. --remote=origin --push
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Репозиторий создан и код загружен!" -ForegroundColor Green
        Write-Host "URL: https://github.com/$(gh api user --jq .login)/$repoName" -ForegroundColor Cyan
    } else {
        Write-Host "Ошибка при создании репозитория" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "GitHub CLI не установлен." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "ВАРИАНТ 1: Установить GitHub CLI и запустить скрипт снова" -ForegroundColor Cyan
    Write-Host "  winget install --id GitHub.cli" -ForegroundColor White
    Write-Host ""
    Write-Host "ВАРИАНТ 2: Создать репозиторий вручную на GitHub.com" -ForegroundColor Cyan
    Write-Host "  1. Откройте https://github.com/new" -ForegroundColor White
    Write-Host "  2. Имя репозитория: lab1-fullstack" -ForegroundColor White
    Write-Host "  3. Выберите Public" -ForegroundColor White
    Write-Host "  4. НЕ добавляйте README, .gitignore или лицензию" -ForegroundColor White
    Write-Host "  5. Нажмите 'Create repository'" -ForegroundColor White
    Write-Host ""
    Write-Host "Затем выполните команды:" -ForegroundColor Yellow
    Write-Host "  git remote add origin https://github.com/YOUR_USERNAME/lab1-fullstack.git" -ForegroundColor White
    Write-Host "  git push -u origin main" -ForegroundColor White
}

