import { useEffect, useRef } from 'react'
import { sky, moon } from './compute.js'
import { drawSky } from './draw.js'

// The real sky over Durham Region, right now, as a quiet page background.
// Redraws once a minute, so the stars drift with the Earth's rotation.
export default function SkyBackground() {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    let state = null
    let moonAngle = 180

    const refresh = () => {
      const now = new Date()
      state = sky(now)
      moonAngle = moon(now).angle
    }

    const paint = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = document.documentElement.clientWidth
      const h = document.documentElement.clientHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)
      drawSky(ctx, state, {
        cx: w / 2,
        cy: h * 0.42,
        R: Math.hypot(w, h) * 0.62,
        mode: 'bg',
        moonAngle,
      })
    }

    refresh()
    paint()
    const tick = setInterval(() => { refresh(); paint() }, 60000)
    window.addEventListener('resize', paint)
    return () => {
      clearInterval(tick)
      window.removeEventListener('resize', paint)
    }
  }, [])

  return <canvas ref={ref} className="sky-bg" aria-hidden="true" />
}
