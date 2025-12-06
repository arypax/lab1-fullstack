"use client"

import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { CarShop } from './_components/CarShop'

const queryClient = new QueryClient()

export default function Lab10Page() {
  React.useEffect(() => {
    document.title = 'Лабораторная работа 10 — Настройка фронтенда для Spring Boot RESTful Web Service'
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <CarShop />
    </QueryClientProvider>
  )
}

