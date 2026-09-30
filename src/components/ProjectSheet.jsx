import { useEffect, useRef, useState } from 'react'
import { CloseIcon, ArrowIcon, ExternalIcon, GitHubIcon } from './Icons.jsx'
import './ExperienceSheet.css'

// Side panel (bottom sheet on phones) that showcases one project.
// Reuses the Experience panel's styles so both feel the same.
export default function ProjectSheet({ project, position, total, onClose, onPrev, onNext, Icon }) {
  const panelRef = useRef(null)
  const [shown, setShown] = useState(project)

  // Keep the last project rendered while the closing animation plays
  useEffect(() => {
    if (project) setShown(project)
  }, [project])

  const isOpen = Boolean(project)

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

  useEffect(() => {
    if (isOpen && panelRef.current) {
      panelRef.current.scrollTop = 0
      panelRef.current.focus({ preventScroll: true })
    }
  }, [isOpen, project?.name])

  const p = shown
  if (!p) return null
  const d = p.details || {}

  return (
    <div className={`sheet-root ${isOpen ? 'open' : ''}`} aria-hidden={!isOpen}>
      <div className="sheet-scrim" onClick={onClose} />
      <aside
        className="sheet"
        role="dialog"
        aria-modal="true"
        aria-label={p.name}
        ref={panelRef}
        tabIndex={-1}
      >
        <div className="sheet-handle" aria-hidden="true" />
        <header className="sheet-top">
          <span className="sheet-count">
            {position} of {total}
          </span>
          <div className="sheet-nav">
            <button className="icon-btn" onClick={onPrev} disabled={!onPrev} aria-label="Previous project">
              <ArrowIcon style={{ transform: 'rotate(180deg)' }} />
            </button>
            <button className="icon-btn" onClick={onNext} disabled={!onNext} aria-label="Next project">
              <ArrowIcon />
            </button>
            <button className="icon-btn" onClick={onClose} aria-label="Close">
              <CloseIcon />
            </button>
          </div>
        </header>

        {p.thumb && (
          <div className="ps-cover" key={p.name + '-cover'}>
            <img src={p.thumb} alt="" />
          </div>
        )}

        <div className="sheet-hero ps-hero" key={p.name}>
          <Icon p={p} size={52} />
          <div>
            <h2 className="sheet-role">{p.name}</h2>
            <p className="sheet-org">{p.category.join(' · ')}</p>
          </div>
        </div>

        <div className="ps-actions">
          {p.link && (
            <a className="btn btn-filled" href={p.link} target="_blank" rel="noreferrer">
              {p.code ? 'Open live site' : 'View project'} <ExternalIcon width={16} height={16} />
            </a>
          )}
          {p.code && (
            <a className="btn btn-outline" href={p.code} target="_blank" rel="noreferrer">
              <GitHubIcon width={16} height={16} /> View code
            </a>
          )}
        </div>

        <div className="sheet-body" key={p.name + '-body'}>
          <p className="sheet-overview">{d.overview || p.description}</p>

          {d.role && (
            <section className="sheet-block">
              <h3>My part</h3>
              <blockquote className="sheet-quote">{d.role}</blockquote>
            </section>
          )}

          {d.features?.length > 0 && (
            <section className="sheet-block">
              <h3>What it does</h3>
              <ul className="sheet-list">
                {d.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </section>
          )}

          <section className="sheet-block">
            <h3>Built with</h3>
            <div className="sheet-tags">
              {p.stack.map((t) => (
                <span key={t} className="chip">{t}</span>
              ))}
            </div>
          </section>

          {d.facts?.length > 0 && (
            <section className="sheet-block">
              <h3>At a glance</h3>
              <dl className="sheet-facts">
                {d.facts.map(([k, v]) => (
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
            {onNext ? 'Next project' : 'Done'}
          </button>
        </footer>
      </aside>
    </div>
  )
}
