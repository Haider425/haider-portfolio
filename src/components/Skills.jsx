import SectionHead from './SectionHead.jsx'
import { skills } from '../data/content.js'
import './Skills.css'

export default function Skills() {
  return (
    <section className="section section-alt" id="skills">
      <div className="container">
        <SectionHead eyebrow="Skills" title="What I work with" />
        <div className="skill-grid">
          {skills.map((g, i) => (
            <div
              key={g.group}
              className={`skill-card reveal skill-${g.color}`}
              style={{ transitionDelay: `${i * 80}ms` }}
              data-search-title={g.group}
              data-search={[g.group, ...g.items, ...(g.keywords || [])].join(' ')}
            >
              <div className="skill-head">
                <span className="skill-dot" />
                <h3>{g.group}</h3>
                <span className="skill-count">{g.items.length}</span>
              </div>
              <div className="skill-items">
                {g.items.map((s) => (
                  <span key={s} className="chip">{s}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}