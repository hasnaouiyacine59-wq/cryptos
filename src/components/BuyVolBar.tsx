// Green/red split bar showing buy vs sell volume ratio
export function BuyVolBar({ buys = 0, sells = 0 }: { buys?: number; sells?: number }) {
  const total = buys + sells
  const buyPct = total === 0 ? 50 : Math.round((buys / total) * 100)
  return (
    <div className="flex flex-col items-start gap-0.5 min-w-[72px]">
      <div className="flex w-full h-1.5 rounded overflow-hidden">
        <div className="bg-green-500 h-full" style={{ width: `${buyPct}%` }} />
        <div className="bg-red-500 h-full flex-1" />
      </div>
      <span className="text-[10px] text-gray-400">{buyPct}%</span>
    </div>
  )
}
