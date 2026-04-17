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

  return (
    <div className="flex gap-6 p-6">
    <div className="flex-1 max-w-3xl">
      <div className="flex items-center gap-4 mb-6">
        <TokenLogo imageUrl={pair.info?.imageUrl} symbol={pair.baseToken.symbol} />
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            {pair.baseToken.symbol}/{pair.quoteToken.symbol}
            <ChainIcon chainId={pair.chainId} />
          </h1>
          <p className="text-gray-400 text-sm">{pair.baseToken.name} · {pair.dexId}</p>
        </div>
        <button
          onClick={() => watched ? remove(pair.pairAddress) : add(pair)}
          className={`ml-auto px-4 py-2 rounded border text-sm transition-colors ${
            watched
              ? 'border-yellow-400 text-yellow-400 hover:bg-yellow-400/10'
              : 'border-gray-600 text-gray-400 hover:border-yellow-400 hover:text-yellow-400'
          }`}
        >
          {watched ? '⭐ Watching' : '☆ Watch'}
        </button>
      </div>

      <div className="text-3xl font-bold font-mono mb-6">{fmt.price(pair.priceUsd)}</div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          ['5m', fmt.pct(pair.priceChange?.m5), pair.priceChange?.m5],
          ['1h', fmt.pct(pair.priceChange?.h1), pair.priceChange?.h1],
          ['6h', fmt.pct(pair.priceChange?.h6), pair.priceChange?.h6],
          ['24h', fmt.pct(pair.priceChange?.h24), pair.priceChange?.h24],
        ].map(([label, value, raw]) => (
          <div key={label as string} className="bg-surface border border-border rounded p-3 text-center">
            <p className="text-xs text-gray-500 mb-1">{label}</p>
            <p className={`font-bold text-lg ${Number(raw) >= 0 ? 'text-green-400' : 'text-red-400'}`}>{value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          ['24h Volume', fmt.usd(pair.volume?.h24)],
          ['Liquidity', fmt.usd(pair.liquidity?.usd)],
          ['FDV', fmt.usd(pair.fdv)],
          ['Buys (24h)', pair.txns?.h24?.buys?.toString() ?? '—'],
          ['Sells (24h)', pair.txns?.h24?.sells?.toString() ?? '—'],
          ['Pair Age', pair.pairCreatedAt ? fmt.age(pair.pairCreatedAt) : '—'],
        ].map(([label, value]) => (
          <div key={label} className="bg-surface border border-border rounded p-4">
            <p className="text-xs text-gray-500 mb-1">{label}</p>
            <p className="font-semibold">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 text-xs text-gray-600 break-all">
        Pair: {pair.pairAddress}
      </div>
    </div>

      {/* Sidebar Ad */}
      <div className="hidden lg:block w-[160px] shrink-0 sticky top-6 self-start">
        {/* BEGIN AADS AD UNIT 2434803 */}
        <div id="frame" style={{ width: '100%', margin: 'auto', position: 'relative', zIndex: 99998 }}>
          <iframe
            data-aa='2434803'
            src='//acceptable.a-ads.com/2434803/?size=Adaptive'
            style={{ border: 0, padding: 0, width: '70%', height: 'auto', overflow: 'hidden', display: 'block', margin: 'auto' }}
          />
        </div>
        {/* END AADS AD UNIT 2434803 */}
      </div>
    </div>
  )
}
