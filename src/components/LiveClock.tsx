import { useEffect, useState } from 'react'
import { fmt } from '../utils/format'

export default function LiveClock() {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])
  return (
    <span className="text-xs text-gray-500 font-mono">
      🕐 {fmt.time(now)}
    </span>
  )
}
