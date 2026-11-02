import { useEffect, useMemo, useRef, useState } from 'react'
import { useScrollLock } from '../components/useScrollLock.js'
import {
  sky, moon, sunTimes, direction, constellationName, HOME, namedStars, constellations,
  planetNames, nextRise, starRise, sunAltitude,
} from './compute.js'
import { drawSky, pick } from './draw.js'
import { loadISS, issAt, visiblePasses } from './iss.js'
import { nextShower, daysUntil } from './showers.js'
import MoonGlyph from './MoonGlyph.jsx'
import { SearchIcon, PinIcon, CompassIcon, ShareIcon, PlayIcon, PauseIcon, CloseIcon, NowIcon } from './icons.jsx'
import './LookUp.css'

const RAD = Math.PI / 180
const fmtTime = (d) => d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
const fmtDay = (d) => d.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })
const fmtWhen = (d) => {
  const today = new Date()
  const tomorrow = new Date(today.getTime() + 86400000)
  const day = d.toDateString() === today.toDateString() ? 'Today'
    : d.toDateString() === tomorrow.toDateString() ? 'Tomorrow' : fmtDay(d)
  return `${day}, ${fmtTime(d)}`
}
const toLocalInput = (d) => {
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`
}

function height(alt) {
  if (alt > 70) return 'almost straight up'
  if (alt > 40) return 'high'
  if (alt > 15) return 'partway up'
  return 'low'
}

const where = (o) => `${Math.round(o.alt)}° up, ${height(o.alt)} in the ${direction(o.az)}`

function describe(o, when, place) {
  if (!o) return null
  if (o.kind === 'con') {
    if (o.alt > 0) return { title: o.name, lines: [`Constellation, ${height(o.alt)} in the ${direction(o.az)}`] }
    const r = starRise(o, when, place)
    return { title: o.name, lines: [r === 'never' ? 'Constellation, never rises from here' : `Constellation, below the horizon. Rises ${fmtWhen(r)}`] }
  }
  if (o.kind === 'iss') {
    return {
      title: 'International Space Station',
      lines: o.alt > 0
        ? [where(o), `${o.km.toLocaleString()} km away`, o.lit ? 'Lit by the sun, so you can see it' : "In Earth's shadow, so it's dark right now"]
        : ['Below the horizon right now', 'It circles the Earth every 92 minutes'],
    }
  }
  const below = () => {
    if (o.kind === 'star') {
      const r = starRise(o, when, place)
      if (r === 'never') return 'Never rises from here'
      return `Below the horizon. Rises ${fmtWhen(r)}`
    }
    const r = nextRise(o.name, when, place)
    return r ? `Below the horizon. Rises ${fmtWhen(r)}` : 'Below the horizon'
  }
  if (o.kind === 'planet') return { title: o.name, lines: [`Planet, magnitude ${o.mag.toFixed(1)}`, o.alt > 0 ? where(o) : below()] }
  if (o.kind === 'moon') return { title: 'The Moon', lines: [o.alt > 0 ? where(o) : below()] }
  const bright =
    o.mag < 0.5 ? 'One of the brightest stars in the sky' :
    o.mag < 2 ? 'A bright star' :
    o.mag < 3.5 ? 'Easy to see from a dark yard' : 'Faint, you need dark skies'
  return {
    title: o.name || 'An unnamed star',
    lines: [`In ${constellationName(o.con)}, magnitude ${o.mag.toFixed(1)}`, bright, o.alt > 0 ? where(o) : below()],
  }
}

// Everything the search box can find
const TARGETS = [
  ...planetNames.map((n) => ({ type: 'body', key: n, label: n, sub: 'Planet' })),
  { type: 'body', key: 'Moon', label: 'Moon', sub: 'Our moon' },
  { type: 'iss', key: 'ISS', label: 'ISS', sub: 'International Space Station' },
  ...constellations.map((c) => ({ type: 'con', key: c.id, label: c.name, sub: 'Constellation' })),
  ...namedStars.filter((s) => s.mag < 4).sort((a, b) => a.mag - b.mag)
    .map((s) => ({ type: 'star', key: s.name, label: s.name, sub: `Star in ${constellationName(s.con)}` })),
]

export default function LookUp({ onClose, initial }) {
  useScrollLock()
  const canvasRef = useRef(null)
  const boxRef = useRef(null)
  const geo = useRef({ cx: 0, cy: 0, R: 1, rot: 0 })
  const touch = useMemo(() => window.matchMedia?.('(pointer: coarse)').matches, [])

  const [place, setPlace] = useState(initial?.place || HOME)
  const [base, setBase] = useState(initial?.date || null) // null = live
  const [now, setNow] = useState(() => new Date())
  const [offset, setOffset] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [hover, setHover] = useState(null)
  const [target, setTarget] = useState(null)
  const [query, setQuery] = useState('')
  const [issReady, setIssReady] = useState(false)
  const [issFailed, setIssFailed] = useState(false)
  const [passes, setPasses] = useState(null)
  const [heading, setHeading] = useState(null)
  const [note, setNote] = useState('')
  const stopCompass = useRef(null)

  const when = useMemo(() => new Date((base || now).getTime() + offset * 3600000), [base, now, offset])
  const state = useMemo(() => sky(when, place), [when, place])
  const lunar = useMemo(() => moon(when), [when])
  const sun = useMemo(() => sunTimes(when, place), [when, place])
  const shower = useMemo(() => nextShower(when), [when])

  // The slider track is painted with the real sky colour for each hour it covers
  const track = useMemo(() => {
    const start = (base || now).getTime()
    const stops = []
    for (let h = -12; h <= 24; h += 1) {
      const alt = sunAltitude(new Date(start + h * 3600000), place)
      const c = alt > 6 ? '#5b86d6' : alt > 0 ? '#e0905a' : alt > -6 ? '#3b3f86' : alt > -12 ? '#1d2252' : '#0b0e26'
      stops.push(`${c} ${(((h + 12) / 36) * 100).toFixed(1)}%`)
    }
    return `linear-gradient(90deg, ${stops.join(', ')})`
  }, [base, now, place])
  const radiant = useMemo(() => {
    if (!shower) return null
    const p = { ra: shower.ra, sd: Math.sin(shower.dec * RAD), cd: Math.cos(shower.dec * RAD) }
    return { ...state.put(p), name: `${shower.name} radiant` }
  }, [shower, state])
  const iss = issReady ? issAt(when, place) : null
  const up = state.bodies.filter((b) => b.kind !== 'sun' && b.alt > 0)
  const sunUp = state.bodies.find((b) => b.kind === 'sun').alt > 0

  // The object the search is pointing at, in the current sky
  const focus = useMemo(() => {
    if (!target) return null
    if (target.type === 'body') return state.bodies.find((b) => b.name === target.key)
    if (target.type === 'star') return state.stars.find((s) => s.name === target.key)
    if (target.type === 'iss') return iss || { kind: 'iss', alt: -90 }
    if (target.type === 'con') {
      const l = state.labels.find((x) => x.id === target.key)
      return l && { ...l, kind: 'con' }
    }
    return null
  }, [target, state, iss])

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return TARGETS.filter((t) => t.label.toLowerCase().includes(q))
      .sort((a, b) => a.label.toLowerCase().indexOf(q) - b.label.toLowerCase().indexOf(q))
      .slice(0, 6)
  }, [query])

  // Live clock, ISS data, and pass predictions
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30000)
    loadISS().then((r) => (r ? setIssReady(true) : setIssFailed(true)))
    return () => clearInterval(t)
  }, [])
  useEffect(() => {
    if (!issReady) return
    setPasses(null)
    const id = setTimeout(() => setPasses(visiblePasses(new Date(), place)), 60)
    return () => clearTimeout(id)
  }, [issReady, place])

  // Play the next 24 hours
  useEffect(() => {
    if (!playing) return
    let raf
    let last = performance.now()
    const step = (t) => {
      const dt = (t - last) / 1000
      last = t
      setOffset((o) => Math.min(24, o + dt * 1.2))
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [playing])
  useEffect(() => { if (offset >= 24) setPlaying(false) }, [offset])
  useEffect(() => { setHover(null) }, [offset, base, place])

  // Draw. Live mode also moves the ISS smoothly between clock ticks.
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    let raf
    const frame = (t) => {
      const box = boxRef.current.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const size = Math.max(200, Math.min(box.width, box.height))
      if (canvas.width !== Math.round(size * dpr)) {
        canvas.width = Math.round(size * dpr)
        canvas.height = Math.round(size * dpr)
        canvas.style.width = `${size}px`
        canvas.style.height = `${size}px`
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, size, size)
      const R = size / 2 - (size < 420 ? 22 : 32)
      const rot = heading == null ? 0 : Math.PI + heading * RAD
      geo.current = { cx: size / 2, cy: size / 2, R, rot }
      const liveIss = issReady && !base && !playing && offset === 0 ? issAt(new Date(), place) : iss
      drawSky(ctx, state, {
        ...geo.current, mode: 'full', hover, focus,
        focusCon: target?.type === 'con' ? target.key : null,
        moonAngle: lunar.angle, iss: liveIss, radiant,
        time: reduced ? 0 : t / 1000, scale: Math.max(0.85, Math.min(1.15, size / 640)),
      })
      if (!reduced || issReady) raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(raf)
  }, [state, hover, focus, target, lunar, iss, issReady, radiant, heading, base, playing, offset, place])

  // Esc closes; lock page scroll while open
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  const flash = (msg) => {
    setNote(msg)
    setTimeout(() => setNote(''), 3500)
  }

  const onMove = (e) => {
    const r = canvasRef.current.getBoundingClientRect()
    setHover(pick(state, e.clientX - r.left, e.clientY - r.top, geo.current, iss ? [iss] : []))
  }

  const useMyLocation = () => {
    if (!navigator.geolocation) return flash("This browser can't share its location.")
    flash('Finding you…')
    navigator.geolocation.getCurrentPosition(
      (p) => {
        setPlace({ name: 'you', lat: +p.coords.latitude.toFixed(2), lon: +p.coords.longitude.toFixed(2), custom: true })
        flash('Showing the sky over you.')
      },
      () => flash('Location is blocked, so this stays on Durham Region.'),
      { timeout: 10000, maximumAge: 600000 }
    )
  }

  const compass = async () => {
    if (heading != null) { stopCompass.current?.(); setHeading(null); return }
    try {
      if (typeof DeviceOrientationEvent !== 'undefined' && DeviceOrientationEvent.requestPermission) {
        const ok = await DeviceOrientationEvent.requestPermission()
        if (ok !== 'granted') return flash('Compass access was declined.')
      }
    } catch {
      return flash('Compass access was declined.')
    }
    const onTurn = (e) => {
      let h = e.webkitCompassHeading
      if (h == null && e.alpha != null && (e.absolute || e.type === 'deviceorientationabsolute')) h = 360 - e.alpha
      if (h != null) setHeading((prev) => (prev == null ? h : prev + ((((h - prev) % 360) + 540) % 360 - 180) * 0.25))
    }
    const ev = 'ondeviceorientationabsolute' in window ? 'deviceorientationabsolute' : 'deviceorientation'
    window.addEventListener(ev, onTurn)
    setHeading(0)
    flash('Face any direction. That part of the sky is at the bottom of the chart.')
    stopCompass.current = () => window.removeEventListener(ev, onTurn)
  }
  useEffect(() => () => stopCompass.current?.(), [])

  const share = async () => {
    const u = new URL(window.location.href)
    u.search = ''
    u.hash = ''
    u.searchParams.set('sky', when.toISOString())
    if (place.custom) {
      u.searchParams.set('lat', place.lat)
      u.searchParams.set('lon', place.lon)
    }
    try {
      await navigator.clipboard.writeText(u.toString())
      flash('Link copied. It opens this exact sky.')
    } catch {
      flash(u.toString())
    }
  }

  const choose = (t) => {
    setTarget(t)
    setQuery('')
  }

  const info = describe(hover || focus, when, place)
  const live = !base && offset === 0
  const placeName = place.custom ? 'you' : place.name

  const issText = issFailed ? "Couldn't reach the satellite data right now." : !issReady ? 'Getting its orbit' : passes == null ? 'Working out passes' : null
  const showerDays = shower ? daysUntil(shower, when) : 0

  return (
    <div className="lookup" role="dialog" aria-modal="true" aria-label={`The sky over ${placeName}`}>
      <header className="lu-head">
        <div className="lu-title">
          <h2>The sky over {placeName}</h2>
          <p>
            <span className={`lu-live ${live ? 'on' : ''}`}><i />{live ? 'Live' : 'Time travel'}</span>
            {live ? 'Right now' : fmtWhen(when)}
            {sunUp ? ', the sun is up, so these stars are hidden by daylight' : ''}
          </p>
        </div>
        <button className="lu-close" onClick={onClose} aria-label="Close the sky"><CloseIcon /></button>
      </header>

      <div className="lu-tools">
        <div className="lu-find">
          <SearchIcon />
          <input
            id="lu-find"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && matches[0] && choose(matches[0])}
            placeholder="Find a star, planet or constellation"
            aria-label="Find a star, planet or constellation"
            autoComplete="off"
          />
          {matches.length > 0 && (
            <ul className="lu-results">
              {matches.map((m) => (
                <li key={m.type + m.key}>
                  <button onClick={() => choose(m)}>{m.label}<span>{m.sub}</span></button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="lu-actions">
          <input
            className="lu-date"
            id="lu-date"
            type="datetime-local"
            aria-label="Pick any date and time"
            value={toLocalInput(when)}
            onChange={(e) => {
              const d = new Date(e.target.value)
              if (!isNaN(d)) { setBase(d); setOffset(0); setPlaying(false) }
            }}
          />
          <button className={`lu-btn ${place.custom ? 'on' : ''}`} onClick={place.custom ? () => setPlace(HOME) : useMyLocation} title={place.custom ? 'Back to Durham Region' : 'Show the sky over you'}>
            <PinIcon /><span>{place.custom ? 'Durham' : 'My sky'}</span>
          </button>
          {touch && (
            <button className={`lu-btn ${heading != null ? 'on' : ''}`} onClick={compass} title="Turn the chart with your phone">
              <CompassIcon /><span>{heading != null ? 'Compass on' : 'Compass'}</span>
            </button>
          )}
          <button className="lu-btn" onClick={share} title="Copy a link to this exact sky">
            <ShareIcon /><span>Share</span>
          </button>
        </div>
      </div>

      <div className="lu-body">
        <div className="lu-chart" ref={boxRef} style={{ viewTransitionName: 'vt-hero' }}>
          <canvas
            ref={canvasRef}
            onPointerMove={onMove}
            onPointerDown={onMove}
            onPointerLeave={() => setHover(null)}
            role="img"
            aria-label={`Sky chart. ${up.length ? `Visible: ${up.map((b) => b.name).join(', ')}.` : ''}`}
          />
          {info && (
            <div className="lu-tip">
              <strong>{info.title}</strong>
              {info.lines.map((l) => <span key={l}>{l}</span>)}
              {target && !hover && <button className="lu-clear" onClick={() => setTarget(null)}>Clear</button>}
            </div>
          )}
          {note && <div className="lu-note" role="status">{note}</div>}
          <p className="lu-hint">{touch ? 'Tap a star to name it' : 'Hover a star to name it'}</p>
        </div>

        <aside className="lu-side no-bar">
          <section className="lu-card">
            <h3>Moon</h3>
            <div className="lu-moon">
              <MoonGlyph angle={lunar.angle} size={40} />
              <div>
                <p className="lu-big">{lunar.name}</p>
                <p>{Math.round(lunar.lit * 100)}% lit</p>
              </div>
            </div>
          </section>

          <section className="lu-card">
            <h3>Up in the sky</h3>
            {up.length ? (
              <ul className="lu-list">
                {up.map((b) => (
                  <li key={b.name}>
                    <button onClick={() => choose({ type: 'body', key: b.name })}>
                      <i style={{ background: b.color }} />
                      <span><strong>{b.name}</strong>{height(b.alt)} in the {direction(b.az)}</span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : <p>No planets above the horizon right now.</p>}
          </section>

          <section className="lu-card">
            <h3>Space station</h3>
            {issText ? <p>{issText}</p> : passes.length ? (
              <>
                <p className="lu-big">{fmtWhen(passes[0].start)}</p>
                <p>
                  Rises in the {direction(passes[0].startAz)}, up to {Math.round(passes[0].maxAlt)}°,
                  visible for {Math.max(1, Math.round((passes[0].end - passes[0].start) / 60000))} min
                </p>
                <button className="lu-link" onClick={() => {
                  setBase(new Date(passes[0].start.getTime() + 30000)); setOffset(0); setPlaying(false)
                  choose({ type: 'iss', key: 'ISS' })
                }}>Show me</button>
              </>
            ) : <p>No visible passes in the next 4 days.</p>}
          </section>

          {shower && (
            <section className="lu-card lu-extra">
              <h3>Next meteor shower</h3>
              <p className="lu-big">{shower.name}</p>
              <p>
                Peaks {shower.nights}
                {showerDays > 1 ? `, in ${showerDays} days` : showerDays === 1 ? ', tomorrow night' : ', tonight'}.
                Up to {shower.rate} an hour from a dark sky.
              </p>
            </section>
          )}

          <section className="lu-card lu-extra lu-sun">
            <h3>Sun</h3>
            <div className="lu-suntimes">
              {sun.set && <p><small>Sets</small>{fmtTime(sun.set)}</p>}
              {sun.rise && <p><small>Rises</small>{fmtTime(sun.rise)}</p>}
            </div>
          </section>
        </aside>
      </div>

      <footer className="lu-time">
        <button
          className="lu-play"
          onClick={() => { if (offset >= 24) setOffset(0); setPlaying((p) => !p) }}
          aria-label={playing ? 'Pause' : 'Play the next 24 hours'}
        >
          {playing ? <PauseIcon /> : <PlayIcon />}<span>{playing ? 'Pause' : 'Play 24 hours'}</span>
        </button>
        <div className="lu-scrub-wrap">
          <input
            type="range"
            id="lu-scrub"
            min={-12}
            max={24}
            step={0.25}
            value={offset}
            style={{ '--track': track }}
            onChange={(e) => { setPlaying(false); setOffset(Number(e.target.value)) }}
            aria-label="Hours from the chosen time"
          />
          <div className="lu-scale" aria-hidden="true">
            <span>12 h ago</span><span className="lu-now-mark">Now</span><span>24 h ahead</span>
          </div>
        </div>
        <span className="lu-when">{fmtTime(when)}</span>
        {!live && (
          <button className="lu-btn" onClick={() => { setPlaying(false); setOffset(0); setBase(null) }} title="Back to now">
            <NowIcon /><span>Now</span>
          </button>
        )}
      </footer>
      <p className="lu-credit">
        Stars from d3-celestial by Olaf Frohn. Planets from Astronomy Engine. ISS orbit from CelesTrak.
        Meteor showers from the American Meteor Society.
      </p>
    </div>
  )
}
