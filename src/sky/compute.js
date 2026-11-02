// Where everything is in the sky for a place and moment.
// Stars come from the catalog; the Sun, Moon and planets from Astronomy Engine.
import * as A from 'astronomy-engine'
import catalog from './catalog.js'

export const HOME = { name: 'Durham Region', lat: 43.88, lon: -78.94 }
const RAD = Math.PI / 180

// Precompute what doesn't change with time or place
const stars = catalog.stars.map(([ra, dec, mag, bv, name, con]) => ({
  kind: 'star', ra, dec, mag, bv, name, con,
  sd: Math.sin(dec * RAD),
  cd: Math.cos(dec * RAD),
}))
const prep = (pts) => pts.map(([ra, dec]) => ({ ra, dec, sd: Math.sin(dec * RAD), cd: Math.cos(dec * RAD) }))
const lines = catalog.lines.map(([con, pts]) => ({ con, pts: prep(pts) }))
const milky = catalog.mw.map(([, pts]) => prep(pts))
const labels = Object.entries(catalog.labels).map(([id, [ra, dec]]) => ({
  id, name: catalog.cons[id], ...prep([[ra, dec]])[0],
}))
export const constellationName = (id) => catalog.cons[id] || id
export const namedStars = stars.filter((s) => s.name)
export const constellations = Object.entries(catalog.cons).map(([id, name]) => ({ id, name }))

const observers = new Map()
export function observer(place) {
  const key = `${place.lat},${place.lon}`
  if (!observers.has(key)) observers.set(key, new A.Observer(place.lat, place.lon, 100))
  return observers.get(key)
}

// Local sidereal time in degrees
export function lst(date, place) {
  return (((A.SiderealTime(date) * 15 + place.lon) % 360) + 360) % 360
}

function horizonFor(place) {
  const sinLat = Math.sin(place.lat * RAD)
  const cosLat = Math.cos(place.lat * RAD)
  return (p, LST) => {
    const H = (LST - p.ra) * RAD
    const cH = Math.cos(H)
    const alt = Math.asin(sinLat * p.sd + cosLat * p.cd * cH)
    const az = Math.atan2(-p.cd * Math.sin(H), p.sd * cosLat - p.cd * sinLat * cH)
    return { alt: alt / RAD, az: ((az / RAD) + 360) % 360 }
  }
}

// Stereographic projection centred on the zenith. The horizon is r = 1.
// North is up and east is on the left, like a planisphere held overhead.
export function project(alt, az) {
  const r = Math.tan(((90 - alt) / 2) * RAD)
  return { x: -r * Math.sin(az * RAD), y: -r * Math.cos(az * RAD), r }
}

const PLANETS = [
  ['Mercury', '#c9c3b6'],
  ['Venus', '#fff3c4'],
  ['Mars', '#ff8a66'],
  ['Jupiter', '#f2d7a8'],
  ['Saturn', '#e8d08a'],
]
export const planetNames = PLANETS.map(([n]) => n)

function bodyAt(name, date, place) {
  const obs = observer(place)
  const eq = A.Equator(A.Body[name], date, obs, true, true)
  const h = A.Horizon(date, obs, eq.ra, eq.dec, 'normal')
  return { alt: h.altitude, az: h.azimuth, ...project(h.altitude, h.azimuth) }
}

export function bodies(date, place) {
  const out = PLANETS.map(([name, color]) => ({
    kind: 'planet', name, color,
    mag: A.Illumination(A.Body[name], date).mag,
    ...bodyAt(name, date, place),
  }))
  out.push({ kind: 'moon', name: 'Moon', color: '#fbf6e6', ...bodyAt('Moon', date, place) })
  out.push({ kind: 'sun', name: 'Sun', ...bodyAt('Sun', date, place) })
  return out
}

export function sky(date, place = HOME) {
  const LST = lst(date, place)
  const hz = horizonFor(place)
  const put = (p) => {
    const h = hz(p, LST)
    return { ...h, ...project(h.alt, h.az) }
  }
  return {
    place,
    stars: stars.map((s) => ({ ...s, ...put(s) })),
    lines: lines.map((l) => ({ con: l.con, pts: l.pts.map(put) })),
    milky: milky.map((ring) => ring.map(put)),
    labels: labels.map((l) => ({ id: l.id, name: l.name, ra: l.ra, dec: l.dec, ...put(l) })),
    bodies: bodies(date, place),
    put,
  }
}

const PHASES = [
  [22.5, 'New moon'], [67.5, 'Waxing crescent'], [112.5, 'First quarter'], [157.5, 'Waxing gibbous'],
  [202.5, 'Full moon'], [247.5, 'Waning gibbous'], [292.5, 'Last quarter'], [337.5, 'Waning crescent'], [361, 'New moon'],
]

export function moon(date) {
  const angle = A.MoonPhase(date)
  return {
    angle,
    lit: A.Illumination(A.Body.Moon, date).phase_fraction,
    name: PHASES.find(([max]) => angle < max)[1],
  }
}

// Sunset on the given day and the sunrise after it
export function sunTimes(date, place) {
  const dayStart = new Date(date)
  dayStart.setHours(0, 0, 0, 0)
  const set = A.SearchRiseSet(A.Body.Sun, observer(place), -1, dayStart, 1)
  const rise = A.SearchRiseSet(A.Body.Sun, observer(place), +1, set ? set.date : date, 1)
  return { set: set?.date, rise: rise?.date }
}

// Next rise of a planet, the Moon or the Sun after a moment
export function nextRise(name, date, place) {
  return A.SearchRiseSet(A.Body[name], observer(place), +1, date, 2)?.date || null
}

// Next rise of a star: solve for the hour angle where it crosses the horizon.
// Returns 'always' for stars that never set and 'never' for ones that never rise.
export function starRise(star, date, place) {
  const phi = place.lat * RAD
  const cosH0 = -Math.tan(phi) * Math.tan(star.dec * RAD)
  if (cosH0 < -1) return 'always'
  if (cosH0 > 1) return 'never'
  const H0 = Math.acos(cosH0) / RAD // degrees
  const H = (lst(date, place) - star.ra + 360) % 360 // current hour angle
  const toRise = (360 - H0 - H + 720) % 360 // degrees of hour angle until rising
  return new Date(date.getTime() + (toRise / 360.9856) * 86400000)
}

// Plain-language direction from an azimuth
const DIRS = ['north', 'northeast', 'east', 'southeast', 'south', 'southwest', 'west', 'northwest']
export const direction = (az) => DIRS[Math.round(az / 45) % 8]

// Star colour from its B-V index
export function starColor(bv) {
  const t = Math.max(-0.4, Math.min(2, bv))
  if (t < 0) return '#b5c7ff'
  if (t < 0.4) return '#e6ecff'
  if (t < 0.8) return '#fff6e4'
  if (t < 1.3) return '#ffdcae'
  return '#ffbe8a'
}

// Sun position vector in km (for the ISS shadow test)
export function sunVectorKm(date) {
  const v = A.GeoVector(A.Body.Sun, date, true)
  const AU = 149597870.7
  return [v.x * AU, v.y * AU, v.z * AU]
}

export const sunAltitude = (date, place) => bodyAt('Sun', date, place).alt
