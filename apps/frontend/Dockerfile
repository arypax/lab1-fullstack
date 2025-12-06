# Стадия сборки
FROM node:20-alpine AS builder

WORKDIR /app

# Копируем файлы зависимостей
COPY package*.json ./
COPY pnpm-lock.yaml* ./

# Устанавливаем pnpm (если используется) или npm
RUN npm install -g pnpm && (pnpm install --frozen-lockfile || npm ci)

# Копируем исходный код
COPY . .

# Собираем приложение
# NEXT_PUBLIC_API_BASE_URL будет установлен во время сборки через build args
ARG NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL

RUN npm run build || pnpm build

# Стадия продакшена
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Копируем только необходимые файлы из standalone сборки
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Открываем порт
EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Запускаем приложение
CMD ["node", "server.js"]

