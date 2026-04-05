# Crypto Analytics Platform

A DeFi analytics website similar to [ApeSpace](https://apespace.io/) — real-time token prices, charts, trading pairs, market cap, liquidity, and more across multiple chains.

## Features (Planned)

- Token price listings with market cap, volume, liquidity
- Multi-chain support (Ethereum, BNB Smart Chain, etc.)
- Price charts (candlestick / sparkline)
- Trading pair explorer
- Gainers / Losers leaderboard
- Watchlist
- Honeypot checker
- Token holder stats & buy/sell tax info

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Charts**: lightweight-charts (TradingView)
- **Data**: DexScreener API / GeckoTerminal API (free, no key needed)
- **State**: Zustand

## Getting Started

```bash
npm install
npm run dev
```

## Project Structure

```
src/
  api/          # API calls (DexScreener, GeckoTerminal)
  components/   # Reusable UI components
  pages/        # Route pages (Home, Pair, Watchlist, etc.)
  hooks/        # Custom React hooks
  utils/        # Formatters, helpers
  styles/       # Global styles
```
