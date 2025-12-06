import React, { useState } from 'react'

export function FormExamples() {
  // Single field (controlled)
  const [text, setText] = useState<string>('')

  // Object state for multiple fields
  type UserForm = { firstName: string; lastName: string; email: string }
  const [user, setUser] = useState<UserForm>({ firstName: '', lastName: '', email: '' })

  const onSubmitSingle = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    alert(`Вы ввели: ${text}`)
  }

  const onSubmitUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    alert(`Привет, ${user.firstName} ${user.lastName}`)
  }

  const onUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUser((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <form onSubmit={onSubmitSingle} className="rounded border border-white/10 p-4 space-y-3">
        <div className="font-medium">Одно поле ввода</div>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full bg-black/20 rounded px-2 py-1 border border-white/10"
          placeholder="Введите текст..."
        />
        <button className="rounded bg-blue-600 px-3 py-1 text-white">Отправить</button>
      </form>

      <form onSubmit={onSubmitUser} className="rounded border border-white/10 p-4 space-y-3">
        <div className="font-medium">Форма пользователя (объект состояния)</div>
        <div className="grid gap-2">
          <input
            name="firstName"
            value={user.firstName}
            onChange={onUserChange}
            className="w-full bg-black/20 rounded px-2 py-1 border border-white/10"
            placeholder="Имя"
          />
          <input
            name="lastName"
            value={user.lastName}
            onChange={onUserChange}
            className="w-full bg-black/20 rounded px-2 py-1 border border-white/10"
            placeholder="Фамилия"
          />
          <input
            name="email"
            type="email"
            value={user.email}
            onChange={onUserChange}
            className="w-full bg-black/20 rounded px-2 py-1 border border-white/10"
            placeholder="Email"
          />
        </div>
        <button className="rounded bg-emerald-600 px-3 py-1 text-white">Отправить</button>
      </form>
    </div>
  )
}


