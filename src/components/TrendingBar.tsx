import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import type { Pair } from '../api/dexscreener'
import { getTopBoosted } from '../api/dexscreener'
import { TokenLogo } from './TokenLogo'

type TrendingItem = {
  chainId: string
  tokenAddress: string
  icon?: string
  symbol: string
  pairAddress: string
}

export function TrendingBar({ pairs }: { pairs: Pair[] }) {
  const [trending, setTrending] = useState<TrendingItem[]>([])

  useEffect(() => {
    getTopBoosted().then(async boosted => {
      const items = await Promise.allSettled(
        boosted.map(async b => {
          const { data } = await axios.get(
            `https://api.dexscreener.com/token-pairs/v1/${b.chainId}/${b.tokenAddress}`
          )
          const pair = Array.isArray(data) ? data[0] : null
          if (!pair) return null
          return {
            chainId: b.chainId,
            tokenAddress: b.tokenAddress,
            icon: b.icon ?? pair.info?.imageUrl,
            symbol: pair.baseToken.symbol,
            pairAddress: pair.pairAddress,
          } as TrendingItem
        })
      )
      setTrending(
        items
          .filter((r): r is PromiseFulfilledResult<TrendingItem> => r.status === 'fulfilled' && r.value !== null)
          .map(r => r.value)
      )
    })
  }, [])

  // fallback to pairs-based trending while loading
  const display = trending.length > 0 ? trending : (() => {
    const seen = new Set<string>()
    return [...pairs]
      .sort((a, b) => (b.volume?.h24 ?? 0) - (a.volume?.h24 ?? 0))
      .filter(p => { const s = p.baseToken.symbol.toUpperCase(); if (seen.has(s)) return false; seen.add(s); return true })
      .slice(0, 10)
      .map(p => ({ chainId: p.chainId, tokenAddress: p.baseToken.address, icon: p.info?.imageUrl, symbol: p.baseToken.symbol, pairAddress: p.pairAddress }))
  })()

  return (
    <div className="flex items-center gap-0 border-b border-border bg-[#0d0d0f] overflow-x-auto scrollbar-none">
      <span className="text-orange-500 text-base px-3 shrink-0">🔥</span>
      {display.map((item, i) => (
        <Link
          key={item.pairAddress || item.tokenAddress}
          to={`/pair/${item.chainId}/${item.pairAddress}`}
          className="flex items-center gap-1.5 px-4 py-2.5 border-l border-border hover:bg-white/5 transition-colors shrink-0 group"
        >
          <span className="text-gray-600 text-[11px] font-medium">#{i + 1}</span>
          <TokenLogo imageUrl={item.icon} symbol={item.symbol} size="sm" />
          <span className="text-white text-[13px] font-semibold tracking-wide group-hover:text-accent transition-colors">
            {item.symbol}
          </span>
        </Link>
      ))}
    </div>
  )
}
