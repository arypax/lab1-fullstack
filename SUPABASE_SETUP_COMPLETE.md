# Настройка Supabase - Готово! ✅

Вы успешно нашли Connection string в Supabase. Теперь нужно правильно его использовать.

## Ваша строка подключения:

```
postgresql://postgres:[YOUR_PASSWORD]@db.rivtrxzjpnxbgfmjpwha.supabase.co:5432/postgres
```

## Что делать дальше:

### 1. Замените [YOUR_PASSWORD] на реальный пароль

Ваша строка должна выглядеть так:
```
postgresql://postgres:ВашПароль123@db.rivtrxzjpnxbgfmjpwha.supabase.co:5432/postgres
```

### 2. Для Python/FastAPI используйте формат psycopg2:

Замените `postgresql://` на `postgresql+psycopg2://`:

```
postgresql+psycopg2://postgres:ВашПароль123@db.rivtrxzjpnxbgfmjpwha.supabase.co:5432/postgres
```

### 3. ⚠️ ВАЖНО: Используйте Session Pooler для деплоя

В окне "Connect to your project" вы видите предупреждение:
> "Not IPv4 compatible. Use Session Pooler if on a IPv4 network"

**Что это значит:**
- Direct connection (порт 5432) может не работать на Railway/Render
- Session Pooler (порт 6543) работает везде и более эффективен

**Как получить Pooler URL:**

1. В окне "Connect to your project" нажмите кнопку **"Pooler settings"**
2. Или переключите **Method** на **"Session Pooler"**
3. Скопируйте новую строку подключения

Она будет выглядеть примерно так:
```
postgresql://postgres.rivtrxzjpnxbgfmjpwha:[YOUR_PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
```

Для Python используйте:
```
postgresql+psycopg2://postgres.rivtrxzjpnxbgfmjpwha:ВашПароль123@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
```

## Где использовать:

### Для локальной разработки:
```bash
# В файле .env или напрямую в коде
DATABASE_URL=postgresql+psycopg2://postgres:ВашПароль123@db.rivtrxzjpnxbgfmjpwha.supabase.co:5432/postgres
```

### Для деплоя на Railway/Render:
```bash
# Используйте Pooler версию!
DATABASE_URL=postgresql+psycopg2://postgres.rivtrxzjpnxbgfmjpwha:ВашПароль123@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
```

## Проверка подключения:

1. Локально:
   ```bash
   cd apps/backend
   DATABASE_URL="postgresql+psycopg2://postgres:ВашПароль123@db.rivtrxzjpnxbgfmjpwha.supabase.co:5432/postgres" poetry run alembic upgrade head
   ```

2. Если миграции прошли успешно - подключение работает! ✅

## Следующие шаги:

1. ✅ Получили Connection string
2. ⏭️ Получите Pooler URL (для деплоя)
3. ⏭️ Деплой Backend на Railway (см. DEPLOYMENT_ALTERNATIVE.md)
4. ⏭️ Деплой Frontend на Vercel

## Полезные ссылки:

- [Supabase Connection Pooling Docs](https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pooler)
- [Supabase Direct Connection Docs](https://supabase.com/docs/guides/database/connecting-to-postgres#direct-connection)

