import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="border-b border-border px-6 py-3 flex items-center gap-6">
      <Link to="/" className="text-accent font-bold text-lg">CryptoScope</Link>
      <Link to="/" className="text-sm text-gray-400 hover:text-white">Discover</Link>
      <Link to="/" className="text-sm text-gray-400 hover:text-white">Gainers</Link>
      <Link to="/" className="text-sm text-gray-400 hover:text-white">Losers</Link>
      <Link to="/" className="text-sm text-gray-400 hover:text-white">Watchlist</Link>
    </nav>
  )
}
