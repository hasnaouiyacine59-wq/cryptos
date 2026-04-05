import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { searchPairs, type Pair } from '../api/dexscreener'
import { ChainIcon, TokenLogo } from '../components/TokenLogo'
import { fmt } from '../utils/format'

export default function Gainers() {
  const [pairs, setPairs] = useState<Pair[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    searchPairs('USDT')
      .then(data => {
        const sorted = data
          .filter(p => p.priceChange?.h24 > 0)
          .sort((a, b) => b.priceChange.h24 - a.priceChange.h24)
        setPairs(sorted)
      })
      .finally(() => setLoading(false))
  }, [])

  return <PairList title="🚀 Top Gainers (24h)" pairs={pairs} loading={loading} />
}

export function Losers() {
  const [pairs, setPairs] = useState<Pair[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    searchPairs('USDT')
      .then(data => {
        const sorted = data
          .filter(p => p.priceChange?.h24 < 0)
          .sort((a, b) => a.priceChange.h24 - b.priceChange.h24)
        setPairs(sorted)
      })
      .finally(() => setLoading(false))
  }, [])

  return <PairList title="📉 Top Losers (24h)" pairs={pairs} loading={loading} />
}

function PairList({ title, pairs, loading }: { title: string; pairs: Pair[]; loading: boolean }) {
  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-6">{title}</h2>
      {loading ? (
        <p className="text-gray-500 text-sm">Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-500 border-b border-border text-left text-xs uppercase tracking-wider">
                <th className="pb-3 pr-4">#</th>
                <th className="pb-3 pr-4">Token</th>
                <th className="pb-3 pr-4">Price</th>
                <th className="pb-3 pr-4">24h %</th>
                <th className="pb-3 pr-4">Volume</th>
                <th className="pb-3">Liquidity</th>
              </tr>
            </thead>
            <tbody>
              {pairs.map((p, i) => (
                <tr key={p.pairAddress} className="border-b border-border hover:bg-surface transition-colors">
                  <td className="py-3 pr-4 text-gray-500">{i + 1}</td>
                  <td className="py-3 pr-4">
                    <Link to={`/pair/${p.chainId}/${p.pairAddress}`} className="flex items-center gap-2 hover:opacity-80">
                      <TokenLogo imageUrl={p.info?.imageUrl} symbol={p.baseToken.symbol} />
                      <div>
                        <div className="font-semibold flex items-center gap-1">
                          {p.baseToken.symbol} <ChainIcon chainId={p.chainId} />
                        </div>
                        <div className="text-xs text-gray-500">{p.dexId}</div>
                      </div>
                    </Link>
                  </td>
                  <td className="py-3 pr-4 font-mono">{fmt.price(p.priceUsd)}</td>
                  <td className={`py-3 pr-4 font-bold text-base ${p.priceChange?.h24 >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {fmt.pct(p.priceChange?.h24)}
                  </td>
                  <td className="py-3 pr-4 text-gray-300">{fmt.usd(p.volume?.h24)}</td>
                  <td className="py-3 text-gray-300">{fmt.usd(p.liquidity?.usd)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
