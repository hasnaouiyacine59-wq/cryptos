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
    setPage(1)
    fetchPairs(query)
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => fetchPairs(query), REFRESH_MS)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [query, fetchPairs])

  const [page, setPage] = useState(1)
  const PAGE_SIZE = 20

  const sorted = [...pairs].sort((a, b) => {
    const av = getNestedVal(a, sortKey)
    const bv = getNestedVal(b, sortKey)
    return sortDir === 'desc' ? bv - av : av - bv
  })

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE)
  const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

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
          <table className="w-full text-sm min-w-[1000px] border-separate border-spacing-0">
            <thead>
              <tr className="text-gray-500 text-left text-[11px] uppercase tracking-wider sticky top-0 bg-[#0d0d0f] z-10">
                <th className="py-3 px-4 w-8 font-medium">#</th>
                <th className="py-3 pr-4 font-medium">Pair</th>
                <th className="py-3 pr-4 font-medium">Price</th>
                <th className="py-3 pr-4 font-medium">Last 7 Days</th>
                <th className="py-3 pr-4 font-medium">2H Volume</th>
                <th className="py-3 pr-4 font-medium text-right">MCap</th>
                <th className="py-3 pr-4 font-medium text-right">Liquidity</th>
                <th className="py-3 pr-4 font-medium">Pair Age</th>
                <th className="py-3 pr-4 font-medium text-right">Holders</th>
                <th className="py-3 pr-4 font-medium text-center">Buy Tax</th>
                <th className="py-3 pr-4 font-medium text-center">Sell Tax</th>
              </tr>
              <tr><td colSpan={11} className="h-px bg-border p-0" /></tr>
            </thead>
            <tbody>
              {paginated.map((p, i) => (
                <tr key={p.pairAddress} className="group hover:bg-white/[0.03] transition-colors">
                  <td className="py-3 px-4 text-gray-600 text-xs">{(page - 1) * PAGE_SIZE + i + 1}</td>

                  {/* Pair */}
                  <td className="py-3 pr-4">
                    <Link to={`/pair/${p.chainId}/${p.pairAddress}`} className="flex items-center gap-2.5 hover:opacity-90">
                      <div className="relative shrink-0 w-10 h-8">
                        <span className="absolute left-4 top-0">
                          <TokenLogo imageUrl={undefined} symbol={p.quoteToken.symbol} address={p.quoteToken.address} chainId={p.chainId} />
                        </span>
                        <span className="absolute left-0 top-0 ring-2 ring-bg rounded-full">
                          <TokenLogo imageUrl={p.info?.imageUrl} symbol={p.baseToken.symbol} address={p.baseToken.address} chainId={p.chainId} />
                        </span>
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

                  {/* Last 7 Days sparkline */}
                  <td className="py-3 pr-4"><Sparkline change24h={p.priceChange?.h24 ?? 0} /></td>

                  {/* 2H Volume buy/sell */}
                  <td className="py-3 pr-4"><BuyVolBar buys={p.txns?.h24?.buys} sells={p.txns?.h24?.sells} /></td>

                  {/* MCap */}
                  <td className="py-3 pr-4 text-right text-gray-300 tabular-nums">{fmt.usd(p.marketCap ?? p.fdv)}</td>

                  {/* Liquidity */}
                  <td className="py-3 pr-4 text-right text-gray-300 tabular-nums">{fmt.usd(p.liquidity?.usd)}</td>

                  {/* Pair Age */}
                  <td className="py-3 pr-4">
                    <span className="text-xs text-gray-500 bg-white/5 rounded px-1.5 py-0.5">
                      {p.pairCreatedAt ? fmt.age(p.pairCreatedAt) : '—'}
                    </span>
                  </td>

                  {/* Holders — not in API, placeholder */}
                  <td className="py-3 pr-4 text-right text-gray-600 text-xs">—</td>

                  {/* Buy Tax */}
                  <td className="py-3 pr-4 text-center text-gray-600 text-xs">—</td>

                  {/* Sell Tax */}
                  <td className="py-3 pr-4 text-center text-gray-600 text-xs">—</td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 py-6">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 rounded border border-border text-sm text-gray-400 hover:border-accent hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                ← Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(n => n === 1 || n === totalPages || Math.abs(n - page) <= 2)
                .reduce<(number | '...')[]>((acc, n, idx, arr) => {
                  if (idx > 0 && n - (arr[idx - 1] as number) > 1) acc.push('...')
                  acc.push(n)
                  return acc
                }, [])
                .map((n, i) => n === '...'
                  ? <span key={`e${i}`} className="text-gray-600 px-1">…</span>
                  : <button
                      key={n}
                      onClick={() => setPage(n as number)}
                      className={`w-8 h-8 rounded text-sm transition-colors ${
                        page === n
                          ? 'bg-accent text-black font-bold'
                          : 'border border-border text-gray-400 hover:border-accent hover:text-white'
                      }`}
                    >{n}</button>
                )}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 rounded border border-border text-sm text-gray-400 hover:border-accent hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                Next →
              </button>
            </div>
          )}
        </div>
      )}

      <FilterSort
        onApply={(key, dir) => { setSortKey(key); setSortDir(dir) }}
        onReset={() => { setSortKey('priceChange.h24'); setSortDir('desc') }}
      />
    </div>
  )
}
