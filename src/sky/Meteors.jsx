import { useEffect, useState } from 'react'

// Every so often a shooting star crosses the background
export default function Meteors() {
  const [streaks, setStreaks] = useState([])

  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    let timer
    const spawn = () => {
      const id = Math.random()
      setStreaks((s) => [...s, {
        id,
        // Streaks travel left and down from here, so start well inside the right edge
        left: 25 + Math.random() * 45,
        top: 4 + Math.random() * 40,
        len: 80 + Math.random() * 90,
        angle: 25 + Math.random() * 25,
      }])
      setTimeout(() => setStreaks((s) => s.filter((x) => x.id !== id)), 1600)
      timer = setTimeout(spawn, 14000 + Math.random() * 22000)
    }
    timer = setTimeout(spawn, 3500)
    return () => clearTimeout(timer)
  }, [])

  // A clipped layer, so a streak near the edge can never widen the page
  return (
    <div className="meteor-layer" aria-hidden="true">
      {streaks.map((m) => (
        <span
          key={m.id}
          className="meteor"
          style={{ left: `${m.left}%`, top: `${m.top}%`, '--len': `${m.len}px`, '--angle': `${m.angle}deg` }}
        />
      ))}
    </div>
  )
}
