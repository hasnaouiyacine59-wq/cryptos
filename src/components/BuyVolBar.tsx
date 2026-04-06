// Pill badge showing buy % — green if buys dominate, red if sells dominate
export function BuyVolBar({ buys = 0, sells = 0 }: { buys?: number; sells?: number }) {
  const total = buys + sells
  const buyPct = total === 0 ? 50 : Math.round((buys / total) * 100)
  const up = buyPct >= 50

  return (
    <div
      className="inline-flex items-center justify-center rounded px-3 py-1 text-sm font-semibold min-w-[64px]"
      style={{
        background: up ? 'rgba(0,229,160,0.15)' : 'rgba(255,61,87,0.15)',
        color: up ? '#00e5a0' : '#ff3d57',
      }}
    >
      {buyPct}%
    </div>
  )
}
