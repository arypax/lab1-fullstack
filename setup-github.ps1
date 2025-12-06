# Автоматическая настройка GitHub репозитория
Write-Host "=== Настройка GitHub репозитория ===" -ForegroundColor Green

# Проверяем авторизацию
Write-Host "Проверяю авторизацию GitHub..." -ForegroundColor Yellow
$authCheck = gh auth status 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Требуется авторизация в GitHub" -ForegroundColor Red
    Write-Host "Запускаю процесс авторизации..." -ForegroundColor Yellow
    Write-Host "Следуйте инструкциям в браузере..." -ForegroundColor Cyan
    gh auth login --web
    Start-Sleep -Seconds 3
}

# Проверяем снова
$authCheck = gh auth status 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Авторизация не завершена. Попробуйте снова." -ForegroundColor Red
    exit 1
}

# Получаем имя пользователя
$username = gh api user --jq .login
Write-Host "Авторизован как: $username" -ForegroundColor Green

# Создаем репозиторий
$repoName = "lab1-fullstack"
Write-Host "Создаю репозиторий: $repoName" -ForegroundColor Yellow

gh repo create $repoName --public --source=. --remote=origin --push

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "Успешно!" -ForegroundColor Green
    $repoUrl = "https://github.com/$username/$repoName"
    Write-Host "Репозиторий создан: $repoUrl" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Теперь вы можете:" -ForegroundColor Yellow
    Write-Host "1. Деплоить Backend на Railway" -ForegroundColor White
    Write-Host "2. Деплоить Frontend на Vercel" -ForegroundColor White
} else {
    Write-Host "Ошибка при создании репозитория" -ForegroundColor Red
    Write-Host "Попробуйте создать репозиторий вручную на https://github.com/new" -ForegroundColor Yellow
    Write-Host "Затем выполните:" -ForegroundColor Yellow
    $remoteUrl = "https://github.com/$username/$repoName.git"
    Write-Host "  git remote add origin $remoteUrl" -ForegroundColor White
    Write-Host "  git push -u origin main" -ForegroundColor White
}
