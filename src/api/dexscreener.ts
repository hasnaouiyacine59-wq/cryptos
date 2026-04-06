import axios from 'axios'

const BASE = 'https://api.dexscreener.com/latest/dex'

export interface Pair {
  chainId: string
  dexId: string
  pairAddress: string
  baseToken: { address: string; name: string; symbol: string }
  quoteToken: { symbol: string }
  priceUsd: string
  priceChange: { m5: number; h1: number; h6: number; h8?: number; h24: number }
  volume: { h24: number; h6: number; h1: number; h2?: number; m5: number }
  liquidity: { usd: number }
  fdv: number
  marketCap?: number
  pairCreatedAt: number
  info?: { imageUrl?: string }
  txns?: { h24: { buys: number; sells: number }; h2?: { buys: number; sells: number } }
}

export const searchPairs = async (query: string): Promise<Pair[]> => {
  const { data } = await axios.get(`${BASE}/search?q=${query}`)
  return data.pairs ?? []
}

// Fan out across common quote tokens to get ~150-200 results instead of 30
const BROAD_QUERIES = ['USDT', 'USDC', 'WETH', 'WBNB', 'ETH']

export const searchPairsBroad = async (query: string): Promise<Pair[]> => {
  const queries = query.length > 1
    ? [query]
    : BROAD_QUERIES

  const results = await Promise.allSettled(
    queries.map(q => axios.get(`${BASE}/search?q=${q}`).then(r => r.data.pairs ?? []))
  )

  const seen = new Set<string>()
  const pairs: Pair[] = []
  for (const r of results) {
    if (r.status === 'fulfilled') {
      for (const p of r.value) {
        if (!seen.has(p.pairAddress)) {
          seen.add(p.pairAddress)
          pairs.push(p)
        }
      }
    }
  }
  return pairs
}

export const getPair = async (chainId: string, pairAddress: string): Promise<Pair | null> => {
  const { data } = await axios.get(`${BASE}/pairs/${chainId}/${pairAddress}`)
  return data.pairs?.[0] ?? null
}
