export const fmt = {
  price: (v: string | number) => {
    const n = Number(v)
    if (!n) return '—'
    if (n < 0.0001) return `$${n.toExponential(2)}`
    if (n < 1) return `$${n.toFixed(6)}`
    return `$${n.toLocaleString(undefined, { maximumFractionDigits: 4 })}`
  },

  usd: (v: number) => {
    if (v == null || isNaN(v)) return '—'
    if (v >= 1e9) return `$${(v / 1e9).toFixed(2)}B`
    if (v >= 1e6) return `$${(v / 1e6).toFixed(2)}M`
    if (v >= 1e3) return `$${(v / 1e3).toFixed(2)}K`
    return `$${v.toFixed(2)}`
  },

  pct: (v: number) => {
    if (v == null || isNaN(v)) return '—'
    return `${v > 0 ? '+' : ''}${v.toFixed(2)}%`
  },

  age: (ts: number) => {
    const diff = Date.now() - ts
    const d = Math.floor(diff / 86400000)
    if (d > 365) return `${Math.floor(d / 365)}y`
    if (d > 30) return `${Math.floor(d / 30)}mo`
    if (d > 0) return `${d}d`
    const h = Math.floor(diff / 3600000)
    if (h > 0) return `${h}h`
    return `${Math.floor(diff / 60000)}m`
  },

  time: (d: Date) =>
    d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
}
