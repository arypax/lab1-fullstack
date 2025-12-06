# Как найти Connection String в Supabase

## Способ 1: Через Project Settings (Рекомендуется)

1. В левом боковом меню найдите иконку **шестеренки** (⚙️) внизу
2. Нажмите на неё - откроется меню **Project Settings**
3. В меню Project Settings выберите **Database**
4. Прокрутите вниз до секции **Connection string** или **Connection info**
5. Вы увидите несколько вариантов:
   - **URI** - полная строка подключения
   - **Connection pooling** - для использования пулера соединений
   - **Direct connection** - прямое подключение

## Способ 2: Через кнопку Connect

1. В верхней панели найдите кнопку **Connect**
2. Нажмите на неё
3. Откроется модальное окно с информацией о подключении
4. Там будут показаны строки подключения для разных языков/библиотек

## Способ 3: Через SQL Editor

1. В левом меню выберите **SQL Editor**
2. В правом верхнем углу найдите иконку подключения или кнопку **Connect**
3. Там будет показана информация о подключении

## Формат Connection String

Supabase предоставляет строки подключения в разных форматах:

### Для Python (psycopg2) - используйте этот формат:

**С пулером соединений (рекомендуется для продакшена):**
```
postgresql+psycopg2://postgres.[ref]:[PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres
```

**Прямое подключение (для разработки):**
```
postgresql+psycopg2://postgres:[PASSWORD]@db.[project-ref].supabase.co:5432/postgres
```

### Где взять значения:

- `[PASSWORD]` - пароль, который вы установили при создании проекта Supabase
- `[ref]` - уникальный идентификатор проекта (например: `abcdefghijklmnop`)
- `[region]` - регион вашего проекта (например: `eu-central-1`)

## Пример полной строки подключения:

```
postgresql+psycopg2://postgres.abcdefghijklmnop:MyPassword123@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
```

## Важные замечания:

1. **База данных:** В Supabase используется база `postgres` по умолчанию. Не нужно создавать отдельную базу `lab1db` - просто используйте `postgres` и создавайте таблицы через миграции.

2. **Пароль:** Если вы забыли пароль, вы можете сбросить его в **Project Settings** → **Database** → **Database password** → **Reset database password**

3. **SSL:** Для продакшена рекомендуется использовать SSL. Supabase автоматически предоставляет SSL сертификаты.

4. **Connection Pooling:** Используйте пулер соединений (порт 6543) для продакшена, так как он более эффективен и имеет лимиты на бесплатном тарифе.

## Настройка для вашего приложения:

В переменной окружения `DATABASE_URL` используйте:

```bash
DATABASE_URL=postgresql+psycopg2://postgres.[ref]:[PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres
```

Замените `[ref]`, `[PASSWORD]` и `[region]` на реальные значения из вашего Supabase проекта.

