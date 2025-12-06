import React, { memo } from 'react'

export type HelloProps = {
  firstName: string
  lastName?: string
  onGreetClick?: (msg: string) => void
}

export const Hello = memo(function Hello({ firstName, lastName, onGreetClick }: HelloProps) {
  const fullName = lastName ? `${firstName} ${lastName}` : firstName
  return (
    <div className="flex items-center gap-3">
      <div className="text-lg">Привет, <span className="font-semibold">{fullName}</span>!</div>
      {onGreetClick && (
        <button
          className="rounded bg-emerald-600 px-3 py-1 text-sm text-white hover:bg-emerald-500"
          onClick={() => onGreetClick(`Привет от ${fullName}`)}
        >
          Приветствовать
        </button>
      )}
    </div>
  )
})


