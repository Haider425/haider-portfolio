// Draws a sky state (from compute.js) onto a canvas.
// mode 'bg' is the quiet page background; 'full' is the Look up chart.
import { starColor } from './compute.js'

export function skyTint(sunAlt) {
  if (sunAlt > 0) return ['#1d3d70', '#0f2247']
  if (sunAlt > -6) return ['#15265a', '#0a1233']
  if (sunAlt > -12) return ['#0d1640', '#070b22']
  return ['#0a0f2a', '#04060f']
}

const starRadius = (mag, scale) => Math.max(0.55, (5.3 - mag) * 0.62) * scale
const FONT = '"Instrument Sans", system-ui, sans-serif'

function moonPath(ctx, x, y, r, angle) {
  // angle: 0 new, 90 first quarter, 180 full, 270 last quarter
  const k = Math.cos((angle * Math.PI) / 180)
  const waxing = angle < 180
  ctx.beginPath()
  ctx.arc(x, y, r, -Math.PI / 2, Math.PI / 2, !waxing)
  ctx.ellipse(x, y, Math.abs(k) * r, r, 0, Math.PI / 2, -Math.PI / 2, waxing ? k > 0 : k < 0)
  ctx.closePath()
}

// Chart geometry shared by drawing and hit-testing
export function placer({ cx, cy, R, rot = 0 }) {
  const c = Math.cos(rot)
  const s = Math.sin(rot)
  return (p) => [cx + (p.x * c - p.y * s) * R, cy + (p.x * s + p.y * c) * R]
}

export function drawSky(ctx, s, o) {
  const {
    mode, scale = 1, hover, focus, focusCon, moonAngle, time = 0,
    iss, radiant, rot = 0,
  } = o
  const { cx, cy, R } = o
  const full = mode === 'full'
  const P = placer(o)
  const sun = s.bodies.find((b) => b.kind === 'sun')
  const pulse = 0.5 + 0.5 * Math.sin(time * 3)

  ctx.save()
  if (full) {
    const [inner, outer] = skyTint(sun.alt)
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, R)
    g.addColorStop(0, outer)
    g.addColorStop(1, inner)
    ctx.beginPath()
    ctx.arc(cx, cy, R, 0, Math.PI * 2)
    ctx.fillStyle = g
    ctx.fill()
    ctx.clip()

    // Milky Way: every ring in one even-odd path so dark rifts stay dark
    ctx.beginPath()
    for (const ring of s.milky) {
      ring.forEach((p, i) => {
        const [x, y] = P(p)
        i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)
      })
      ctx.closePath()
    }
    ctx.fillStyle = 'rgba(175,185,255,0.07)'
    ctx.fill('evenodd')
  }

  // Constellation lines
  const hotCon = focusCon || hover?.con
  ctx.lineWidth = (full ? 1 : 0.8) * scale
  for (const l of s.lines) {
    const hot = full && hotCon === l.con
    ctx.strokeStyle = hot ? 'rgba(168,144,255,0.95)' : full ? 'rgba(150,165,255,0.22)' : 'rgba(150,165,255,0.09)'
    ctx.lineWidth = (hot ? 2 : full ? 1 : 0.8) * scale
    ctx.beginPath()
    let pen = false
    for (const p of l.pts) {
      if (p.alt < -2) { pen = false; continue }
      const [x, y] = P(p)
      pen ? ctx.lineTo(x, y) : ctx.moveTo(x, y)
      pen = true
    }
    ctx.stroke()
  }

  // Stars
  const dim = full && sun.alt > 0 ? 0.55 : 1
  for (const st of s.stars) {
    if (st.alt < -1) continue
    const [x, y] = P(st)
    let r = starRadius(st.mag, scale * (full ? 1 : 0.8))
    if (full && st.mag < 1.6) r *= 1 + 0.08 * Math.sin(time * 2 + st.ra)
    ctx.globalAlpha = (full ? 1 : 0.85) * dim * Math.min(1, 1.25 - st.mag / 6)
    ctx.fillStyle = starColor(st.bv)
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()
    if (full && st.mag < 1.2) {
      const g = ctx.createRadialGradient(x, y, r * 0.5, x, y, r * 4)
      g.addColorStop(0, 'rgba(255,255,255,0.35)')
      g.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.globalAlpha = dim
      ctx.fillStyle = g
      ctx.beginPath()
      ctx.arc(x, y, r * 4, 0, Math.PI * 2)
      ctx.fill()
    }
  }
  ctx.globalAlpha = 1

  if (full) {
    // Constellation names
    ctx.font = `${11 * scale}px ${FONT}`
    ctx.textAlign = 'center'
    for (const l of s.labels) {
      if (l.alt < 8) continue
      const [x, y] = P(l)
      ctx.fillStyle = hotCon === l.id ? 'rgba(210,198,255,0.95)' : 'rgba(190,198,255,0.42)'
      ctx.fillText(l.name, x, y)
    }

    // Meteor shower radiant
    if (radiant && radiant.alt > 0) {
      const [x, y] = P(radiant)
      ctx.strokeStyle = 'rgba(245,192,99,0.75)'
      ctx.lineWidth = 1.2 * scale
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2 + 0.3
        const r1 = 9 * scale
        const r2 = (16 + 6 * pulse) * scale
        ctx.beginPath()
        ctx.moveTo(x + Math.cos(a) * r1, y + Math.sin(a) * r1)
        ctx.lineTo(x + Math.cos(a) * r2, y + Math.sin(a) * r2)
        ctx.stroke()
      }
      ctx.font = `600 ${11 * scale}px ${FONT}`
      ctx.fillStyle = 'rgba(245,192,99,0.95)'
      ctx.fillText(radiant.name, x, y + 30 * scale)
    }
  }

  // Planets, Moon, Sun
  for (const b of s.bodies) {
    if (b.alt < -1) continue
    const [x, y] = P(b)
    if (b.kind === 'sun') {
      const g = ctx.createRadialGradient(x, y, 0, x, y, 40 * scale)
      g.addColorStop(0, 'rgba(255,230,160,0.9)')
      g.addColorStop(1, 'rgba(255,200,120,0)')
      ctx.fillStyle = g
      ctx.beginPath(); ctx.arc(x, y, 40 * scale, 0, Math.PI * 2); ctx.fill()
      ctx.fillStyle = '#fff4cf'
      ctx.beginPath(); ctx.arc(x, y, 9 * scale, 0, Math.PI * 2); ctx.fill()
    } else if (b.kind === 'moon') {
      const r = (full ? 10 : 6) * scale
      const g = ctx.createRadialGradient(x, y, 0, x, y, r * 4)
      g.addColorStop(0, 'rgba(255,250,230,0.25)')
      g.addColorStop(1, 'rgba(255,250,230,0)')
      ctx.fillStyle = g
      ctx.beginPath(); ctx.arc(x, y, r * 4, 0, Math.PI * 2); ctx.fill()
      ctx.fillStyle = 'rgba(60,64,90,0.9)'
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill()
      ctx.fillStyle = '#fbf6e6'
      moonPath(ctx, x, y, r, moonAngle ?? 180)
      ctx.fill()
    } else {
      const r = Math.max(2.4, (1.5 - b.mag) * 1.4 + 2) * scale * (full ? 1 : 0.75)
      ctx.fillStyle = b.color
      ctx.shadowColor = b.color
      ctx.shadowBlur = 10 * scale
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill()
      ctx.shadowBlur = 0
    }
    if (full && b.kind !== 'sun') {
      ctx.font = `600 ${12 * scale}px ${FONT}`
      ctx.textAlign = 'left'
      ctx.fillStyle = b.color
      ctx.fillText(b.name, x + 12 * scale, y + 4 * scale)
    }
  }

  // The ISS
  if (full && iss && iss.alt > -1) {
    const [x, y] = P(iss)
    ctx.fillStyle = iss.lit ? '#ffffff' : 'rgba(255,255,255,0.35)'
    ctx.shadowColor = '#9fe3ff'
    ctx.shadowBlur = iss.lit ? 14 * scale : 0
    ctx.fillRect(x - 3.5 * scale, y - 1.5 * scale, 7 * scale, 3 * scale)
    ctx.fillRect(x - 1 * scale, y - 4 * scale, 2 * scale, 8 * scale)
    ctx.shadowBlur = 0
    ctx.font = `600 ${12 * scale}px ${FONT}`
    ctx.textAlign = 'left'
    ctx.fillStyle = iss.lit ? '#9fe3ff' : 'rgba(159,227,255,0.6)'
    ctx.fillText(iss.lit ? 'ISS' : 'ISS (in shadow)', x + 10 * scale, y + 4 * scale)
  }

  // Search focus and hover rings
  for (const [o2, strong] of [[focus, true], [hover, false]]) {
    if (!o2 || o2.alt < -1 || o2.x === undefined) continue
    const [x, y] = P(o2)
    ctx.strokeStyle = strong ? `rgba(245,192,99,${0.6 + 0.4 * pulse})` : '#a890ff'
    ctx.lineWidth = (strong ? 2 : 1.5) * scale
    ctx.beginPath()
    ctx.arc(x, y, (strong ? 12 + 5 * pulse : 9) * scale, 0, Math.PI * 2)
    ctx.stroke()
  }
  ctx.restore()

  if (full) {
    // Horizon, altitude rings and compass points
    ctx.strokeStyle = 'rgba(190,198,255,0.35)'
    ctx.lineWidth = 1 * scale
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke()
    ctx.setLineDash([2 * scale, 6 * scale])
    ctx.strokeStyle = 'rgba(190,198,255,0.12)'
    for (const alt of [30, 60]) {
      const r = Math.tan(((90 - alt) / 2) * Math.PI / 180) * R
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke()
    }
    ctx.setLineDash([])
    ctx.font = `600 ${12 * scale}px ${FONT}`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    const k = 1 + (16 * scale) / R
    for (const [label, x, y] of [['N', 0, -1], ['S', 0, 1], ['E', -1, 0], ['W', 1, 0]]) {
      const [px, py] = P({ x: x * k, y: y * k })
      ctx.fillStyle = label === 'N' ? '#f5c063' : 'rgba(220,226,255,0.8)'
      ctx.fillText(label, px, py)
    }
    ctx.textBaseline = 'alphabetic'
  }
}

// Nearest named star, planet, the Moon or the ISS to a point (in chart pixels)
export function pick(s, px, py, geo, extra = []) {
  const P = placer(geo)
  let best = null
  let bestD = 16
  const consider = (o) => {
    if (!o || o.alt < 0) return
    const [x, y] = P(o)
    const d = Math.hypot(x - px, y - py)
    if (d < bestD) { bestD = d; best = o }
  }
  for (const b of s.bodies) if (b.kind !== 'sun') consider(b)
  extra.forEach(consider)
  if (!best) for (const st of s.stars) if (st.mag < 4.5) consider(st)
  return best
}
