import { Link, useLocation } from 'react-router-dom'
import LiveClock from './LiveClock'

const links = [
  { to: '/', label: 'Discover' },
  { to: '/gainers', label: '🚀 Gainers' },
  { to: '/losers', label: '📉 Losers' },
  { to: '/watchlist', label: '⭐ Watchlist' },
]

export default function Navbar() {
  const { pathname } = useLocation()
  return (
    <nav className="border-b border-border px-6 py-3 flex items-center gap-6 sticky top-0 bg-bg z-50">
      <Link to="/" className="text-accent font-bold text-lg tracking-tight shrink-0">
        🔭 CryptoScope
      </Link>
      <div className="flex gap-4 flex-1">
        {links.map(l => (
          <Link
            key={l.to}
            to={l.to}
            className={`text-sm transition-colors ${
              pathname === l.to ? 'text-white font-semibold' : 'text-gray-400 hover:text-white'
            }`}
          >
            {l.label}
          </Link>
        ))}
      </div>
      <LiveClock />
      <button className="ml-4 px-4 py-1.5 rounded-full bg-accent text-black text-sm font-bold hover:opacity-90 transition-opacity shrink-0">
        Connect Wallet
      </button>
    </nav>
  )
}
