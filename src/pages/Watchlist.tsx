import { Link } from 'react-router-dom'
import { useWatchlist } from '../hooks/useWatchlist'
import { ChainIcon, TokenLogo } from '../components/TokenLogo'
import { fmt } from '../utils/format'

export default function Watchlist() {
  const { items, remove } = useWatchlist()

  if (items.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500 mt-20">
        <p className="text-4xl mb-4">⭐</p>
        <p>Your watchlist is empty.</p>
        <p className="text-sm mt-1">Click the ⭐ on any pair to add it here.</p>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-6">⭐ Watchlist</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-500 border-b border-border text-left text-xs uppercase tracking-wider">
              <th className="pb-3 pr-4">Token</th>
              <th className="pb-3 pr-4">Price</th>
              <th className="pb-3 pr-4">24h %</th>
              <th className="pb-3 pr-4">Volume</th>
              <th className="pb-3 pr-4">Liquidity</th>
              <th className="pb-3" />
            </tr>
          </thead>
          <tbody>
            {items.map(p => (
              <tr key={p.pairAddress} className="border-b border-border hover:bg-surface transition-colors">
                <td className="py-3 pr-4">
                  <Link to={`/pair/${p.chainId}/${p.pairAddress}`} className="flex items-center gap-2 hover:opacity-80">
                    <TokenLogo imageUrl={p.info?.imageUrl} symbol={p.baseToken.symbol} />
                    <div>
                      <div className="font-semibold flex items-center gap-1">
                        {p.baseToken.symbol} <ChainIcon chainId={p.chainId} />
                      </div>
                      <div className="text-xs text-gray-500">{p.baseToken.name}</div>
                    </div>
                  </Link>
                </td>
                <td className="py-3 pr-4 font-mono">{fmt.price(p.priceUsd)}</td>
                <td className={`py-3 pr-4 font-semibold ${p.priceChange?.h24 >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {fmt.pct(p.priceChange?.h24)}
                </td>
                <td className="py-3 pr-4 text-gray-300">{fmt.usd(p.volume?.h24)}</td>
                <td className="py-3 pr-4 text-gray-300">{fmt.usd(p.liquidity?.usd)}</td>
                <td className="py-3">
                  <button onClick={() => remove(p.pairAddress)} className="text-gray-500 hover:text-red-400 transition-colors">✕</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
