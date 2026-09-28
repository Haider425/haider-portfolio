import { useState } from 'react'
import SectionHead from './SectionHead.jsx'
import { ExternalIcon } from './Icons.jsx'
import { projects, projectFilters } from '../data/content.js'
import './Projects.css'

export default function Projects() {
  const [filter, setFilter] = useState('All')
  const shown = filter === 'All' ? projects : projects.filter((p) => p.category.includes(filter))

  return (
    <section className="section" id="projects">
      <div className="container">
        <SectionHead
          eyebrow="Projects"
          title="Things I've built"
          sub="A mix of data work, AI experiments, full-stack apps, and research."
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

        <div className="project-grid">
          {shown.map((p, i) => (
            <article
              key={p.name}
              className={`project reveal project-${p.color}`}
              style={{ transitionDelay: `${(i % 3) * 70}ms` }}
              data-lucky
              data-search-title={p.name}
              data-search={[p.name, p.description, ...p.stack, ...p.category, ...(p.keywords || [])].join(' ')}
            >
              <div className="project-art" aria-hidden="true">
                <span className="art-num">{String(projects.indexOf(p) + 1).padStart(2, '0')}</span>
                <span className="art-shape a" />
                <span className="art-shape b" />
              </div>
              <div className="project-body">
                <div className="project-cats">
                  {p.category.map((c) => (
                    <span key={c}>{c}</span>
                  ))}
                </div>
                <h3>{p.name}</h3>
                <p>{p.description}</p>
                <div className="project-stack">
                  {p.stack.map((s) => (
                    <span key={s} className={`chip tint-${p.color}`}>{s}</span>
                  ))}
                </div>
                <a className="project-link" href={p.link} target="_blank" rel="noreferrer">
                  View project <ExternalIcon width={16} height={16} />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}