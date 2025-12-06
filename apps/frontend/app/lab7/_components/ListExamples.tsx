import React from 'react'

type Car = { id: number; brand: string; model: string }

const nums = [1, 2, 3, 4, 5]
const cars: Car[] = [
  { id: 1, brand: 'Ford', model: 'Mustang' },
  { id: 2, brand: 'VW', model: 'Beetle' },
  { id: 3, brand: 'Tesla', model: 'Model S' },
]

export function ListExamples() {
  return (
    <div className="space-y-6">
      <div>
        <div className="text-sm text-white/70 mb-1">Маркированный список (map + key)</div>
        <ul className="list-disc pl-6">
          {nums.map((n) => (
            <li key={n}>Элемент {n}</li>
          ))}
        </ul>
      </div>

      <div>
        <div className="text-sm text-white/70 mb-1">Таблица (объекты + key=id)</div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left border-b border-white/10">
                <th className="py-2 pr-4">ID</th>
                <th className="py-2 pr-4">Марка</th>
                <th className="py-2 pr-4">Модель</th>
              </tr>
            </thead>
            <tbody>
              {cars.map((c) => (
                <tr key={c.id} className="border-b border-white/5">
                  <td className="py-2 pr-4">{c.id}</td>
                  <td className="py-2 pr-4">{c.brand}</td>
                  <td className="py-2 pr-4">{c.model}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}


