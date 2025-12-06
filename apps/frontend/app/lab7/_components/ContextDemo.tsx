import React, { useState } from 'react'
import { AuthProvider, useAuth } from '../_context/AuthContext'

function InnerConsumer() {
  const { userName, login, logout } = useAuth()
  const [name, setName] = useState('Иван')
  return (
    <div className="space-y-3">
      <div className="text-sm text-white/70">Аутентифицированный пользователь: {userName ?? '—'}</div>
      <div className="flex items-center gap-2">
        <input
          className="bg-black/20 rounded px-2 py-1 border border-white/10"
          placeholder="Имя пользователя"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button className="rounded bg-emerald-600 px-3 py-1 text-white" onClick={() => login(name)}>Войти</button>
        <button className="rounded bg-red-600 px-3 py-1 text-white" onClick={logout}>Выйти</button>
      </div>
    </div>
  )
}

export function ContextDemo() {
  return (
    <div className="rounded border border-white/10 p-4">
      <AuthProvider>
        <InnerConsumer />
      </AuthProvider>
    </div>
  )
}


