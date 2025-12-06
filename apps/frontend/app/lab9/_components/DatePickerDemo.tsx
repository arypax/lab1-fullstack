"use client"

import { useState } from 'react'
import DatePicker from 'react-date-picker'
import 'react-date-picker/dist/DatePicker.css'
import 'react-calendar/dist/Calendar.css'

export function DatePickerDemo() {
  const [date, setDate] = useState<Date | null>(new Date())

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-lg bg-white/5 border border-white/10">
        <p className="text-sm text-white/70 mb-2">Выбранная дата:</p>
        <p className="text-lg font-semibold">
          {date ? date.toLocaleDateString('ru-RU') : 'Не выбрана'}
        </p>
      </div>

      <div className="p-4 rounded-lg bg-white/5 border border-white/10">
        <label className="block text-sm text-white/70 mb-2">Выберите дату:</label>
        <DatePicker
          onChange={setDate}
          value={date}
          className="bg-white/5"
        />
      </div>

      <div className="text-xs text-white/60">
        Компонент react-date-picker установлен через npm и используется для выбора даты.
      </div>
    </div>
  )
}

