"use client"

import { useEffect, useState } from 'react'

type CarData = {
  car: {
    brand: string
    model: string
  }
}

// Демо API - используем JSONPlaceholder для имитации
const fetchCarData = async (carId: number): Promise<CarData> => {
  // Имитируем задержку сети (случайная от 500 до 2000мс)
  const delay = Math.random() * 1500 + 500
  await new Promise((resolve) => setTimeout(resolve, delay))

  // Демо данные
  const brands = ['Ford', 'Toyota', 'BMW', 'Mercedes', 'Audi']
  const models = ['Mustang', 'Camry', 'X5', 'C-Class', 'A4']

  return {
    car: {
      brand: brands[carId % brands.length],
      model: models[carId % models.length],
    },
  }
}

export function RaceConditionDemo() {
  const [carId, setCarId] = useState(1)
  const [data, setData] = useState<CarData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [requestOrder, setRequestOrder] = useState<number[]>([])

  useEffect(() => {
    let ignore = false
    setIsLoading(true)
    setRequestOrder((prev) => [...prev, carId])

    fetchCarData(carId)
      .then((cardata) => {
        if (!ignore) {
          setData(cardata)
          setIsLoading(false)
        }
      })
      .catch((err) => {
        console.error('Error:', err)
        if (!ignore) {
          setIsLoading(false)
        }
      })

    // Cleanup function для предотвращения race condition
    return () => {
      ignore = true
    }
  }, [carId])

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-center">
        <label className="text-white/70">ID автомобиля:</label>
        <input
          type="number"
          min="1"
          max="10"
          value={carId}
          onChange={(e) => setCarId(Number(e.target.value))}
          className="w-20 px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={() => {
            // Быстро меняем ID несколько раз для демонстрации race condition
            for (let i = 1; i <= 5; i++) {
              setTimeout(() => setCarId(i), i * 100)
            }
          }}
          className="px-4 py-1 rounded-lg bg-yellow-600 hover:bg-yellow-700 text-white text-sm"
        >
          Быстрая смена (демо race condition)
        </button>
      </div>

      <div className="text-sm text-white/60">
        Порядок запросов: {requestOrder.join(' → ')}
      </div>

      {isLoading && <div className="text-white/70">Загрузка...</div>}

      {!isLoading && data && (
        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
          <p className="text-lg">
            <span className="font-semibold">Марка:</span> {data.car.brand}
          </p>
          <p className="text-lg">
            <span className="font-semibold">Модель:</span> {data.car.model}
          </p>
        </div>
      )}
    </div>
  )
}

