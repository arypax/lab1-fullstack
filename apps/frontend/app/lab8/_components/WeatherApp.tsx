"use client"

import { useState, useEffect } from 'react'

type WeatherData = {
  temp: string
  desc: string
  icon: string
}

export function WeatherApp() {
  const [weather, setWeather] = useState<WeatherData>({
    temp: '',
    desc: '',
    icon: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [apiKey, setApiKey] = useState<string>('')
  const [useCustomKey, setUseCustomKey] = useState(false)

  // Загружаем ключ из переменной окружения при монтировании
  useEffect(() => {
    const envKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY
    if (envKey && envKey !== 'YOUR_API_KEY') {
      setApiKey(envKey)
    }
  }, [])

  const fetchWeather = (key: string) => {
    if (!key || key.trim() === '') {
      setError('Введите API ключ')
      return
    }

    setIsLoading(true)
    setError(null)

    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=London&units=metric&appid=${key}`
    )
      .then((response) => {
        if (!response.ok) {
          return response.json().then((err) => {
            throw new Error(err.message || `HTTP ${response.status}: ${response.statusText}`)
          })
        }
        return response.json()
      })
      .then((result) => {
        setWeather({
          temp: Math.round(result.main.temp).toString(),
          desc: result.weather[0].main,
          icon: result.weather[0].icon,
        })
        setIsLoading(false)
      })
      .catch((err) => {
        console.error('Weather fetch error:', err)
        setError(err.message || 'Ошибка загрузки данных')
        setWeather({
          temp: 'Error',
          desc: 'Ошибка загрузки',
          icon: '',
        })
        setIsLoading(false)
      })
  }

  // Автоматически загружаем погоду при монтировании, если есть ключ из env
  useEffect(() => {
    if (apiKey && !useCustomKey) {
      fetchWeather(apiKey)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiKey, useCustomKey])

  if (isLoading) {
    return <div className="text-white/70">Загрузка...</div>
  }

  if (error && !weather.icon) {
    return (
      <div className="space-y-4">
        <div className="p-4 rounded-lg bg-red-500/20 border border-red-500/50">
          <p className="text-red-200 font-semibold mb-2">❌ Ошибка загрузки</p>
          <p className="text-sm text-red-200/80 mb-3">{error}</p>
          
          <div className="space-y-2">
            <p className="text-xs text-red-200/60 font-semibold">Попробуйте ввести ключ вручную:</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Вставьте ваш API ключ"
                className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
              />
              <button
                onClick={() => {
                  setUseCustomKey(true)
                  fetchWeather(apiKey)
                }}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium"
              >
                Попробовать
              </button>
            </div>
            <p className="text-xs text-red-200/60 mt-2">
              ⚠️ API ключ может активироваться до 2 часов после подтверждения email
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (weather.icon) {
    return (
      <div className="space-y-3">
        <p className="text-lg">
          <span className="font-semibold">Температура:</span> {weather.temp} °C
        </p>
        <p className="text-lg">
          <span className="font-semibold">Описание:</span> {weather.desc}
        </p>
        <img
          src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
          alt="Weather icon"
          className="w-20 h-20"
        />
      </div>
    )
  }

  return <div className="text-white/70">Нет данных</div>
}

