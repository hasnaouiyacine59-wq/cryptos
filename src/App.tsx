import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import PairPage from './pages/PairPage'
import Gainers, { Losers } from './pages/Gainers'
import Watchlist from './pages/Watchlist'

export default function App() {
  const { pathname } = useLocation()
  return (
    <div className="min-h-screen bg-bg text-white">
      <div className="w-full flex justify-center py-2 bg-bg border-b border-border">
        <iframe
          key={pathname}
          data-aa='2433217'
          src='//ad.a-ads.com/2433217/?size=728x90'
          style={{ border: 0, padding: 0, width: 728, height: 90, overflow: 'hidden', display: 'block' }}
        />
      </div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pair/:chainId/:pairAddress" element={<PairPage />} />
        <Route path="/gainers" element={<Gainers />} />
        <Route path="/losers" element={<Losers />} />
        <Route path="/watchlist" element={<Watchlist />} />
      </Routes>
    </div>
  )
}
