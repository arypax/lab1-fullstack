import React, { useState } from 'react'

export function Conditional() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)

  return (
    <div className="rounded border border-white/10 p-4 space-y-3">
      {isLoggedIn ? (
        <div className="flex items-center justify-between">
          <div>Добро пожаловать!</div>
          <button className="rounded bg-red-600 px-3 py-1 text-white" onClick={() => setIsLoggedIn(false)}>Выйти</button>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <div>Пожалуйста, войдите</div>
          <button className="rounded bg-emerald-600 px-3 py-1 text-white" onClick={() => setIsLoggedIn(true)}>Войти</button>
        </div>
      )}
    </div>
  )
}


