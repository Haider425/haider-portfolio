import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import Orbit from './Orbit.jsx'
import { WorkList, ProjectList } from './Lists.jsx'
import { SunIcon, MoonIcon, GitHubIcon, LinkedInIcon, MailIcon } from './Icons.jsx'
import { profile } from '../data/content.js'
import MoonGlyph, { quickMoonAngle } from '../sky/MoonGlyph.jsx'
import { morph, unmorph } from './vt.js'
import './Home.css'

// The sky code and star catalog load after the page, only when needed
const SkyBackground = lazy(() => import('../sky/SkyBackground.jsx'))
// Look up is loaded ahead of time (on idle or hover) so it can open with a morph
const loadLookUp = () => import('../sky/LookUp.jsx')
const Meteors = lazy(() => import('../sky/Meteors.jsx'))

// A shared link like ?sky=2026-12-14T03:00:00Z&lat=43.9&lon=-78.9 opens that exact sky
function sharedSky() {
  const q = new URLSearchParams(window.location.search)
  const d = q.get('sky') && new Date(q.get('sky'))
  if (!d || isNaN(d)) return null
  const lat = parseFloat(q.get('lat'))
  const lon = parseFloat(q.get('lon'))
  const place = Number.isFinite(lat) && Number.isFinite(lon) ? { name: 'you', lat, lon, custom: true } : null
  return { date: d, place }
}

const searchable = (title, ...parts) => ({
  'data-search-title': title,
  'data-search': parts.flat().filter(Boolean).join(' '),
})

export default function Home({ theme, onToggleTheme }) {
  const [shared] = useState(sharedSky)
  const [looking, setLooking] = useState(false)
  const [LookUp, setLookUp] = useState(null)
  const moonAngle = quickMoonAngle()

  const preload = useCallback(() => loadLookUp().then((m) => {
    setLookUp(() => m.default)
    return m.default
  }), [])

  // Fetch it once the page is idle; open right away if someone followed a shared sky link
  useEffect(() => {
    if (shared) { preload().then(() => setLooking(true)); return }
    const idle = window.requestIdleCallback || ((f) => setTimeout(f, 1500))
    idle(() => preload())
  }, [shared, preload])

  const openSky = async () => {
    if (!LookUp) await preload()
    morph('lookup', () => setLooking(true))
  }
  const closeSky = useCallback(() => unmorph('lookup', () => setLooking(false)), [])

  return (
    <div className="page">
      <Suspense fallback={null}>
        {theme === 'dark' && <SkyBackground />}
        {theme === 'dark' && <Meteors />}
      </Suspense>
      {looking && LookUp && <LookUp initial={shared} onClose={closeSky} />}

      <button className="theme" onClick={onToggleTheme} aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
        {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
      </button>

      <header className="top">
        <div className="intro">
          <h1>{profile.fullName}</h1>
          <p className="sub">{profile.title}</p>
          <p className="school">
            <img src="./logos/otu_logo.jpg" alt="" /> Computer Science at Ontario Tech, graduating December 2027
          </p>
          <p className="blurb">
            Software developer co-op at OPG Darlington, building tools nuclear operators use every shift, and founder of Ghostless. Minoring in math and astronomy, so I spend a lot of time looking up.
          </p>
          <nav className="links" aria-label="Find me">
            <a href={profile.github} target="_blank" rel="noreferrer"><GitHubIcon /> GitHub</a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer"><LinkedInIcon /> LinkedIn</a>
            <a href={`mailto:${profile.email}`}><MailIcon /> Email</a>
            <a href={profile.resume} target="_blank" rel="noreferrer">Resume</a>
          </nav>
          <button type="button" className="look" data-vt="lookup" onClick={openSky} onPointerEnter={preload} onFocus={preload}>
            <span className="look-moon"><MoonGlyph angle={moonAngle} size={22} /></span>
            <span className="look-text">
              <strong>Look up</strong>
              <small>The real sky over Durham, live</small>
            </span>
            <span className="look-arrow" aria-hidden="true">→</span>
          </button>
        </div>
        <Orbit photo={profile.avatar} name={profile.fullName} onLookUp={openSky} />
      </header>

      <section>
        <h2>Work</h2>
        <WorkList />
      </section>

      <section>
        <h2>Projects</h2>
        <ProjectList />
      </section>

      <section>
        <h2>Off the clock</h2>
        <p className="life" {...searchable('Off the clock', 'tennis badminton astronomy investing investment portfolio languages')}>
          Learning tennis (the backhand is a work in progress), playing badminton singles, minoring in astronomy,
          and managing my own investment portfolio. I speak English, Urdu, Hindi and Punjabi.{' '}
          {theme === 'dark'
            ? 'The stars behind this page are the real sky over Durham Region, right now.'
            : 'Switch to dark mode to see the real sky over Durham Region behind this page.'}
        </p>
      </section>

      <footer className="foot">
        <span>© {new Date().getFullYear()} {profile.fullName}</span>
        <span>Built in Durham Region, under real stars</span>
      </footer>
    </div>
  )
}
