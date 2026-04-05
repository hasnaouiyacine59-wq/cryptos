import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import PairPage from './pages/PairPage'
import Gainers, { Losers } from './pages/Gainers'
import Watchlist from './pages/Watchlist'

export default function App() {
  return (
    <div className="min-h-screen bg-bg text-white">
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
