import { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useScrollLock } from './useScrollLock.js'
import { ExternalIcon, GitHubIcon } from './Icons.jsx'
import './ProjectWindow.css'

// Projects rebuilt to run right here, in the browser
const DEMOS = {
  campusconnect: lazy(() => import('../demos/campusconnect/CampusConnect.jsx')),
}

// Real screen sizes. A site loads at this size, then the whole thing is scaled
// to fit the window, so it lays out exactly as it would on that device.
const DEVICES = {
  desktop: { label: 'Desktop', w: 1440, h: 900 },
  tablet: { label: 'Tablet', w: 820, h: 1180 },
  phone: { label: 'Phone', w: 390, h: 844 },
}

const isSite = (p) => p.link && !/github\.com/.test(p.link)
const prettyUrl = (u) => u.replace(/^https?:\/\//, '').replace(/\/$/, '')
const narrowScreen = () => window.matchMedia?.('(max-width: 900px)').matches

function DeviceIcon({ kind }) {
  const paths = {
    desktop: <><rect x="2" y="3" width="16" height="11" rx="1.5" /><path d="M7 17h6M10 14v3" /></>,
    tablet: <><rect x="4" y="2" width="12" height="16" rx="2" /><path d="M9 15h2" /></>,
    phone: <><rect x="6" y="2" width="8" height="16" rx="2" /><path d="M9.5 15h1" /></>,
  }
  return (
    <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
      {paths[kind]}
    </svg>
  )
}

function ReloadIcon() {
  return (
    <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M16 10a6 6 0 1 1-1.8-4.3M16 3.5v3.2h-3.2" />
    </svg>
  )
}

// A live site, loaded at a device's real size and scaled to fit the stage
function LiveSite({ project: p, device, reloadKey }) {
  const stage = useRef(null)
  const [box, setBox] = useState({ w: 0, h: 0 })
  const [loaded, setLoaded] = useState(false)
  const [slow, setSlow] = useState(false)
  const dev = DEVICES[device]
  const framed = device !== 'desktop'

  useLayoutEffect(() => {
    const el = stage.current
    const ro = new ResizeObserver(([e]) => setBox({ w: e.contentRect.width, h: e.contentRect.height }))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    setLoaded(false)
    setSlow(false)
    const t = setTimeout(() => setSlow(true), 9000)
    return () => clearTimeout(t)
  }, [p.link, device, reloadKey])

  // Room for the device bezel when one is drawn
  const pad = framed ? 28 : 0
  const bezel = framed ? 14 : 0
  let scale = 0
  let vw = dev.w
  let vh = dev.h
  if (box.w) {
    if (framed) {
      scale = Math.min((box.w - pad * 2 - bezel * 2) / dev.w, (box.h - pad * 2 - bezel * 2) / dev.h, 1)
    } else {
      // Desktop is a browser window, not a device: keep the width, fill the height
      scale = Math.min(box.w / dev.w, 1)
      vh = Math.round(box.h / scale)
    }
  }

  return (
    <div className={`pw-stage ${framed ? 'framed' : ''}`} ref={stage}>
      {scale > 0 && (
        <div
          className={`pw-device pw-${device}`}
          style={{ width: vw * scale + bezel * 2, height: vh * scale + bezel * 2, padding: bezel }}
        >
          <div className="pw-viewport" style={{ width: vw * scale, height: vh * scale }}>
            <iframe
              key={`${p.link}-${device}-${reloadKey}`}
              src={p.link}
              title={`${p.name}, running live`}
              onLoad={() => setLoaded(true)}
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              style={{ width: vw, height: vh, transform: `scale(${scale})` }}
            />
            {!loaded && (
              <div className="pw-loading">
                {p.thumb && <img src={p.thumb} alt="" />}
                {slow ? (
                  <>
                    <span>{p.name} is taking a while to load here.</span>
                    <a className="pw-primary" href={p.link} target="_blank" rel="noreferrer">Open it in a new tab <ExternalIcon /></a>
                  </>
                ) : (
                  <span className="pw-spinner">Launching {p.name}</span>
                )}
              </div>
            )}
          </div>
        </div>
      )}
      {scale > 0 && scale < 1 && (
        <span className="pw-scale" aria-hidden="true">{vw} × {vh} at {Math.round(scale * 100)}%</span>
      )}
    </div>
  )
}

export default function ProjectWindow({ project: p, index, total, onClose, onMinimize, onStep, onJump }) {
  useScrollLock()
  const [about, setAbout] = useState(false)
  const [max, setMax] = useState(false)
  const [device, setDevice] = useState(() => (narrowScreen() ? 'phone' : 'desktop'))
  const [reloadKey, setReloadKey] = useState(0)
  const Demo = p.demo && DEMOS[p.demo]
  const site = isSite(p) && !Demo
  const runs = site || Boolean(Demo)
  const d = p.details || {}

  // On phones, a project with nothing to run opens on its details
  useEffect(() => {
    setAbout(Boolean(narrowScreen() && !runs))
  }, [p.name, runs])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') { max ? setMax(false) : onClose() }
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return
      if (e.key === 'ArrowRight') onStep(1)
      if (e.key === 'ArrowLeft') onStep(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, onStep, max])

  const address = site ? prettyUrl(p.link) : Demo ? `${p.name}, running in your browser` : p.name

  return (
    <div className={`pw ${max ? 'is-max' : ''}`} role="dialog" aria-modal="true" aria-label={p.name}>
      <div className="pw-backdrop" onClick={onClose} aria-hidden="true" />

      <div className={`pw-layout ${about ? 'show-about' : ''}`}>
        <div className="pw-window" style={{ viewTransitionName: 'vt-hero' }}>
          <div className="pw-bar" onDoubleClick={(e) => e.target === e.currentTarget && setMax((m) => !m)}>
            <span className="pw-lights">
              <button className="l-close" onClick={onClose} aria-label="Close" title="Close"><i>×</i></button>
              <button className="l-min" onClick={onMinimize} aria-label="Minimize" title="Minimize"><i>−</i></button>
              <button className="l-max" onClick={() => setMax((m) => !m)} aria-label={max ? 'Exit full size' : 'Full size'} title={max ? 'Exit full size' : 'Full size'}><i>{max ? '−' : '+'}</i></button>
            </span>

            <span className="pw-address">
              {site && <span className="pw-lock" aria-hidden="true" />}
              <span className="pw-address-text">{address}</span>
              {site && (
                <button className="pw-reload" onClick={() => setReloadKey((k) => k + 1)} aria-label="Reload" title="Reload"><ReloadIcon /></button>
              )}
            </span>

            <span className="pw-tools">
              {site && (
                <span className="pw-devices" role="radiogroup" aria-label="Screen size">
                  {Object.entries(DEVICES).map(([key, v]) => (
                    <button key={key} role="radio" aria-checked={device === key} className={device === key ? 'on' : ''} onClick={() => setDevice(key)} title={v.label}>
                      <DeviceIcon kind={key} /><span>{v.label}</span>
                    </button>
                  ))}
                </span>
              )}
              {(p.link || p.code) && (
                <a className="pw-tool" href={p.link || p.code} target="_blank" rel="noreferrer" aria-label="Open in a new tab" title="Open in a new tab"><ExternalIcon /></a>
              )}
            </span>
          </div>

          <div className="pw-screen">
            {Demo ? (
              <Suspense fallback={<div className="pw-loading"><span className="pw-spinner">Starting {p.name}</span></div>}>
                <Demo />
              </Suspense>
            ) : site ? (
              <LiveSite project={p} device={device} reloadKey={reloadKey} />
            ) : (
              <div className="pw-static">
                {p.thumb && <img src={p.thumb} alt={`${p.name} preview`} />}
                <p>This one lives on GitHub. Explore the code to see how it works.</p>
                {p.code && <a className="pw-primary" href={p.code} target="_blank" rel="noreferrer"><GitHubIcon /> View the code</a>}
              </div>
            )}
          </div>
        </div>

        <aside className="pw-about no-bar">
          <p className="pw-kicker">
            {runs ? <span className="pw-live"><i />Running live</span> : <span className="pw-code">Source on GitHub</span>}
          </p>
          <h2>{p.name}</h2>
          <p className="pw-cat">{p.category.join(' and ')}</p>
          <p className="pw-overview">{d.overview || p.description}</p>
          {d.features?.length > 0 && (
            <ul className="pw-features">{d.features.slice(0, 4).map((f) => <li key={f}>{f}</li>)}</ul>
          )}
          {d.facts?.length > 0 && (
            <dl className="pw-facts">
              {d.facts.slice(0, 4).map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
            </dl>
          )}
          <div className="pw-stack">{p.stack.map((t) => <span key={t}>{t}</span>)}</div>
          <div className="pw-actions">
            {site && <a className="pw-primary" href={p.link} target="_blank" rel="noreferrer">Open full site <ExternalIcon /></a>}
            {p.code && <a className="pw-ghost" href={p.code} target="_blank" rel="noreferrer"><GitHubIcon /> Code</a>}
          </div>
        </aside>
      </div>

      <nav className="pw-nav" aria-label="Projects">
        <button className="pw-step" onClick={() => onStep(-1)} aria-label="Previous project">←<span> Previous</span></button>
        <span className="pw-dots">
          {Array.from({ length: total }, (_, i) => (
            <button key={i} className={i === index ? 'on' : ''} onClick={() => onJump(i)} aria-label={`Project ${i + 1}`} aria-current={i === index} />
          ))}
        </span>
        <button className="pw-toggle" onClick={() => setAbout((a) => !a)}>{about ? 'Show the app' : 'About'}</button>
        <button className="pw-step" onClick={() => onStep(1)} aria-label="Next project"><span>Next </span>→</button>
      </nav>
    </div>
  )
}
