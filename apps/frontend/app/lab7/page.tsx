"use client"

import React from 'react'
import { Hello } from './_components/Hello'
import { Counter } from './_components/Counter'
import { Conditional } from './_components/Conditional'
import { ListExamples } from './_components/ListExamples'
import { FormExamples } from './_components/FormExamples'
import { ContextDemo } from './_components/ContextDemo'
import { useTitle } from './_hooks/useTitle'

export default function Lab7Page() {
  useTitle('Лабораторная работа 7 — Основы React')

  return (
    <main className="min-h-dvh p-6">
      <div className="mx-auto max-w-6xl space-y-8">
        <h1 className="text-3xl font-bold">Laboratory work 8: Vladislav Pineker - IT2CCO-2301</h1>

        {/* 1. Components + Props (TS) */}
        <section className="rounded-lg border border-white/10 p-6 space-y-3">
          <h2 className="text-xl font-semibold">1) Компоненты и Props</h2>
          <Hello firstName="Владислав" lastName="Пинекер" />
          <Hello firstName="Гость" />
        </section>

        {/* 2. State, Events, Conditional Rendering */}
        <section className="rounded-lg border border-white/10 p-6 grid gap-6 sm:grid-cols-2">
          <div>
            <h2 className="text-xl font-semibold mb-2">2) Состояние и События</h2>
            <Counter />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">3) Условный Рендеринг</h2>
            <Conditional />
          </div>
        </section>

        {/* 3. Lists & Tables */}
        <section className="rounded-lg border border-white/10 p-6">
          <h2 className="text-xl font-semibold mb-2">4) Списки и Таблицы</h2>
          <ListExamples />
        </section>

        {/* 4. Forms */}
        <section className="rounded-lg border border-white/10 p-6">
          <h2 className="text-xl font-semibold mb-2">5) Формы</h2>
          <FormExamples />
        </section>

        {/* 5. Context API */}
        <section className="rounded-lg border border-white/10 p-6">
          <h2 className="text-xl font-semibold mb-2">6) Context API</h2>
          <ContextDemo />
        </section>
      </div>
    </main>
  )
}


