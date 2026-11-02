import { useRef, useState } from 'react'
import { searchResults, flashElement } from '../utils/siteSearch.js'
import './Orbit.css'

// Three rings around my photo: where I've worked, what I use, what I do for fun.
// Clicking a planet scrolls to the matching line on the page.
const RINGS = [
  { name: 'work', radius: 0.38, speed: 46, items: [
    { label: 'OPG', q: 'ontario power generation' },
    { label: 'OPS', q: 'ontario public service' },
    { label: 'Square Root', q: 'square root' },
  ] },
  { name: 'tools', radius: 0.65, speed: 70, items: [
    { label: 'Python', q: 'python' },
    { label: 'Angular', q: 'angular' },
    { label: 'C#', q: 'c#' },
    { label: 'SQL Server', q: 'sql server' },
    { label: 'Next.js', q: 'next.js' },
  ] },
  { name: 'life', radius: 0.92, speed: 96, items: [
    { label: 'Ghostless', q: 'ghostless' },
    { label: 'Tennis', q: 'tennis' },
    { label: 'Badminton', q: 'badminton' },
    { label: 'Astronomy', lookUp: true },
  ] },
]

export default function Orbit({ photo, name, onLookUp }) {
  const [active, setActive] = useState(null)
  const last = useRef({ q: '', results: [], i: 0 })
  const timer = useRef(null)

  const go = (it) => {
    if (it.lookUp) return onLookUp?.()
    if (it.q === last.current.q && last.current.results.length > 1) {
      last.current.i = (last.current.i + 1) % last.current.results.length
    } else {
      last.current = { q: it.q, results: searchResults(it.q), i: 0 }
    }
    const el = last.current.results[last.current.i]
    if (el) flashElement(el)
    setActive(it.label)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setActive(null), 2400)
  }

  return (
    <div className="orbit" role="group" aria-label="Jump to a company, tool or interest">
      {RINGS.map((r) => (
        <div key={r.name} className={`orbit-ring orbit-${r.name}`}
          style={{ '--r': r.radius, '--speed': `${r.speed}s`, '--delay': `${r.radius * 0.5}s` }}>
          {r.items.map((it, i) => (
            <div key={it.label} className="planet-pos"
              style={{ '--a': `${(360 / r.items.length) * i + r.radius * 90}deg`, '--pd': `${r.radius * 0.5 + 0.35 + i * 0.08}s` }}>
              <button type="button" className={`planet ${active === it.label ? 'on' : ''}`} onClick={() => go(it)}>
                {it.label}
              </button>
            </div>
          ))}
        </div>
      ))}
      <img className="orbit-core" src={photo} alt={name} />
    </div>
  )
}
