import { Link } from 'react-router-dom'
import type { Pair } from '../api/dexscreener'
import { TokenLogo } from './TokenLogo'

export function TrendingBar({ pairs }: { pairs: Pair[] }) {
  // Deduplicate by base token symbol, pick highest volume per token, sort by volume
  const seen = new Set<string>()
  const top = [...pairs]
    .sort((a, b) => (b.volume?.h24 ?? 0) - (a.volume?.h24 ?? 0))
    .filter(p => {
      const sym = p.baseToken.symbol.toUpperCase()
      if (seen.has(sym)) return false
      seen.add(sym)
      return true
    })
    .slice(0, 10)
  return (
    <div className="flex items-center gap-0 border-b border-border bg-[#0d0d0f] overflow-x-auto scrollbar-none">
      {/* Fire icon */}
      <span className="text-orange-500 text-base px-3 shrink-0">🔥</span>

      {top.map((p, i) => (
        <Link
          key={p.pairAddress}
          to={`/pair/${p.chainId}/${p.pairAddress}`}
          className="flex items-center gap-1.5 px-4 py-2.5 border-l border-border hover:bg-white/5 transition-colors shrink-0 group"
        >
          <span className="text-gray-600 text-[11px] font-medium">#{i + 1}</span>
          <TokenLogo imageUrl={p.info?.imageUrl} symbol={p.baseToken.symbol} size="sm" />
          <span className="text-white text-[13px] font-semibold tracking-wide group-hover:text-accent transition-colors">
            {p.baseToken.symbol}
          </span>
        </Link>
      ))}
    </div>
  )
}
