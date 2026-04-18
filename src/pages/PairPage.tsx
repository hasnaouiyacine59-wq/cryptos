import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getPair, type Pair } from '../api/dexscreener'
import { ChainIcon, TokenLogo } from '../components/TokenLogo'
import { useWatchlist } from '../hooks/useWatchlist'
import { fmt } from '../utils/format'

export default function PairPage() {
  const { chainId, pairAddress } = useParams<{ chainId: string; pairAddress: string }>()
  const [pair, setPair] = useState<Pair | null>(null)
  const { add, remove, has } = useWatchlist()

  useEffect(() => {
    if (chainId && pairAddress) {
      getPair(chainId, pairAddress).then(setPair)
      const t = setInterval(() => getPair(chainId, pairAddress).then(setPair), 15000)
      return () => clearInterval(t)
    }
  }, [chainId, pairAddress])

  if (!pair) return <p className="p-6 text-gray-500">Loading pair...</p>

  const watched = has(pair.pairAddress)
  const buys = pair.txns?.h24?.buys ?? 0
  const sells = pair.txns?.h24?.sells ?? 0
  const total = buys + sells
  const buyPct = total > 0 ? Math.round((buys / total) * 100) : 50

  return (
    <div className="flex gap-6 p-6 w-full">

      {/* Main Content */}
      <div className="flex-1 min-w-0 space-y-5">

        {/* Header */}
        <div className="flex items-center gap-4 bg-surface border border-border rounded-xl p-4">
          <TokenLogo imageUrl={pair.info?.imageUrl} symbol={pair.baseToken.symbol} />
          <div className="min-w-0">
            <h1 className="text-xl font-bold flex items-center gap-2 flex-wrap">
              {pair.baseToken.symbol}
              <span className="text-gray-500 font-normal">/ {pair.quoteToken.symbol}</span>
              <ChainIcon chainId={pair.chainId} />
            </h1>
            <p className="text-gray-400 text-sm truncate">{pair.baseToken.name} · <span className="capitalize">{pair.dexId}</span></p>
          </div>
          <div className="ml-auto flex items-center gap-3 shrink-0">
            <div className="text-right">
              <p className="text-2xl font-bold font-mono">{fmt.price(pair.priceUsd)}</p>
              <p className={`text-sm font-medium ${(pair.priceChange?.h24 ?? 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {fmt.pct(pair.priceChange?.h24)} <span className="text-gray-500 font-normal">24h</span>
              </p>
            </div>
            <button
              onClick={() => watched ? remove(pair.pairAddress) : add(pair)}
              className={`px-3 py-1.5 rounded-lg border text-sm transition-colors ${
                watched
                  ? 'border-yellow-400 text-yellow-400 hover:bg-yellow-400/10'
                  : 'border-gray-600 text-gray-400 hover:border-yellow-400 hover:text-yellow-400'
              }`}
            >
              {watched ? '⭐ Watching' : '☆ Watch'}
            </button>
          </div>
        </div>

        {/* Price Changes */}
        <div className="grid grid-cols-4 gap-3">
          {([['5m', pair.priceChange?.m5], ['1h', pair.priceChange?.h1], ['6h', pair.priceChange?.h6], ['24h', pair.priceChange?.h24]] as [string, number | undefined][]).map(([label, raw]) => (
            <div key={label} className="bg-surface border border-border rounded-xl p-3 text-center">
              <p className="text-xs text-gray-500 mb-1">{label}</p>
              <p className={`font-bold text-base ${(raw ?? 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>{fmt.pct(raw)}</p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            ['24h Volume', fmt.usd(pair.volume?.h24)],
            ['Liquidity', fmt.usd(pair.liquidity?.usd)],
            ['FDV', fmt.usd(pair.fdv)],
            ['Market Cap', fmt.usd(pair.marketCap)],
            ['Pair Age', pair.pairCreatedAt ? fmt.age(pair.pairCreatedAt) : '—'],
            ['Chain', pair.chainId],
          ].map(([label, value]) => (
            <div key={label} className="bg-surface border border-border rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1">{label}</p>
              <p className="font-semibold capitalize">{value}</p>
            </div>
          ))}
        </div>

        {/* Buy/Sell Pressure */}
        <div className="bg-surface border border-border rounded-xl p-4">
          <p className="text-xs text-gray-500 mb-3">Buy / Sell Pressure (24h)</p>
          <div className="flex rounded-full overflow-hidden h-3 mb-2">
            <div className="bg-green-500 transition-all" style={{ width: `${buyPct}%` }} />
            <div className="bg-red-500 flex-1" />
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-green-400">🟢 {buys} buys ({buyPct}%)</span>
            <span className="text-red-400">{sells} sells ({100 - buyPct}%) 🔴</span>
          </div>
        </div>

        {/* Pair Address */}
        <p className="text-xs text-gray-600 break-all px-1">Pair: {pair.pairAddress}</p>
      </div>



    </div>
  )
}
