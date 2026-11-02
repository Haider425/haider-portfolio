import { useRef, useState } from 'react'
import { ArrowIcon, PinIcon } from './Icons.jsx'
import { profile, quickFacts, experience } from '../data/content.js'
import { searchResults, flashElement, feelingLucky } from '../utils/siteSearch.js'
import './Hero.css'

// Three orbits around my photo: where I've worked, what I use, what I do for fun.
// Clicking a planet jumps to the matching part of the page.
const ORBITS = [
  {
    name: 'work',
    radius: 0.37,
    speed: 46,
    items: [
      { label: 'OPG', q: 'ontario power generation' },
      { label: 'OPS', q: 'ontario public service' },
      { label: 'Square Root', q: 'square root' },
    ],
  },
  {
    name: 'tools',
    radius: 0.64,
    speed: 70,
    items: [
      { label: 'Power BI', q: 'power bi' },
      { label: 'Angular', q: 'angular' },
      { label: 'Python', q: 'python' },
      { label: 'SQL', q: 'sql' },
      { label: 'React', q: 'react' },
    ],
  },
  {
    name: 'life',
    radius: 0.9,
    speed: 96,
    items: [
      { label: 'Tennis', q: 'tennis' },
      { label: 'Badminton', q: 'badminton' },
      { label: 'Astronomy', q: 'astronomy' },
      { label: 'Investing', q: 'investment portfolio' },
    ],
  },
]

const current = experience.find((e) => e.current)

export default function Hero() {
  const [status, setStatus] = useState(null)
  const [active, setActive] = useState(null)
  const last = useRef({ q: '', results: [], index: 0 })
  const hideTimer = useRef(null)

  const go = (item) => {
    const q = item.q
    if (q === last.current.q && last.current.results.length > 1) {
      last.current.index = (last.current.index + 1) % last.current.results.length
    } else {
      last.current = { q, results: searchResults(q), index: 0 }
    }
    const { results, index } = last.current
    setActive(item.label)
    clearTimeout(hideTimer.current)
    if (!results.length) {
      setStatus(`Nothing on the page for ${item.label} yet.`)
    } else {
      flashElement(results[index])
      setStatus(
        results.length === 1
          ? `${item.label}: 1 match`
          : `${item.label}: match ${index + 1} of ${results.length}. Click again for the next one.`
      )
    }
    hideTimer.current = setTimeout(() => { setStatus(null); setActive(null) }, 5000)
  }

  return (
    <section className="hero" id="top">
      <div className="container hero-inner">
        <div className="hero-copy">
          {current && (
            <a className="hero-now" href={`#experience/${current.id}`}>
              <span className="live-dot" />
              Currently at {current.org}
            </a>
          )}
          <h1 className="hero-name">{profile.fullName}</h1>
          <p className="hero-title">{profile.title}</p>
          <p className="hero-tagline">{profile.tagline}</p>

          <div className="hero-actions">
            <a href="#projects" className="btn btn-filled">
              View my work <ArrowIcon width={18} height={18} />
            </a>
            <a href={profile.resume} className="btn btn-tonal" target="_blank" rel="noreferrer">Résumé</a>
            <button type="button" className="btn btn-ghost" onClick={feelingLucky}>Surprise me</button>
          </div>

          <ul className="hero-facts">
            {quickFacts.map((f) => (
              <li key={f.label}>
                <strong>{f.label}</strong>
                <span>{f.sub}</span>
              </li>
            ))}
          </ul>

          <p className="hero-loc">
            <PinIcon width={16} height={16} /> {profile.location}
          </p>
        </div>

        <div className="orbit-wrap">
          <div className="orbit" role="group" aria-label="Explore by company, tool or interest">
            {ORBITS.map((o) => (
              <div
                key={o.name}
                className={`orbit-ring orbit-${o.name}`}
                style={{ '--r': o.radius, '--speed': `${o.speed}s` }}
              >
                {o.items.map((it, i) => (
                  <div
                    key={it.label}
                    className="planet-pos"
                    style={{ '--a': `${(360 / o.items.length) * i + o.radius * 90}deg` }}
                  >
                    <button
                      type="button"
                      className={`planet ${active === it.label ? 'on' : ''}`}
                      onClick={() => go(it)}
                    >
                      {it.label}
                    </button>
                  </div>
                ))}
              </div>
            ))}
            <img className="orbit-core" src={profile.avatar} alt={profile.fullName} />
          </div>
          <p className={`orbit-hint ${status ? 'show' : ''}`} role="status">
            {status || 'Click anything in orbit to jump to it.'}
          </p>
        </div>
      </div>
    </section>
  )
}
