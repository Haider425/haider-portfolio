import { useEffect, useRef, useState } from 'react'
import { CloseIcon, ArrowIcon, PinIcon } from './Icons.jsx'
import { projects } from '../data/content.js'
import { flashElement } from '../utils/siteSearch.js'
import Logo from './Logo.jsx'
import './ExperienceSheet.css'

// Material-style side sheet (bottom sheet on mobile) with the full details of a role
export default function ExperienceSheet({ job, color, position, total, onClose, onPrev, onNext }) {
  const panelRef = useRef(null)
  const [shown, setShown] = useState(job)

  // Keep the last job rendered while the closing animation plays
  useEffect(() => {
    if (job) setShown(job)
  }, [job])

  const isOpen = Boolean(job)

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight' && onNext) onNext()
      if (e.key === 'ArrowLeft' && onPrev) onPrev()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose, onNext, onPrev])

  // Move focus into the panel and back to the top when the role changes
  useEffect(() => {
    if (isOpen && panelRef.current) {
      panelRef.current.scrollTop = 0
      panelRef.current.focus({ preventScroll: true })
    }
  }, [isOpen, job?.id])

  const goToProject = (name) => {
    onClose()
    setTimeout(() => {
      const el = [...document.querySelectorAll('[data-lucky]')].find((n) =>
        n.querySelector('h3')?.textContent === name
      )
      if (el) flashElement(el)
    }, 250)
  }

  const j = shown
  if (!j) return null

  const facts = [
    ['Type', j.type],
    ['When', j.period],
    ['Length', j.duration],
    ['Team', j.team],
    ['Ministry', j.ministry],
    ['Through', j.via],
    ['Where', j.location],
  ].filter(([, v]) => v)

  const relatedProjects = (j.related || []).map((n) => projects.find((p) => p.name === n)).filter(Boolean)

  return (
    <div className={`sheet-root ${isOpen ? 'open' : ''}`} aria-hidden={!isOpen}>
      <div className="sheet-scrim" onClick={onClose} />
      <aside
        className="sheet"
        role="dialog"
        aria-modal="true"
        aria-label={`${j.role} at ${j.org}`}
        ref={panelRef}
        tabIndex={-1}
        style={{ '--accent': color }}
      >
        <div className="sheet-handle" aria-hidden="true" />
        <header className="sheet-top">
          <span className="sheet-count">
            {position} of {total}
          </span>
          <div className="sheet-nav">
            <button className="icon-btn" onClick={onPrev} disabled={!onPrev} aria-label="Previous role">
              <ArrowIcon style={{ transform: 'rotate(180deg)' }} />
            </button>
            <button className="icon-btn" onClick={onNext} disabled={!onNext} aria-label="Next role">
              <ArrowIcon />
            </button>
            <button className="icon-btn" onClick={onClose} aria-label="Close">
              <CloseIcon />
            </button>
          </div>
        </header>

        <div className="sheet-hero" key={j.id}>
          <Logo job={j} color={color} className="sheet-logo" />
          <div>
            <p className="sheet-org">{j.org}</p>
            <h2 className="sheet-role">{j.role}</h2>
            <div className="sheet-meta">
              {j.current && <span className="badge">Current</span>}
              {j.period && <span>{j.period}</span>}
              {j.location && (
                <span className="sheet-loc">
                  <PinIcon width={14} height={14} /> {j.location}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="sheet-body" key={j.id + '-body'}>
          <p className="sheet-overview">{j.overview || j.snippet}</p>

          {j.highlights?.length > 0 && (
            <section className="sheet-block">
              <h3>What I did</h3>
              <ul className="sheet-list">
                {j.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            </section>
          )}

          {j.learned && (
            <section className="sheet-block">
              <h3>What I took away</h3>
              <blockquote className="sheet-quote">{j.learned}</blockquote>
            </section>
          )}

          <section className="sheet-block">
            <h3>Tools & skills</h3>
            <div className="sheet-tags">
              {j.tags.map((t) => (
                <span key={t} className="chip">{t}</span>
              ))}
            </div>
          </section>

          {relatedProjects.length > 0 && (
            <section className="sheet-block">
              <h3>Related projects</h3>
              <div className="sheet-related">
                {relatedProjects.map((p) => (
                  <button key={p.name} className={`related-card tint-${p.color}`} onClick={() => goToProject(p.name)}>
                    <span>
                      <strong>{p.name}</strong>
                      <small>{p.stack.slice(0, 3).join(' · ')}</small>
                    </span>
                    <ArrowIcon width={18} height={18} />
                  </button>
                ))}
              </div>
            </section>
          )}

          {facts.length > 0 && (
            <section className="sheet-block">
              <h3>At a glance</h3>
              <dl className="sheet-facts">
                {facts.map(([k, v]) => (
                  <div key={k}>
                    <dt>{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}
        </div>

        <footer className="sheet-foot">
          <button className="btn btn-tonal" onClick={onPrev} disabled={!onPrev}>
            Previous
          </button>
          <button className="btn btn-filled" onClick={onNext || onClose}>
            {onNext ? 'Next role' : 'Done'}
          </button>
        </footer>
      </aside>
    </div>
  )
}
