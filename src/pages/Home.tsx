import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { searchPairs, type Pair } from '../api/dexscreener'
import { fmt } from '../utils/format'

export default function Home() {
  const [pairs, setPairs] = useState<Pair[]>([])
  const [query, setQuery] = useState('ETH')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    searchPairs(query)
      .then(setPairs)
      .finally(() => setLoading(false))
  }, [query])

  return (
    <div className="p-6">
      <input
        className="w-full max-w-md bg-surface border border-border rounded px-4 py-2 mb-6 text-sm outline-none focus:border-accent"
        placeholder="Search token or pair..."
        value={query}
        onChange={e => setQuery(e.target.value)}
      />

      {loading ? (
        <p className="text-gray-500 text-sm">Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-500 border-b border-border text-left">
                <th className="pb-2 pr-4">Pair</th>
                <th className="pb-2 pr-4">Price</th>
                <th className="pb-2 pr-4">24h %</th>
                <th className="pb-2 pr-4">24h Vol</th>
                <th className="pb-2 pr-4">Liquidity</th>
                <th className="pb-2 pr-4">FDV</th>
                <th className="pb-2">Age</th>
              </tr>
            </thead>
            <tbody>
              {pairs.map(p => (
                <tr
                  key={p.pairAddress}
                  className="border-b border-border hover:bg-surface transition-colors"
                >
                  <td className="py-3 pr-4">
                    <Link
                      to={`/pair/${p.chainId}/${p.pairAddress}`}
                      className="font-medium hover:text-accent"
                    >
                      {p.baseToken.symbol}/{p.quoteToken.symbol}
                    </Link>
                    <span className="ml-2 text-xs text-gray-500">{p.dexId}</span>
                  </td>
                  <td className="py-3 pr-4">{fmt.price(p.priceUsd)}</td>
                  <td className={`py-3 pr-4 ${p.priceChange?.h24 >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {fmt.pct(p.priceChange?.h24)}
                  </td>
                  <td className="py-3 pr-4">{fmt.usd(p.volume?.h24)}</td>
                  <td className="py-3 pr-4">{fmt.usd(p.liquidity?.usd)}</td>
                  <td className="py-3 pr-4">{fmt.usd(p.fdv)}</td>
                  <td className="py-3">{p.pairCreatedAt ? fmt.age(p.pairCreatedAt) : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
