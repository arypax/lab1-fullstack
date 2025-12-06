"use client"

import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WeatherApp } from './_components/WeatherApp'
import { GitHubSearch } from './_components/GitHubSearch'
import { RaceConditionDemo } from './_components/RaceConditionDemo'
import { ReactQueryDemo } from './_components/ReactQueryDemo'

const queryClient = new QueryClient()

export default function Lab8Page() {
  // Устанавливаем заголовок страницы
  React.useEffect(() => {
    document.title = 'Лабораторная работа 8 — REST API с React'
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <main className="min-h-dvh p-6">
        <div className="mx-auto max-w-6xl space-y-8">
          <h1 className="text-3xl font-bold">
            Лабораторная работа 8: Работа с REST API в React - Vladislav Pineker - IT2CCO-2301
          </h1>

          {/* 1. Promises и fetch API - OpenWeather */}
          <section className="rounded-lg border border-white/10 p-6 space-y-4">
            <h2 className="text-xl font-semibold">
              1) Promises и fetch API (OpenWeather API)
            </h2>
            <p className="text-sm text-white/70">
              Пример использования нативного fetch API для получения данных о погоде в Лондоне.
              Используются promises с методами .then() и .catch().
            </p>
            <WeatherApp />
          </section>

          {/* 2. Axios - GitHub API */}
          <section className="rounded-lg border border-white/10 p-6 space-y-4">
            <h2 className="text-xl font-semibold">
              2) Axios библиотека (GitHub API)
            </h2>
            <p className="text-sm text-white/70">
              Пример использования библиотеки Axios для поиска репозиториев на GitHub.
              Axios автоматически парсит JSON и предоставляет удобный API.
            </p>
            <GitHubSearch />
          </section>

          {/* 3. Race Conditions */}
          <section className="rounded-lg border border-white/10 p-6 space-y-4">
            <h2 className="text-xl font-semibold">
              3) Обработка Race Conditions
            </h2>
            <p className="text-sm text-white/70">
              Демонстрация проблемы race condition и её решения с помощью cleanup функции в
              useEffect. Быстро меняющиеся запросы обрабатываются корректно.
            </p>
            <RaceConditionDemo />
          </section>

          {/* 4. React Query */}
          <section className="rounded-lg border border-white/10 p-6 space-y-4">
            <h2 className="text-xl font-semibold">
              4) React Query (Tanstack Query)
            </h2>
            <p className="text-sm text-white/70">
              Пример использования React Query для управления состоянием запросов, кэширования
              и автоматического refetch. Данные загружаются один раз и кэшируются.
            </p>
            <ReactQueryDemo />
          </section>
        </div>
      </main>
    </QueryClientProvider>
  )
}

