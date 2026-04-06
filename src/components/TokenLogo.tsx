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

const COINGECKO_KNOWN: Record<string, string> = {
  ETH:  'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
  BTC:  'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
  BNB:  'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png',
  USDT: 'https://assets.coingecko.com/coins/images/325/small/Tether.png',
  USDC: 'https://assets.coingecko.com/coins/images/6319/small/usdc.png',
  MATIC:'https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png',
  SOL:  'https://assets.coingecko.com/coins/images/4128/small/solana.png',
  ARB:  'https://assets.coingecko.com/coins/images/16547/small/photo_2023-03-29_21.47.00.jpeg',
  OP:   'https://assets.coingecko.com/coins/images/25244/small/Optimism.png',
  AVAX: 'https://assets.coingecko.com/coins/images/12559/small/Avalanche_Circle_RedWhite_Trans.png',
  LINK: 'https://assets.coingecko.com/coins/images/877/small/chainlink-new-logo.png',
  UNI:  'https://assets.coingecko.com/coins/images/12504/small/uniswap-uni.png',
  AAVE: 'https://assets.coingecko.com/coins/images/12645/small/AAVE.png',
  DAI:  'https://assets.coingecko.com/coins/images/9956/small/Badge_Dai.png',
  WETH: 'https://assets.coingecko.com/coins/images/2518/small/weth.png',
  WBNB: 'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png',
  SHIB: 'https://assets.coingecko.com/coins/images/11939/small/shiba.png',
  PEPE: 'https://assets.coingecko.com/coins/images/29850/small/pepe-token.jpeg',
  DOGE: 'https://assets.coingecko.com/coins/images/5/small/dogecoin.png',
  LTC:  'https://assets.coingecko.com/coins/images/2/small/litecoin.png',
}

export function TokenLogo({ imageUrl, symbol, size = 'md' }: { imageUrl?: string; symbol: string; size?: 'sm' | 'md' }) {
  const sources = [
    imageUrl,
    COINGECKO_KNOWN[symbol.toUpperCase()],
  ].filter(Boolean) as string[]

  const [idx, setIdx] = useState(0)
  const cls = size === 'sm' ? 'w-5 h-5 text-[9px]' : 'w-8 h-8 text-xs'

  if (idx >= sources.length) {
    return (
      <div className={`${cls} rounded-full bg-surface border border-border flex items-center justify-center font-bold text-accent`}>
        {symbol.slice(0, 2).toUpperCase()}
      </div>
    )
  }

  return (
    <img
      src={sources[idx]}
      alt={symbol}
      className={`${cls} rounded-full`}
      onError={() => setIdx(i => i + 1)}
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
