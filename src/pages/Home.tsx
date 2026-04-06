import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { searchPairs, searchPairsBroad, type Pair } from '../api/dexscreener'
import { ChainIcon, PriceCell, TokenLogo } from '../components/TokenLogo'
import { TrendingBar } from '../components/TrendingBar'
import { Sparkline } from '../components/Sparkline'
import { BuyVolBar } from '../components/BuyVolBar'
import { FilterSort, type SortKey } from '../components/FilterSort'
import { fmt } from '../utils/format'

const REFRESH_MS = 15000

function PctBadge({ v, bold }: { v: number; bold?: boolean }) {
  if (v == null || isNaN(v)) return <span className="text-gray-600 text-xs">—</span>
  const up = v >= 0
  return (
    <span className={`inline-block text-xs px-1.5 py-0.5 rounded ${bold ? 'font-semibold' : ''} ${
      up ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10'
    }`}>
      {v > 0 ? '+' : ''}{v.toFixed(2)}%
    </span>
  )
}

function getNestedVal(obj: Pair, key: SortKey): number {
  const parts = key.split('.')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return parts.reduce((o: any, k) => o?.[k], obj) ?? 0
}

export default function Home() {
  const [pairs, setPairs] = useState<Pair[]>([])
  const [prevPrices, setPrevPrices] = useState<Record<string, string>>({})
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [sortKey, setSortKey] = useState<SortKey>('priceChange.h24')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const fetchPairs = useCallback(async (q: string) => {
    try {
      const data = await (q.length > 1 ? searchPairs(q) : searchPairsBroad(q))
      setPairs(prev => {
        const prices: Record<string, string> = {}
        prev.forEach(p => { prices[p.pairAddress] = p.priceUsd })
        setPrevPrices(prices)
        return data
      })
      setLastUpdated(new Date())
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    setLoading(true)
    fetchPairs(query)
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => fetchPairs(query), REFRESH_MS)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [query, fetchPairs])

  const sorted = [...pairs].sort((a, b) => {
    const av = getNestedVal(a, sortKey)
    const bv = getNestedVal(b, sortKey)
    return sortDir === 'desc' ? bv - av : av - bv
  })

  return (
    <div className="flex flex-col min-h-0">
      <TrendingBar pairs={pairs} />

      {/* Search bar */}
      <div className="flex items-center gap-4 px-6 py-4 border-b border-border">
        <div className="relative flex-1 max-w-lg">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">🔍</span>
          <input
            className="w-full bg-surface border border-border rounded-lg pl-9 pr-4 py-2 text-sm outline-none focus:border-accent placeholder-gray-600"
            placeholder="Search token or pair..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>
        {lastUpdated && (
          <span className="text-xs text-gray-500 flex items-center gap-1.5">
            {fmt.time(lastUpdated)}
            <span className="inline-block w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          </span>
        )}
      </div>

      {loading && pairs.length === 0 ? (
        <p className="text-gray-500 text-sm p-6">Loading...</p>
      ) : (
        <div className="overflow-x-auto pb-20">
          <table className="w-full text-sm min-w-[1200px] border-separate border-spacing-0">
            <thead>
              <tr className="text-gray-500 text-left text-[11px] uppercase tracking-wider sticky top-0 bg-[#0d0d0f] z-10">
                <th className="py-3 px-4 w-8 font-medium">#</th>
                <th className="py-3 pr-4 font-medium">Pair</th>
                <th className="py-3 pr-4 font-medium">Price</th>
                <th className="py-3 pr-4 font-medium">7D Chart</th>
                <th className="py-3 pr-4 font-medium">Buy/Sell</th>
                <th className="py-3 pr-6 font-medium text-right">MCap</th>
                <th className="py-3 pr-6 font-medium text-right">Liquidity</th>
                <th className="py-3 pr-4 font-medium">Age</th>
                <th className="py-3 pr-4 font-medium text-center">Buy Tax</th>
                <th className="py-3 pr-6 font-medium text-center">Sell Tax</th>
                <th className="py-3 pr-3 font-medium text-right">5m</th>
                <th className="py-3 pr-3 font-medium text-right">1h</th>
                <th className="py-3 pr-3 font-medium text-right">6h</th>
                <th className="py-3 pr-3 font-medium text-right">24h</th>
                <th className="py-3 pr-4 font-medium text-right">24h Vol</th>
              </tr>
              <tr><td colSpan={15} className="h-px bg-border p-0" /></tr>
            </thead>
            <tbody>
              {sorted.map((p, i) => (
                <tr
                  key={p.pairAddress}
                  className="group hover:bg-white/[0.03] transition-colors"
                >
                  <td className="py-3 px-4 text-gray-600 text-xs">{i + 1}</td>

                  {/* Pair */}
                  <td className="py-3 pr-4">
                    <Link to={`/pair/${p.chainId}/${p.pairAddress}`} className="flex items-center gap-2.5 hover:opacity-90">
                      <div className="relative shrink-0 w-10 h-8">
                        {/* quote token — behind */}
                        <span className="absolute left-4 top-0">
                          <TokenLogo imageUrl={undefined} symbol={p.quoteToken.symbol} />
                        </span>
                        {/* base token — front */}
                        <span className="absolute left-0 top-0 ring-2 ring-bg rounded-full">
                          <TokenLogo imageUrl={p.info?.imageUrl} symbol={p.baseToken.symbol} />
                        </span>
                        {/* chain badge */}
                        <span className="absolute -bottom-0.5 right-0 ring-1 ring-bg rounded-full">
                          <ChainIcon chainId={p.chainId} />
                        </span>
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-white text-sm leading-tight">
                          {p.baseToken.symbol}
                          <span className="text-gray-500 font-normal">/{p.quoteToken.symbol}</span>
                        </div>
                        <div className="flex items-center gap-1 mt-0.5">
                          <span className="text-[10px] text-gray-600 truncate max-w-[100px]">{p.baseToken.name}</span>
                          <span className="text-[9px] text-gray-700 bg-white/5 border border-white/10 rounded px-1 py-px shrink-0">{p.dexId}</span>
                        </div>
                      </div>
                    </Link>
                  </td>

                  {/* Price */}
                  <td className="py-3 pr-4 font-mono text-sm">
                    <PriceCell
                      value={fmt.price(p.priceUsd)}
                      prev={fmt.price(prevPrices[p.pairAddress] ?? p.priceUsd)}
                    />
                  </td>

                  {/* Sparkline */}
                  <td className="py-3 pr-4">
                    <Sparkline change24h={p.priceChange?.h24 ?? 0} />
                  </td>

                  {/* Buy/Sell bar */}
                  <td className="py-3 pr-4">
                    <BuyVolBar buys={p.txns?.h24?.buys} sells={p.txns?.h24?.sells} />
                  </td>

                  {/* MCap */}
                  <td className="py-3 pr-6 text-right text-gray-300 tabular-nums">{fmt.usd(p.marketCap ?? p.fdv)}</td>

                  {/* Liquidity */}
                  <td className="py-3 pr-6 text-right text-gray-300 tabular-nums">{fmt.usd(p.liquidity?.usd)}</td>

                  {/* Age */}
                  <td className="py-3 pr-4">
                    <span className="text-xs text-gray-500 bg-white/5 rounded px-1.5 py-0.5">
                      {p.pairCreatedAt ? fmt.age(p.pairCreatedAt) : '—'}
                    </span>
                  </td>

                  {/* Buy Tax */}
                  <td className="py-3 pr-4 text-center">
                    <span className="text-xs text-gray-600">—</span>
                  </td>

                  {/* Sell Tax */}
                  <td className="py-3 pr-6 text-center">
                    <span className="text-xs text-gray-600">—</span>
                  </td>

                  {/* % Changes */}
                  <td className="py-3 pr-3 text-right tabular-nums">
                    <PctBadge v={p.priceChange?.m5} />
                  </td>
                  <td className="py-3 pr-3 text-right tabular-nums">
                    <PctBadge v={p.priceChange?.h1} />
                  </td>
                  <td className="py-3 pr-3 text-right tabular-nums">
                    <PctBadge v={p.priceChange?.h6} />
                  </td>
                  <td className="py-3 pr-3 text-right tabular-nums">
                    <PctBadge v={p.priceChange?.h24} bold />
                  </td>

                  {/* 24h Vol */}
                  <td className="py-3 pr-4 text-right text-gray-300 tabular-nums">{fmt.usd(p.volume?.h24)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <FilterSort
        onApply={(key, dir) => { setSortKey(key); setSortDir(dir) }}
        onReset={() => { setSortKey('priceChange.h24'); setSortDir('desc') }}
      />
    </div>
  )
}
