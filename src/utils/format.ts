export const fmt = {
  price: (v: string | number) =>
    Number(v) < 0.01
      ? `$${Number(v).toExponential(2)}`
      : `$${Number(v).toLocaleString(undefined, { maximumFractionDigits: 4 })}`,

  usd: (v: number) =>
    v >= 1e9 ? `$${(v / 1e9).toFixed(2)}B`
    : v >= 1e6 ? `$${(v / 1e6).toFixed(2)}M`
    : v >= 1e3 ? `$${(v / 1e3).toFixed(2)}K`
    : `$${v.toFixed(2)}`,

  pct: (v: number) => `${v > 0 ? '+' : ''}${v?.toFixed(2)}%`,

  age: (ts: number) => {
    const diff = Date.now() - ts
    const d = Math.floor(diff / 86400000)
    if (d > 365) return `${Math.floor(d / 365)}y`
    if (d > 30) return `${Math.floor(d / 30)}mo`
    if (d > 0) return `${d}d`
    return `${Math.floor(diff / 3600000)}h`
  },
}
