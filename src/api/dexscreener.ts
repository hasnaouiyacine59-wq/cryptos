import axios from 'axios'

const BASE = 'https://api.dexscreener.com/latest/dex'

export interface Pair {
  chainId: string
  dexId: string
  pairAddress: string
  baseToken: { address: string; name: string; symbol: string }
  quoteToken: { symbol: string }
  priceUsd: string
  priceChange: { m5: number; h1: number; h6: number; h24: number }
  volume: { h24: number }
  liquidity: { usd: number }
  fdv: number
  pairCreatedAt: number
}

export const searchPairs = async (query: string): Promise<Pair[]> => {
  const { data } = await axios.get(`${BASE}/search?q=${query}`)
  return data.pairs ?? []
}

export const getLatestPairs = async (): Promise<Pair[]> => {
  const { data } = await axios.get(`${BASE}/pairs/bsc/latest`)
  return data.pairs ?? []
}

export const getPair = async (chainId: string, pairAddress: string): Promise<Pair | null> => {
  const { data } = await axios.get(`${BASE}/pairs/${chainId}/${pairAddress}`)
  return data.pairs?.[0] ?? null
}
