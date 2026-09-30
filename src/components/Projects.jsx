import { useState } from 'react'
import SectionHead from './SectionHead.jsx'
import { ExternalIcon, GitHubIcon } from './Icons.jsx'
import ProjectSheet from './ProjectSheet.jsx'
import { projects, projectFilters } from '../data/content.js'
import './Projects.css'

// App-style icon for each project, picked from its first category
const s = { fill: 'none', stroke: '#fff', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }
const glyphs = {
  AI: <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM18.5 15l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z" {...s} />,
  Data: <path d="M4 20h16M7 16v-5M12 16V7M17 16v-8" {...s} />,
  Software: <path d="m9 8-4 4 4 4M15 8l4 4-4 4" {...s} />,
  Research: (
    <>
      <circle cx="12" cy="12" r="3" {...s} />
      <ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(-25 12 12)" {...s} />
    </>
  ),
}

function AppIcon({ p, size = 56 }) {
  return (
    <span className={`app-icon app-${p.color}`} style={{ width: size, height: size }} aria-hidden="true">
      <svg viewBox="0 0 24 24" width={size * 0.5} height={size * 0.5}>
        {glyphs[p.category[0]] || glyphs.Software}
      </svg>
    </span>
  )
}

function Stack({ items, max = 3 }) {
  const extra = items.length - max
  return (
    <div className="app-stack">
      {items.slice(0, max).map((t) => (
        <span key={t} className="app-chip">{t}</span>
      ))}
      {extra > 0 && <span className="app-chip more" title={items.slice(max).join(', ')}>+{extra}</span>}
    </div>
  )
}

const searchProps = (p) => ({
  'data-lucky': true,
  'data-search-title': p.name,
  'data-search': [p.name, p.description, ...p.stack, ...p.category, ...(p.keywords || [])].join(' '),
})

// Makes a whole card open the details panel, while its links still work normally
const openable = (open) => ({
  role: 'button',
  tabIndex: 0,
  onClick: (e) => {
    if (e.target.closest('a')) return
    open()
  },
  onKeyDown: (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && e.target === e.currentTarget) {
      e.preventDefault()
      open()
    }
  },
})

export default function Projects() {
  const [filter, setFilter] = useState('All')
  const [openName, setOpenName] = useState(null)
  const shown = filter === 'All' ? projects : projects.filter((p) => p.category.includes(filter))
  const [featured, ...rest] = shown
  const openIndex = shown.findIndex((p) => p.name === openName)

  return (
    <section className="section" id="projects">
      <div className="container">
        <SectionHead
          eyebrow="Projects"
          title="Things I've built"
          sub="Full-stack apps, AI, and data analysis."
        />

        <div className="filters reveal" role="tablist" aria-label="Filter projects">
          {projectFilters.map((f) => (
            <button
              key={f}
              role="tab"
              aria-selected={filter === f}
              className={`chip filter ${filter === f ? 'selected' : ''}`}
              onClick={() => setFilter(f)}
            >
              {filter === f && <span className="check">✓</span>}
              {f}
            </button>
          ))}
        </div>

        {featured && (
          <article
            className={`featured reveal feat-${featured.color}`}
            key={featured.name}
            {...searchProps(featured)}
            {...openable(() => setOpenName(featured.name))}
            aria-label={`${featured.name}, open details`}
          >
            <div className="feat-text">
              <span className="feat-badge">{filter === 'All' ? 'Featured' : `Top in ${filter}`}</span>
              <div className="feat-title">
                <AppIcon p={featured} size={64} />
                <div>
                  <h3>{featured.name}</h3>
                  <p className="app-meta">{featured.category.join(' · ')}</p>
                </div>
              </div>
              <p className="feat-desc">{featured.description}</p>
              <Stack items={featured.stack} max={6} />
              <div className="feat-actions">
                {featured.link && (
                  <a className="btn btn-filled" href={featured.link} target="_blank" rel="noreferrer">
                    View project <ExternalIcon width={16} height={16} />
                  </a>
                )}
                {featured.code && (
                  <a className="btn btn-outline" href={featured.code} target="_blank" rel="noreferrer">
                    <GitHubIcon width={16} height={16} /> Code
                  </a>
                )}
                <span className="feat-more">Details →</span>
              </div>
            </div>
            <div className="feat-art" aria-hidden="true">
              {featured.thumb ? <img src={featured.thumb} alt="" loading="lazy" /> : <AppIcon p={featured} size={140} />}
            </div>
          </article>
        )}

        <div className="app-grid">
          {rest.map((p, i) => (
            <article
              key={p.name}
              className="app reveal"
              style={{ transitionDelay: `${(i % 3) * 60}ms` }}
              {...searchProps(p)}
              {...openable(() => setOpenName(p.name))}
              aria-label={`${p.name}, open details`}
            >
              {p.thumb && (
                <div className="app-thumb">
                  <img src={p.thumb} alt="" loading="lazy" />
                </div>
              )}
              <div className="app-head">
                <AppIcon p={p} />
                <div className="app-titles">
                  <h3>{p.name}</h3>
                  <p className="app-meta">{p.category.join(' · ')}</p>
                </div>
              </div>
              <p className="app-desc">{p.description}</p>
              <div className="app-foot">
                <Stack items={p.stack} max={2} />
                <div className="app-actions">
                  {p.code && (
                    <a className="app-code" href={p.code} target="_blank" rel="noreferrer" aria-label={`${p.name} code on GitHub`} title="Code">
                      <GitHubIcon width={16} height={16} />
                    </a>
                  )}
                  {p.link && (
                    <a className="app-open" href={p.link} target="_blank" rel="noreferrer" aria-label={`View ${p.name}`}>
                      View
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <ProjectSheet
        project={openIndex >= 0 ? shown[openIndex] : null}
        position={openIndex + 1}
        total={shown.length}
        Icon={AppIcon}
        onClose={() => setOpenName(null)}
        onPrev={openIndex > 0 ? () => setOpenName(shown[openIndex - 1].name) : null}
        onNext={openIndex >= 0 && openIndex < shown.length - 1 ? () => setOpenName(shown[openIndex + 1].name) : null}
      />
    </section>
  )
}