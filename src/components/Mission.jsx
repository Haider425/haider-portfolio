import { useEffect, useMemo, useRef, useState } from 'react'
import { useScrollLock } from './useScrollLock.js'
import { CloseIcon } from './Icons.jsx'
import './Mission.css'

const MONTHS = { jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11 }
const DAY = 86400000

// "Sep 2026 to Apr 2027" -> first day of Sep 2026 to last day of Apr 2027
function missionDates(period = '') {
  const m = [...period.toLowerCase().matchAll(/([a-z]{3})[a-z]*\s+(\d{4})/g)]
  // "Sep 2026 to Present": an open-ended mission, counted from its start
  if (m.length === 1 && /present/i.test(period)) {
    return { start: new Date(Number(m[0][2]), MONTHS[m[0][1]], 1), end: null, total: null }
  }
  if (m.length < 2) return null
  const start = new Date(Number(m[0][2]), MONTHS[m[0][1]], 1)
  const end = new Date(Number(m[1][2]), MONTHS[m[1][1]] + 1, 0)
  return { start, end, total: Math.round((end - start) / DAY) + 1 }
}

const HUES = ['#7f98ff', '#ff8a66', '#f5c063', '#a890ff', '#5fd3b5', '#ff9ccb']

function Patch({ job, hue }) {
  const year = (job.period || '').match(/\d{4}/g)
  const yearText = year ? [...new Set(year)].join(' to ') : job.type
  // Fit the name to the top arc (about 250px long)
  const name = job.org.toUpperCase()
  const size = Math.min(15, 250 / (name.length * 0.95))
  const spacing = name.length > 16 ? '0.06em' : '0.18em'
  return (
    <svg className="patch" viewBox="0 0 240 240" data-vt-target>
      <defs>
        <path id="arc-top" d="M 34 120 A 86 86 0 0 1 206 120" />
        <path id="arc-bottom" d="M 40 120 A 80 80 0 0 0 200 120" />
        <clipPath id="core"><circle cx="120" cy="120" r="54" /></clipPath>
      </defs>
      <circle cx="120" cy="120" r="116" fill="#0d1230" stroke={hue} strokeWidth="3" />
      <circle cx="120" cy="120" r="104" fill="none" stroke={hue} strokeOpacity=".35" strokeWidth="1" strokeDasharray="2 5" />
      <text className="patch-text" fill="#e9ecff" style={{ fontSize: `${size}px`, letterSpacing: spacing }}>
        <textPath href="#arc-top" startOffset="50%" textAnchor="middle">{name}</textPath>
      </text>
      <text className="patch-text small" fill={hue}>
        <textPath href="#arc-bottom" startOffset="50%" textAnchor="middle">{yearText}</textPath>
      </text>
      <ellipse cx="120" cy="120" rx="76" ry="24" fill="none" stroke={hue} strokeOpacity=".7" strokeWidth="1.5" transform="rotate(-20 120 120)" />
      <circle cx="120" cy="120" r="56" fill="#fff" />
      {job.logo
        ? <image href={job.logo} x="74" y="74" width="92" height="92" clipPath="url(#core)" preserveAspectRatio="xMidYMid meet" />
        : <text x="120" y="134" textAnchor="middle" fontSize="40" fontWeight="700" fill="#161823">{job.org[0]}</text>}
      <circle cx="191" cy="94" r="5" fill={hue} />
      {[[40, 60], [200, 176], [58, 186], [182, 48]].map(([x, y]) => (
        <path key={x} d={`M${x} ${y - 5}l1.4 3.6 3.6 1.4-3.6 1.4-1.4 3.6-1.4-3.6-3.6-1.4 3.6-1.4z`} fill="#e9ecff" opacity=".8" />
      ))}
    </svg>
  )
}

export default function Mission({ job, index, total, jobs, onClose, onStep, onJump }) {
  useScrollLock()
  const hue = HUES[index % HUES.length]
  const dates = useMemo(() => missionDates(job.period), [job.period])
  const now = Date.now()
  const status = useMemo(() => {
    if (!dates) return { kind: 'other', text: job.period || job.type }
    if (now < dates.start.getTime()) return { kind: 'upcoming', text: 'Launches soon' }
    if (!dates.end) {
      const day = Math.floor((now - dates.start) / DAY) + 1
      return { kind: 'live', text: `Day ${day}, still going` }
    }
    if (now > dates.end.getTime()) {
      const months = Math.round(dates.total / 30.4)
      return { kind: 'done', text: `Mission complete, ${months} months in orbit`, pct: 100 }
    }
    const day = Math.floor((now - dates.start) / DAY) + 1
    return { kind: 'live', day, text: `Day ${day} of ${dates.total}`, pct: (day / dates.total) * 100 }
  }, [dates, now, job])

  // Which way the content slides when changing missions
  const [dir, setDir] = useState(1)
  const go = (d) => { setDir(d); onStep(d) }
  const jumpTo = (i) => { if (i !== index) { setDir(i > index ? 1 : -1); onJump(i) } }

  // Swipe left and right on touch screens
  const touch = useRef(null)
  const onTouchStart = (e) => { touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY } }
  const onTouchEnd = (e) => {
    if (!touch.current) return
    const dx = e.changedTouches[0].clientX - touch.current.x
    const dy = e.changedTouches[0].clientY - touch.current.y
    touch.current = null
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) go(dx < 0 ? 1 : -1)
  }

  const body = useRef(null)
  useEffect(() => { body.current?.scrollTo(0, 0) }, [index])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose, onStep]) // eslint-disable-line react-hooks/exhaustive-deps

  const prev = jobs[(index - 1 + total) % total]
  const next = jobs[(index + 1) % total]

  return (
    <div
      className="mission"
      role="dialog"
      aria-modal="true"
      aria-label={`${job.role} at ${job.org}`}
      style={{ '--hue': hue }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <header className="m-top">
        <nav className="m-track" aria-label="Missions">
          <span className="m-track-line" aria-hidden="true" />
          {jobs.map((j, i) => (
            <button
              key={j.id}
              className={`m-stop ${i === index ? 'on' : ''} ${j.current ? 'now' : ''}`}
              style={{ '--c': HUES[i % HUES.length] }}
              onClick={() => jumpTo(i)}
              aria-label={`${j.role} at ${j.org}`}
              aria-current={i === index}
            >
              <span className="m-stop-label">{j.org}</span>
            </button>
          ))}
        </nav>
        <button className="m-close" onClick={onClose} aria-label="Close"><CloseIcon /></button>
      </header>

      <div className="m-body no-bar" ref={body}>
        <div className={`m-grid ${dir > 0 ? 'from-right' : 'from-left'}`} key={job.id}>
          <div className="m-left">
            <div className="m-patch" style={{ viewTransitionName: 'vt-hero' }}>
              <Patch job={job} hue={hue} />
            </div>
            <div className={`m-status m-${status.kind}`}>
              {status.kind === 'live' && <span className="live-dot" />}
              <span>{status.text}</span>
            </div>
            {status.pct != null && (
              <div className="m-progress" aria-hidden="true"><span style={{ width: `${status.pct}%` }} /></div>
            )}
            <p className="m-where">{[job.team, job.location, job.via].filter(Boolean).join(', ')}</p>
          </div>

          <div className="m-right">
            <p className="m-kicker">Mission {index + 1} of {total}</p>
            <h2 className="m-title">{job.role}</h2>
            <p className="m-org">{job.org}</p>

            {job.overview && (
              <section>
                <h3>Briefing</h3>
                <p>{job.overview}</p>
              </section>
            )}
            {job.highlights?.length > 0 && (
              <section>
                <h3>Objectives</h3>
                <ul className="m-objectives">
                  {job.highlights.map((h, i) => (
                    <li key={h} style={{ animationDelay: `${0.2 + i * 0.1}s` }}>
                      <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      {h}
                    </li>
                  ))}
                </ul>
              </section>
            )}
            <section>
              <h3>Payload</h3>
              <div className="m-payload">{job.tags.map((t) => <span key={t}>{t}</span>)}</div>
            </section>
            {job.learned && (
              <section>
                <h3>Debrief</h3>
                <p className="m-debrief">{job.learned}</p>
              </section>
            )}
          </div>
        </div>
      </div>

      <nav className="m-nav" aria-label="Previous and next mission">
        <button onClick={() => go(-1)}>
          <span className="m-arrow" aria-hidden="true">←</span>
          <span className="m-nav-text"><small>Previous</small>{prev.org}</span>
        </button>
        <button onClick={() => go(1)} className="m-next">
          <span className="m-nav-text"><small>Next</small>{next.org}</span>
          <span className="m-arrow" aria-hidden="true">→</span>
        </button>
      </nav>
    </div>
  )
}
