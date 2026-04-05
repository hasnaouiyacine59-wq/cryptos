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

export const getTopPairs = async (): Promise<Pair[]> => {
  const [eth, bsc] = await Promise.all([
    axios.get(`${BASE}/search?q=WETH`),
    axios.get(`${BASE}/search?q=WBNB`),
  ])
  return [...(eth.data.pairs ?? []), ...(bsc.data.pairs ?? [])].slice(0, 50)
}

export const getPair = async (chainId: string, pairAddress: string): Promise<Pair | null> => {
  const { data } = await axios.get(`${BASE}/pairs/${chainId}/${pairAddress}`)
  return data.pairs?.[0] ?? null
}
