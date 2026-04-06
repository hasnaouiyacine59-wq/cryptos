// Sparkline with area fill — mimics real 7-day chart shape from price change data
export function Sparkline({ change24h }: { change24h: number }) {
  const up = change24h >= 0

  // Generate a more organic-looking path seeded by the change value
  const seed = Math.abs(change24h) % 10
  const pts: [number, number][] = up
    ? [
        [0,   32],
        [16,  28 - seed * 0.4],
        [32,  22 + seed * 0.3],
        [48,  18 - seed * 0.5],
        [64,  14 + seed * 0.2],
        [80,  10 - seed * 0.3],
        [100,  6],
      ]
    : [
        [0,    6],
        [16,  10 + seed * 0.3],
        [32,  14 - seed * 0.2],
        [48,  20 + seed * 0.4],
        [64,  24 - seed * 0.3],
        [80,  28 + seed * 0.2],
        [100, 32],
      ]

  const linePath = pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x},${y}`).join(' ')
  const areaPath = `${linePath} L100,38 L0,38 Z`
  const color = up ? '#00e5a0' : '#ff3d57'
  const gradId = `sg${up ? 'u' : 'd'}${Math.round(seed)}`

  return (
    <svg width="100" height="38" viewBox="0 0 100 38" fill="none" className="block">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gradId})`} />
      <path d={linePath} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
