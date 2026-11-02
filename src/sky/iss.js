// Live ISS position and visible-pass predictions, from the latest orbital
// elements (TLE). CelesTrak first, wheretheiss.at as a backup.
import * as sat from 'satellite.js'
import { project, sunVectorKm, sunAltitude } from './compute.js'

const SOURCES = [
  async () => {
    const r = await fetch('https://celestrak.org/NORAD/elements/gp.php?CATNR=25544&FORMAT=TLE')
    const t = (await r.text()).trim().split(/\r?\n/)
    if (t.length < 3) throw new Error('bad TLE')
    return [t[1].trim(), t[2].trim()]
  },
  async () => {
    const r = await fetch('https://api.wheretheiss.at/v1/satellites/25544/tles')
    const j = await r.json()
    return [j.line1, j.line2]
  },
]

let record = null
let loading = null

export function loadISS() {
  if (record) return Promise.resolve(record)
  if (!loading) {
    loading = (async () => {
      for (const src of SOURCES) {
        try {
          const [l1, l2] = await src()
          record = sat.twoline2satrec(l1, l2)
          return record
        } catch { /* try the next source */ }
      }
      loading = null
      return null
    })()
  }
  return loading
}

const EARTH_R = 6371

// Where the ISS is from a place: altitude, azimuth, and whether sunlight is on it
export function issAt(date, place) {
  if (!record) return null
  const pv = sat.propagate(record, date)
  if (!pv || !pv.position) return null
  const gmst = sat.gstime(date)
  const look = sat.ecfToLookAngles(
    { latitude: sat.degreesToRadians(place.lat), longitude: sat.degreesToRadians(place.lon), height: 0.1 },
    sat.eciToEcf(pv.position, gmst)
  )
  const alt = (look.elevation * 180) / Math.PI
  const az = ((look.azimuth * 180) / Math.PI + 360) % 360

  // In Earth's shadow if it's behind the Earth and inside the shadow cylinder
  const s = sunVectorKm(date)
  const sl = Math.hypot(...s)
  const sh = s.map((v) => v / sl)
  const p = [pv.position.x, pv.position.y, pv.position.z]
  const dot = p[0] * sh[0] + p[1] * sh[1] + p[2] * sh[2]
  const perp = Math.hypot(p[0] - dot * sh[0], p[1] - dot * sh[1], p[2] - dot * sh[2])
  const lit = dot > 0 || perp > EARTH_R

  return { kind: 'iss', name: 'ISS', alt, az, lit, km: Math.round(look.rangeSat), ...project(alt, az) }
}

// Passes you can actually see: ISS sunlit, more than 10° up, sky dark enough
export function visiblePasses(start, place, days = 4, max = 3) {
  if (!record) return []
  const out = []
  let cur = null
  const end = start.getTime() + days * 86400000
  for (let t = start.getTime(); t < end && out.length < max; t += 20000) {
    const d = new Date(t)
    const p = issAt(d, place)
    if (!p) continue
    const vis = p.alt > 10 && p.lit && sunAltitude(d, place) < -6
    if (vis && !cur) cur = { start: d, startAz: p.az, maxAlt: p.alt }
    if (vis && cur && p.alt > cur.maxAlt) cur.maxAlt = p.alt
    if (!vis && cur) {
      cur.end = d
      cur.endAz = p.az
      out.push(cur)
      cur = null
    }
  }
  return out
}
