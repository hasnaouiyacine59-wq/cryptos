import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getPair, type Pair } from '../api/dexscreener'
import { fmt } from '../utils/format'

export default function PairPage() {
  const { chainId, pairAddress } = useParams<{ chainId: string; pairAddress: string }>()
  const [pair, setPair] = useState<Pair | null>(null)

  useEffect(() => {
    if (chainId && pairAddress) getPair(chainId, pairAddress).then(setPair)
  }, [chainId, pairAddress])

  if (!pair) return <p className="p-6 text-gray-500">Loading pair...</p>

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-1">
        {pair.baseToken.symbol}/{pair.quoteToken.symbol}
      </h1>
      <p className="text-gray-400 text-sm mb-6">{pair.baseToken.name} · {pair.dexId} · {pair.chainId}</p>

      <div className="grid grid-cols-2 gap-4">
        {[
          ['Price', fmt.price(pair.priceUsd)],
          ['24h Change', fmt.pct(pair.priceChange?.h24)],
          ['24h Volume', fmt.usd(pair.volume?.h24)],
          ['Liquidity', fmt.usd(pair.liquidity?.usd)],
          ['FDV', fmt.usd(pair.fdv)],
          ['Age', pair.pairCreatedAt ? fmt.age(pair.pairCreatedAt) : '—'],
        ].map(([label, value]) => (
          <div key={label} className="bg-surface border border-border rounded p-4">
            <p className="text-xs text-gray-500 mb-1">{label}</p>
            <p className="font-semibold">{value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
