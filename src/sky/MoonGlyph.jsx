// A small moon drawn at a given phase angle (0 new, 90 first quarter, 180 full, 270 last quarter)
export default function MoonGlyph({ angle = 180, size = 16, className = '' }) {
  const r = 8
  const k = Math.cos((angle * Math.PI) / 180)
  const waxing = angle < 180
  const rx = Math.abs(k) * r
  // Lit part: the half facing the sun, plus or minus an ellipse for the terminator
  const d = waxing
    ? `M10 2 A8 8 0 0 1 10 18 A${rx} 8 0 0 ${k > 0 ? 0 : 1} 10 2Z`
    : `M10 2 A8 8 0 0 0 10 18 A${rx} 8 0 0 ${k > 0 ? 1 : 0} 10 2Z`
  return (
    <svg className={`moon-glyph ${className}`} viewBox="0 0 20 20" width={size} height={size} aria-hidden="true">
      <circle cx="10" cy="10" r={r} fill="#2a3150" />
      <path d={d} fill="#f4efdc" />
    </svg>
  )
}

// Moon phase without loading the astronomy library: days since a known new moon
export function quickMoonAngle(date = new Date()) {
  const SYN = 29.530588853
  const days = (date.getTime() - Date.UTC(2000, 0, 6, 18, 14)) / 86400000
  return ((((days % SYN) + SYN) % SYN) / SYN) * 360
}
