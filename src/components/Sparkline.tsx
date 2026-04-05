// Simple SVG sparkline using priceChange data to simulate a 7-day curve
export function Sparkline({ change24h }: { change24h: number }) {
  // Generate a plausible 7-point path from the 24h change direction
  const up = change24h >= 0
  const points: [number, number][] = up
    ? [[0,30],[10,28],[20,22],[30,25],[40,18],[50,12],[60,8]]
    : [[0,8],[10,12],[20,10],[30,18],[40,22],[50,26],[60,30]]

  const d = points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x},${y}`).join(' ')
  const color = up ? '#00c853' : '#ff3d57'

  return (
    <svg width="60" height="36" viewBox="0 0 60 36" fill="none">
      <path d={d} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
