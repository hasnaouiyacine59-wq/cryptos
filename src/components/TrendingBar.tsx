import { Link } from 'react-router-dom'
import type { Pair } from '../api/dexscreener'
import { TokenLogo } from './TokenLogo'

export function TrendingBar({ pairs }: { pairs: Pair[] }) {
  const top = pairs.slice(0, 10)
  return (
    <div className="flex items-center gap-1 px-4 py-2 border-b border-border overflow-x-auto scrollbar-none bg-bg">
      <span className="text-orange-400 text-sm mr-2 shrink-0">🔥</span>
      {top.map((p, i) => (
        <Link
          key={p.pairAddress}
          to={`/pair/${p.chainId}/${p.pairAddress}`}
          className="flex items-center gap-1.5 px-3 py-1 rounded bg-surface border border-border hover:border-accent text-xs shrink-0 transition-colors"
        >
          <span className="text-gray-500">#{i + 1}</span>
          <TokenLogo imageUrl={p.info?.imageUrl} symbol={p.baseToken.symbol} size="sm" />
          <span className="font-semibold text-white">{p.baseToken.symbol}</span>
          <span className="text-gray-500">/{p.quoteToken.symbol}</span>
        </Link>
      ))}
    </div>
  )
}
