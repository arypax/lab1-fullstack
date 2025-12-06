"use client"

import React from 'react'
import { DatePickerDemo } from './_components/DatePickerDemo'
import { AGGridDemo } from './_components/AGGridDemo'
import { MaterialUIDemo } from './_components/MaterialUIDemo'
import { ReactRouterDemo } from './_components/ReactRouterDemo'

export default function Lab9Page() {
  React.useEffect(() => {
    document.title = 'Лабораторная работа 9 — Полезные сторонние компоненты для React'
  }, [])

  return (
    <main className="min-h-dvh p-6">
      <div className="mx-auto max-w-6xl space-y-8">
        <h1 className="text-3xl font-bold">
          Лабораторная работа 9: Полезные сторонние компоненты для React - Vladislav Pineker - IT2CCO-2301
        </h1>

        {/* 1. Installing third-party React components - DatePicker */}
        <section className="rounded-lg border border-white/10 p-6 space-y-4">
          <h2 className="text-xl font-semibold">
            1) Установка сторонних React компонентов (react-date-picker)
          </h2>
          <p className="text-sm text-white/70">
            Пример установки и использования стороннего компонента react-date-picker для выбора даты.
            Компонент установлен через npm и демонстрирует работу с библиотеками из npm registry.
          </p>
          <DatePickerDemo />
        </section>

        {/* 2. Working with AG Grid */}
        <section className="rounded-lg border border-white/10 p-6 space-y-4">
          <h2 className="text-xl font-semibold">
            2) Работа с AG Grid
          </h2>
          <p className="text-sm text-white/70">
            AG Grid - гибкий компонент таблицы данных для React приложений. Демонстрирует сортировку,
            фильтрацию, пагинацию и кастомные cell renderers. Данные загружаются с GitHub API.
          </p>
          <AGGridDemo />
        </section>

        {/* 3. Using Material UI */}
        <section className="rounded-lg border border-white/10 p-6 space-y-4">
          <h2 className="text-xl font-semibold">
            3) Использование библиотеки Material UI
          </h2>
          <p className="text-sm text-white/70">
            Material UI (MUI) - библиотека компонентов React, реализующая Google Material Design.
            Демонстрирует создание shopping list приложения с использованием компонентов MUI:
            AppBar, Dialog, TextField, List и других.
          </p>
          <MaterialUIDemo />
        </section>

        {/* 4. Managing routing with React Router */}
        <section className="rounded-lg border border-white/10 p-6 space-y-4">
          <h2 className="text-xl font-semibold">
            4) Управление роутингом с React Router
          </h2>
          <p className="text-sm text-white/70">
            React Router - популярная библиотека для маршрутизации в React приложениях.
            Демонстрирует использование BrowserRouter, Routes, Route и Link компонентов,
            включая вложенные маршруты и обработку 404 ошибок.
          </p>
          <ReactRouterDemo />
        </section>
      </div>
    </main>
  )
}

