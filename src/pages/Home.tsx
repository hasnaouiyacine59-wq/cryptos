import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { searchPairs, type Pair } from '../api/dexscreener'
import { ChainIcon, PriceCell, TokenLogo } from '../components/TokenLogo'
import { fmt } from '../utils/format'

const REFRESH_MS = 15000

export default function Home() {
  const [pairs, setPairs] = useState<Pair[]>([])
  const [prevPrices, setPrevPrices] = useState<Record<string, string>>({})
  const [query, setQuery] = useState('ETH')
  const [loading, setLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
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

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <input
          className="w-full max-w-md bg-surface border border-border rounded px-4 py-2 text-sm outline-none focus:border-accent"
          placeholder="Search token or pair..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        {lastUpdated && (
          <span className="text-xs text-gray-500">
            Updated {fmt.time(lastUpdated)}
            <span className="ml-2 inline-block w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          </span>
        )}
      </div>

      {loading && pairs.length === 0 ? (
        <p className="text-gray-500 text-sm">Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-500 border-b border-border text-left text-xs uppercase tracking-wider">
                <th className="pb-3 pr-4">#</th>
                <th className="pb-3 pr-4">Token</th>
                <th className="pb-3 pr-4">Price</th>
                <th className="pb-3 pr-4">5m</th>
                <th className="pb-3 pr-4">1h</th>
                <th className="pb-3 pr-4">24h</th>
                <th className="pb-3 pr-4">24h Vol</th>
                <th className="pb-3 pr-4">Liquidity</th>
                <th className="pb-3 pr-4">FDV</th>
                <th className="pb-3">Age</th>
              </tr>
            </thead>
            <tbody>
              {pairs.map((p, i) => (
                <tr
                  key={p.pairAddress}
                  className="border-b border-border hover:bg-surface transition-colors"
                >
                  <td className="py-3 pr-4 text-gray-500">{i + 1}</td>
                  <td className="py-3 pr-4">
                    <Link to={`/pair/${p.chainId}/${p.pairAddress}`} className="flex items-center gap-2 hover:opacity-80">
                      <TokenLogo imageUrl={p.info?.imageUrl} symbol={p.baseToken.symbol} />
                      <div>
                        <div className="font-semibold flex items-center gap-1">
                          {p.baseToken.symbol}
                          <ChainIcon chainId={p.chainId} />
                        </div>
                        <div className="text-xs text-gray-500">{p.baseToken.name}</div>
                      </div>
                    </Link>
                  </td>
                  <td className="py-3 pr-4">
                    <PriceCell
                      value={fmt.price(p.priceUsd)}
                      prev={fmt.price(prevPrices[p.pairAddress] ?? p.priceUsd)}
                    />
                  </td>
                  <td className={`py-3 pr-4 ${pctColor(p.priceChange?.m5)}`}>{fmt.pct(p.priceChange?.m5)}</td>
                  <td className={`py-3 pr-4 ${pctColor(p.priceChange?.h1)}`}>{fmt.pct(p.priceChange?.h1)}</td>
                  <td className={`py-3 pr-4 font-semibold ${pctColor(p.priceChange?.h24)}`}>{fmt.pct(p.priceChange?.h24)}</td>
                  <td className="py-3 pr-4 text-gray-300">{fmt.usd(p.volume?.h24)}</td>
                  <td className="py-3 pr-4 text-gray-300">{fmt.usd(p.liquidity?.usd)}</td>
                  <td className="py-3 pr-4 text-gray-300">{fmt.usd(p.fdv)}</td>
                  <td className="py-3 text-gray-400">{p.pairCreatedAt ? fmt.age(p.pairCreatedAt) : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function pctColor(v: number) {
  if (v == null) return 'text-gray-500'
  return v >= 0 ? 'text-green-400' : 'text-red-400'
}
