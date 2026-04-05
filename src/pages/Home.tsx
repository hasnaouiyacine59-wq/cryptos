import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { searchPairs, type Pair } from '../api/dexscreener'
import { ChainIcon, PriceCell, TokenLogo } from '../components/TokenLogo'
import { TrendingBar } from '../components/TrendingBar'
import { Sparkline } from '../components/Sparkline'
import { BuyVolBar } from '../components/BuyVolBar'
import { FilterSort, type SortKey } from '../components/FilterSort'
import { fmt } from '../utils/format'

const REFRESH_MS = 15000

function pctColor(v: number) {
  if (v == null) return 'text-gray-500'
  return v >= 0 ? 'text-green-400' : 'text-red-400'
}

function getNestedVal(obj: Pair, key: SortKey): number {
  const parts = key.split('.')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return parts.reduce((o: any, k) => o?.[k], obj) ?? 0
}

export default function Home() {
  const [pairs, setPairs] = useState<Pair[]>([])
  const [prevPrices, setPrevPrices] = useState<Record<string, string>>({})
  const [query, setQuery] = useState('ETH')
  const [loading, setLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [sortKey, setSortKey] = useState<SortKey>('priceChange.h24')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const fetchPairs = useCallback(async (q: string) => {
    try {
      const data = await searchPairs(q)
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
            placeholder="Search pairs..."
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
          <table className="w-full text-sm min-w-[1100px]">
            <thead>
              <tr className="text-gray-500 border-b border-border text-left text-xs uppercase tracking-wider sticky top-0 bg-bg z-10">
                <th className="pb-3 px-4 w-8">#</th>
                <th className="pb-3 pr-4">Pair</th>
                <th className="pb-3 pr-4">Price</th>
                <th className="pb-3 pr-4">Last 7 Days</th>
                <th className="pb-3 pr-4">2H Volume</th>
                <th className="pb-3 pr-4">MCap</th>
                <th className="pb-3 pr-4">Liquidity</th>
                <th className="pb-3 pr-4">Pair Age</th>
                <th className="pb-3 pr-4">Buy Tax</th>
                <th className="pb-3 pr-4">Sell Tax</th>
                <th className="pb-3 pr-4 text-right">5m</th>
                <th className="pb-3 pr-4 text-right">1h</th>
                <th className="pb-3 pr-4 text-right">6h</th>
                <th className="pb-3 pr-4 text-right">24h</th>
                <th className="pb-3 pr-4 text-right">24h Vol</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((p, i) => (
                <tr
                  key={p.pairAddress}
                  className="border-b border-border hover:bg-surface transition-colors"
                >
                  <td className="py-3 px-4 text-gray-500">{i + 1}</td>

                  {/* Pair */}
                  <td className="py-3 pr-4">
                    <Link to={`/pair/${p.chainId}/${p.pairAddress}`} className="flex items-center gap-2 hover:opacity-80">
                      <div className="relative">
                        <TokenLogo imageUrl={p.info?.imageUrl} symbol={p.baseToken.symbol} />
                        <span className="absolute -bottom-0.5 -right-0.5">
                          <ChainIcon chainId={p.chainId} />
                        </span>
                      </div>
                      <div>
                        <div className="font-semibold text-white">
                          <span className="text-white">{p.baseToken.symbol}</span>
                          <span className="text-gray-500">/{p.quoteToken.symbol}</span>
                          <span className="ml-1 text-[10px] text-gray-600 bg-surface border border-border rounded px-1">{p.dexId}</span>
                        </div>
                        <div className="text-xs text-gray-500 truncate max-w-[140px]">{p.baseToken.name}</div>
                      </div>
                    </Link>
                  </td>

                  {/* Price */}
                  <td className="py-3 pr-4">
                    <PriceCell
                      value={fmt.price(p.priceUsd)}
                      prev={fmt.price(prevPrices[p.pairAddress] ?? p.priceUsd)}
                    />
                  </td>

                  {/* Sparkline */}
                  <td className="py-3 pr-4">
                    <Sparkline change24h={p.priceChange?.h24 ?? 0} />
                  </td>

                  {/* 2H Volume bar */}
                  <td className="py-3 pr-4">
                    <BuyVolBar
                      buys={p.txns?.h24?.buys}
                      sells={p.txns?.h24?.sells}
                    />
                  </td>

                  {/* MCap */}
                  <td className="py-3 pr-4 text-gray-300">{fmt.usd(p.marketCap ?? p.fdv)}</td>

                  {/* Liquidity */}
                  <td className="py-3 pr-4 text-gray-300">{fmt.usd(p.liquidity?.usd)}</td>

                  {/* Pair Age */}
                  <td className="py-3 pr-4 text-gray-400">{p.pairCreatedAt ? fmt.age(p.pairCreatedAt) : '—'}</td>

                  {/* Buy Tax */}
                  <td className="py-3 pr-4 text-gray-400">—</td>

                  {/* Sell Tax */}
                  <td className="py-3 pr-4 text-gray-400">—</td>

                  {/* Changes */}
                  <td className={`py-3 pr-4 text-right ${pctColor(p.priceChange?.m5)}`}>{fmt.pct(p.priceChange?.m5)}</td>
                  <td className={`py-3 pr-4 text-right ${pctColor(p.priceChange?.h1)}`}>{fmt.pct(p.priceChange?.h1)}</td>
                  <td className={`py-3 pr-4 text-right ${pctColor(p.priceChange?.h6)}`}>{fmt.pct(p.priceChange?.h6)}</td>
                  <td className={`py-3 pr-4 text-right font-semibold ${pctColor(p.priceChange?.h24)}`}>{fmt.pct(p.priceChange?.h24)}</td>
                  <td className="py-3 pr-4 text-right text-gray-300">{fmt.usd(p.volume?.h24)}</td>
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
