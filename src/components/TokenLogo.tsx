import { useEffect, useRef, useState } from 'react'

const CHAIN_ICONS: Record<string, string> = {
  ethereum: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
  bsc: 'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png',
  polygon: 'https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png',
  arbitrum: 'https://assets.coingecko.com/coins/images/16547/small/photo_2023-03-29_21.47.00.jpeg',
  base: 'https://assets.coingecko.com/asset_platforms/images/131/small/base-network.png',
}

export function ChainIcon({ chainId }: { chainId: string }) {
  const src = CHAIN_ICONS[chainId]
  if (!src) return <span className="w-4 h-4 rounded-full bg-gray-600 inline-block" />
  return <img src={src} alt={chainId} className="w-4 h-4 rounded-full inline-block" />
}

export function TokenLogo({ imageUrl, symbol }: { imageUrl?: string; symbol: string }) {
  const [err, setErr] = useState(false)
  if (!imageUrl || err) {
    return (
      <div className="w-8 h-8 rounded-full bg-surface border border-border flex items-center justify-center text-xs font-bold text-accent">
        {symbol.slice(0, 2).toUpperCase()}
      </div>
    )
  }
  return (
    <img
      src={imageUrl}
      alt={symbol}
      className="w-8 h-8 rounded-full"
      onError={() => setErr(true)}
    />
  )
}

export function PriceCell({ value, prev }: { value: string; prev: string }) {
  const [flash, setFlash] = useState<'up' | 'down' | null>(null)
  const prevRef = useRef(prev)

  useEffect(() => {
    if (prevRef.current && prevRef.current !== value) {
      const dir = Number(value) > Number(prevRef.current) ? 'up' : 'down'
      setFlash(dir)
      const t = setTimeout(() => setFlash(null), 800)
      prevRef.current = value
      return () => clearTimeout(t)
    }
    prevRef.current = value
  }, [value])

  return (
    <span
      className={`transition-colors duration-300 font-mono ${
        flash === 'up' ? 'text-green-400' : flash === 'down' ? 'text-red-400' : 'text-white'
      }`}
    >
      {value}
    </span>
  )
}
