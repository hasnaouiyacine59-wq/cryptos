import { useState } from 'react'
import type { Pair } from '../api/dexscreener'

const KEY = 'watchlist'

function load(): Pair[] {
  try { return JSON.parse(localStorage.getItem(KEY) ?? '[]') } catch { return [] }
}

export function useWatchlist() {
  const [items, setItems] = useState<Pair[]>(load)

  const add = (pair: Pair) => {
    setItems(prev => {
      if (prev.find(p => p.pairAddress === pair.pairAddress)) return prev
      const next = [...prev, pair]
      localStorage.setItem(KEY, JSON.stringify(next))
      return next
    })
  }

  const remove = (pairAddress: string) => {
    setItems(prev => {
      const next = prev.filter(p => p.pairAddress !== pairAddress)
      localStorage.setItem(KEY, JSON.stringify(next))
      return next
    })
  }

  const has = (pairAddress: string) => items.some(p => p.pairAddress === pairAddress)

  return { items, add, remove, has }
}
