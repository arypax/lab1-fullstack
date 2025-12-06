import React, { useCallback, useEffect, useRef, useState } from 'react'

export function Counter() {
  const [count, setCount] = useState<number>(0)
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    // side-effect example
    // console.log(`Counter is now ${count}`)
  }, [count])

  const onIncrement = useCallback(() => setCount((c) => c + 1), [])
  const onDecrement = useCallback(() => setCount((c) => c - 1), [])
  const onFocus = useCallback(() => inputRef.current?.focus(), [])

  return (
    <div className="rounded border border-white/10 p-4 space-y-3">
      <div className="text-sm text-white/60">Счётчик = {count}</div>
      <div className="flex gap-2">
        <button className="rounded bg-blue-600 px-3 py-1 text-white" onClick={onDecrement}>-1</button>
        <button className="rounded bg-emerald-600 px-3 py-1 text-white" onClick={onIncrement}>+1</button>
      </div>
      <div className="flex items-center gap-2">
        <input ref={inputRef} className="bg-black/20 rounded px-2 py-1 border border-white/10" placeholder="Поле для фокуса" />
        <button className="rounded bg-purple-600 px-3 py-1 text-white" onClick={onFocus}>Фокус</button>
      </div>
    </div>
  )
}


