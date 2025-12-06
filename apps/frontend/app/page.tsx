"use client"

import { useCallback, useEffect, useMemo, useState } from 'react'

const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000'

type Health = { status: string; timestamp: string; version: string }
type Owner = { id: number; firstname: string; lastname: string }
type Car = { 
  id: number; 
  brand: string; 
  model: string; 
  color: string; 
  registration_number: string; 
  model_year: number; 
  price: number; 
  owner_id: number 
}

export default function HomePage() {
  const [health, setHealth] = useState<Health | null>(null)
  const [healthError, setHealthError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [echo, setEcho] = useState<string | null>(null)
  const [echoLoading, setEchoLoading] = useState(false)
  const [echoError, setEchoError] = useState<string | null>(null)
  
  // CRUD состояние
  const [owners, setOwners] = useState<Owner[]>([])
  const [cars, setCars] = useState<Car[]>([])
  const ownerIdToOwner = useMemo(() => {
    const map = new Map<number, Owner>()
    for (const o of owners) map.set(o.id, o)
    return map
  }, [owners])
  const [ownersLoading, setOwnersLoading] = useState(false)
  const [carsLoading, setCarsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true
    setLoading(true)
    fetch(`${apiBase}/health`)
      .then(async (r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return (await r.json()) as Health
      })
      .then((data) => {
        if (!isMounted) return
        setHealth(data)
        setHealthError(null)
      })
      .catch((err: unknown) => {
        if (!isMounted) return
        setHealth(null)
        setHealthError(String(err))
      })
      .finally(() => isMounted && setLoading(false))
    return () => {
      isMounted = false
    }
  }, [])

  const apiStatus = useMemo(() => {
    if (loading) return 'Loading...'
    if (healthError) return 'Fail'
    if (health?.status === 'ok') return 'OK'
    return 'Unknown'
  }, [loading, healthError, health])

  const onEcho = useCallback(async () => {
    setEchoLoading(true)
    setEchoError(null)
    setEcho(null)
    try {
      const r = await fetch(`${apiBase}/echo?msg=Hello`)
      if (!r.ok) throw new Error(`HTTP ${r.status}`)
      const j = (await r.json()) as { echo: string }
      setEcho(j.echo)
    } catch (e) {
      setEchoError(String(e))
    } finally {
      setEchoLoading(false)
    }
  }, [])

  const loadOwners = useCallback(async () => {
    setOwnersLoading(true)
    setError(null)
    try {
      const r = await fetch(`${apiBase}/owners`)
      if (!r.ok) throw new Error(`HTTP ${r.status}`)
      const data = (await r.json()) as Owner[]
      setOwners(data)
    } catch (e) {
      setError(String(e))
    } finally {
      setOwnersLoading(false)
    }
  }, [])

  const loadCars = useCallback(async () => {
    setCarsLoading(true)
    setError(null)
    try {
      const r = await fetch(`${apiBase}/cars`)
      if (!r.ok) throw new Error(`HTTP ${r.status}`)
      const data = (await r.json()) as Car[]
      setCars(data)
    } catch (e) {
      setError(String(e))
    } finally {
      setCarsLoading(false)
    }
  }, [])

  const createOwner = useCallback(async (firstname: string, lastname: string) => {
    try {
      const r = await fetch(`${apiBase}/owners`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstname, lastname })
      })
      if (!r.ok) throw new Error(`HTTP ${r.status}`)
      await loadOwners()
    } catch (e) {
      setError(String(e))
    }
  }, [loadOwners])

  const createCar = useCallback(async (carData: Omit<Car, 'id'>) => {
    try {
      const r = await fetch(`${apiBase}/cars`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(carData)
      })
      if (!r.ok) throw new Error(`HTTP ${r.status}`)
      await loadCars()
    } catch (e) {
      setError(String(e))
    }
  }, [loadCars])

  return (
    <main className="min-h-dvh p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <h1 className="text-3xl font-bold">Hello React, Vladislav Pineker - IT2CCO-2301 Lab 8 & 9</h1>

        {/* API Status */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-white/10 p-4">
            <div className="text-sm text-white/60">API Status</div>
            <div className="mt-1 text-xl font-bold">{apiStatus}</div>
            {health?.version && (
              <div className="mt-1 text-xs text-white/60">v{health.version}</div>
            )}
            {healthError && (
              <div className="mt-2 text-sm text-red-400">{healthError}</div>
            )}
          </div>

          <div className="rounded-lg border border-white/10 p-4">
            <div className="text-sm text-white/60">Echo Test</div>
            <button
              onClick={onEcho}
              disabled={echoLoading}
              className="mt-2 rounded bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-50"
            >
              {echoLoading ? 'Sending...' : 'Send Hello'}
            </button>
            {echo && (
              <div className="mt-2 text-sm">Ответ: {echo}</div>
            )}
            {echoError && (
              <div className="mt-2 text-sm text-red-400">{echoError}</div>
            )}
          </div>
        </section>

        {/* Error Display */}
        {error && (
          <div className="rounded-lg bg-red-900/20 border border-red-500/20 p-4">
            <div className="text-red-400 font-medium">Ошибка:</div>
            <div className="text-red-300 text-sm mt-1">{error}</div>
          </div>
        )}

        {/* Owners Section */}
        <section className="rounded-lg border border-white/10 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Владельцы</h2>
            <button
              onClick={loadOwners}
              disabled={ownersLoading}
              className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-50"
            >
              {ownersLoading ? 'Загрузка...' : 'Обновить'}
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {owners.map((owner) => (
              <div key={owner.id} className="rounded border border-white/20 p-3">
                <div className="font-medium">{owner.firstname} {owner.lastname}</div>
                <div className="text-sm text-white/60">ID: {owner.id}</div>
              </div>
            ))}
          </div>
          
          {owners.length === 0 && !ownersLoading && (
            <div className="text-center text-white/60 py-8">
              Владельцы не найдены. Нажмите "Обновить" для загрузки.
            </div>
          )}
        </section>

        {/* Cars Section */}
        <section className="rounded-lg border border-white/10 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Автомобили</h2>
            <button
              onClick={loadCars}
              disabled={carsLoading}
              className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-50"
            >
              {carsLoading ? 'Загрузка...' : 'Обновить'}
            </button>
          </div>
          
          {/* Таблица соответствия Машина → Владелец */}
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left border-b border-white/10">
                  <th className="py-2 pr-4">Марка</th>
                  <th className="py-2 pr-4">Модель</th>
                  <th className="py-2 pr-4">Год</th>
                  <th className="py-2 pr-4">Рег. номер</th>
                  <th className="py-2 pr-4">Владелец</th>
                  <th className="py-2 pr-4 text-right">Цена</th>
                </tr>
              </thead>
              <tbody>
                {cars.map((car) => {
                  const owner = ownerIdToOwner.get(car.owner_id)
                  const ownerFullName = owner ? `${owner.firstname} ${owner.lastname}` : '—'
                  return (
                    <tr key={car.id} className="border-b border-white/5">
                      <td className="py-2 pr-4">{car.brand}</td>
                      <td className="py-2 pr-4">{car.model}</td>
                      <td className="py-2 pr-4">{car.model_year}</td>
                      <td className="py-2 pr-4">{car.registration_number}</td>
                      <td className="py-2 pr-4">{ownerFullName}</td>
                      <td className="py-2 pr-0 text-right text-green-400 font-medium">{car.price.toLocaleString()} ₸</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          
          {cars.length === 0 && !carsLoading && (
            <div className="text-center text-white/60 py-8">
              Автомобили не найдены. Нажмите "Обновить" для загрузки.
            </div>
          )}
        </section>

        {/* API Documentation Links */}
        <section className="rounded-lg border border-white/10 p-6">
          <h2 className="text-xl font-semibold mb-4">Документация API</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href={`${apiBase}/docs`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded bg-purple-600 px-4 py-3 text-center text-white hover:bg-purple-500 transition-colors"
            >
              Swagger UI
            </a>
            <a
              href={`${apiBase}/redoc`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded bg-orange-600 px-4 py-3 text-center text-white hover:bg-orange-500 transition-colors"
            >
              ReDoc
            </a>
            <a
              href={`${apiBase}/openapi.json`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded bg-gray-600 px-4 py-3 text-center text-white hover:bg-gray-500 transition-colors"
            >
              OpenAPI JSON
            </a>
            <a
              href={`/lab7`}
              className="rounded bg-emerald-700 px-4 py-3 text-center text-white hover:bg-emerald-600 transition-colors"
            >
              Lab 7 (React Basics)
            </a>
            <a
              href={`/lab10`}
              className="rounded bg-blue-600 px-4 py-3 text-center text-white hover:bg-blue-500 transition-colors"
            >
              Lab 10 (Car Shop)
            </a>
            <a
              href={`/lab11`}
              className="rounded bg-indigo-600 px-4 py-3 text-center text-white hover:bg-indigo-500 transition-colors"
            >
              Lab 11
            </a>
          </div>
        </section>
      </div>
    </main>
  )
}


