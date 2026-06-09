'use client'

import { useState, useEffect, useRef } from 'react'
import { isAuthenticated, setAuthenticated } from '@/lib/auth'

interface PinGateProps {
  children: React.ReactNode
}

export default function PinGate({ children }: PinGateProps) {
  const [authed, setAuthed] = useState<boolean | null>(null)
  const [pin, setPin] = useState('')
  const [error, setError] = useState(false)
  const [shake, setShake] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setAuthed(isAuthenticated())
  }, [])

  useEffect(() => {
    if (authed === false) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [authed])

  function handleDigit(d: string) {
    if (pin.length >= 4) return
    const next = pin + d
    setPin(next)
    setError(false)
    if (next.length === 4) {
      verify(next)
    }
  }

  function handleDelete() {
    setPin(p => p.slice(0, -1))
    setError(false)
  }

  async function verify(code: string) {
    const res = await fetch('/api/verify-pin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin: code }),
    })
    if (res.ok) {
      setAuthenticated()
      setAuthed(true)
    } else {
      setError(true)
      setShake(true)
      setTimeout(() => { setShake(false); setPin('') }, 600)
    }
  }

  if (authed === null) return null

  if (authed) return <>{children}</>

  const digits = ['1','2','3','4','5','6','7','8','9','','0','⌫']

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center px-6">
      <div className="mb-10 text-center">
        <div className="text-4xl mb-2">🥞</div>
        <h1 className="text-white text-2xl font-bold">Crêpe Tool</h1>
        <p className="text-gray-400 text-sm mt-1">Entrez votre code PIN</p>
      </div>

      {/* Dots */}
      <div className={`flex gap-4 mb-10 ${shake ? 'animate-shake' : ''}`}>
        {[0,1,2,3].map(i => (
          <div
            key={i}
            className={`w-4 h-4 rounded-full border-2 transition-colors duration-150 ${
              pin.length > i
                ? error ? 'bg-red-500 border-red-500' : 'bg-white border-white'
                : 'border-gray-500'
            }`}
          />
        ))}
      </div>

      {error && (
        <p className="text-red-400 text-sm mb-6 -mt-6">Code incorrect</p>
      )}

      {/* Keypad */}
      <div className="grid grid-cols-3 gap-4 w-72">
        {digits.map((d, i) => {
          if (d === '') return <div key={i} />
          return (
            <button
              key={i}
              onClick={() => d === '⌫' ? handleDelete() : handleDigit(d)}
              className="h-16 rounded-2xl bg-gray-700 hover:bg-gray-600 active:bg-gray-500 text-white text-2xl font-semibold transition-colors flex items-center justify-center"
            >
              {d}
            </button>
          )
        })}
      </div>
    </div>
  )
}
