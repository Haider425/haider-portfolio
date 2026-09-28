import { useEffect, useState } from 'react'
import SectionHead from './SectionHead.jsx'
import ExperienceSheet from './ExperienceSheet.jsx'
import { ArrowIcon } from './Icons.jsx'
import Logo from './Logo.jsx'
import { experience } from '../data/content.js'
import './Experience.css'

export const dotColors = ['var(--g-blue)', 'var(--g-red)', 'var(--g-yellow)', 'var(--g-green)']
const tabs = ['All', 'Co-op', 'Research', 'Project', 'Job']
const tabLabel = { All: 'All', 'Co-op': 'Co-ops', Research: 'Research', Project: 'Projects', Job: 'Jobs' }

// Reads "#experience/<id>" from the URL so each role has a shareable link
const idFromHash = () => {
  const m = window.location.hash.match(/^#experience\/(.+)$/)
  return m ? m[1] : null
}

export default function Experience() {
  const [tab, setTab] = useState('All')
  const [openId, setOpenId] = useState(idFromHash)

  useEffect(() => {
    const sync = () => setOpenId(idFromHash())
    window.addEventListener('popstate', sync)
    window.addEventListener('hashchange', sync)
    return () => {
      window.removeEventListener('popstate', sync)
      window.removeEventListener('hashchange', sync)
    }
  }, [])

  const open = (id) => {
    history.pushState(null, '', `#experience/${id}`)
    setOpenId(id)
  }
  const close = () => {
    history.pushState(null, '', '#experience')
    setOpenId(null)
  }

  const shown = tab === 'All' ? experience : experience.filter((e) => e.type === tab)
  const index = experience.findIndex((e) => e.id === openId)

  return (
    <section className="section section-alt" id="experience">
      <div className="container">
        <SectionHead
          eyebrow="Experience"
          title="Where I've worked"
          sub={`About ${shown.length} results. Click any result for the full story.`}
        />

        <div className="exp-tabs reveal" role="tablist" aria-label="Filter experience">
          {tabs.map((t) => {
            const count = t === 'All' ? experience.length : experience.filter((e) => e.type === t).length
            if (!count) return null
            return (
              <button
                key={t}
                role="tab"
                aria-selected={tab === t}
                className={`exp-tab ${tab === t ? 'active' : ''}`}
                onClick={() => setTab(t)}
              >
                {tabLabel[t]}
              </button>
            )
          })}
        </div>

        <div className="exp-layout">
        <ol className="results">
          {shown.map((job, i) => {
            const color = dotColors[experience.indexOf(job) % 4]
            return (
              <li
                key={job.id}
                className="result reveal"
                style={{ transitionDelay: `${i * 50}ms` }}
                data-search-title={`${job.role} ${job.org}`}
                data-search={[
                  job.org, job.role, job.snippet, job.overview, job.location, job.period,
                  ...job.tags, ...(job.highlights || []), ...(job.keywords || []),
                ].filter(Boolean).join(' ')}
              >
                <button className="result-hit" onClick={() => open(job.id)} aria-haspopup="dialog">
                  <div className="result-src">
                    <Logo job={job} color={color} className="favicon" />
                    <div>
                      <div className="result-org">{job.org}</div>
                      <div className="result-url">{job.url}</div>
                    </div>
                  </div>
                  <h3 className="result-title">
                    {job.role}
                    {job.current && <span className="badge">Current</span>}
                  </h3>
                  <p className="result-snippet">
                    {job.period && <span className="result-date">{job.period} · </span>}
                    {job.snippet}
                  </p>
                  <div className="result-foot">
                    <div className="result-tags">
                      {job.tags.slice(0, 3).map((t) => (
                        <span key={t} className="chip">{t}</span>
                      ))}
                    </div>
                    <span className="result-more">
                      Read more <ArrowIcon width={16} height={16} />
                    </span>
                  </div>
                </button>
              </li>
            )
          })}
        </ol>

        <aside className="exp-summary reveal" aria-label="Career summary">
          <p className="exp-sum-label">Right now</p>
          {experience.filter((e) => e.current).map((e) => (
            <button key={e.id} className="exp-now" onClick={() => open(e.id)}>
              <span className="live-dot" />
              <span>
                <strong>{e.role}</strong>
                <small>{e.org}</small>
              </span>
            </button>
          ))}
          <div className="exp-stats">
            {[
              ['Co-op', 'Co-ops', 'var(--g-blue)'],
              ['Project', 'Client projects', 'var(--g-red)'],
              ['Research', 'Research', 'var(--g-green)'],
              ['Job', 'Campus job', 'var(--g-yellow)'],
            ].map(([type, label, c]) => {
              const n = experience.filter((e) => e.type === type).length
              return (
                <button key={type} className="exp-stat" onClick={() => setTab(type)} style={{ '--c': c }}>
                  <span className="exp-stat-n">{n}</span>
                  <span className="exp-stat-l">{label}</span>
                </button>
              )
            })}
          </div>
          <p className="exp-sum-label">Tools across roles</p>
          <div className="exp-top-tags">
            {Object.entries(
              experience.flatMap((e) => e.tags).filter((t) => !['Co-op', 'IT', 'Development'].includes(t)).reduce((m, t) => ((m[t] = (m[t] || 0) + 1), m), {})
            )
              .sort((a, b) => b[1] - a[1])
              .slice(0, 8)
              .map(([t]) => (
                <span key={t} className="chip">{t}</span>
              ))}
          </div>
        </aside>
        </div>
      </div>

      <ExperienceSheet
        job={index >= 0 ? experience[index] : null}
        color={dotColors[index % 4]}
        position={index + 1}
        total={experience.length}
        onClose={close}
        onPrev={index > 0 ? () => open(experience[index - 1].id) : null}
        onNext={index < experience.length - 1 ? () => open(experience[index + 1].id) : null}
      />
    </section>
  )
}
