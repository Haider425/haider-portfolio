import SectionHead from './SectionHead.jsx'
import Wordmark from './Wordmark.jsx'
import { about, aboutNotes, aboutKeywords, knowledgePanel, profile } from '../data/content.js'
import './About.css'

export default function About() {
  return (
    <section className="section" id="about">
      <div className="container">
        <SectionHead eyebrow="About" title="A bit about me" />
        <div className="about-grid">
          <div
            className="notes reveal"
            data-search-title="About"
            data-search={[...about, ...aboutKeywords, ...knowledgePanel.facts.flat()].join(' ')}
          >
            {aboutNotes.map((n, i) => (
              <div
                key={n.title}
                className={`sticky sticky-${n.color}`}
                style={{ '--tilt': `${[-2.5, 1.8, -1.2, 2.4, -1.8, 1.2][i % 6]}deg` }}
              >
                <span className="tape" aria-hidden="true" />
                <h4>{n.title}</h4>
                <p>{n.text}</p>
              </div>
            ))}
          </div>

          <aside className="kp reveal" aria-label="Quick profile">
            <div className="kp-banner">
              <Wordmark size="sm" text={profile.name} />
            </div>
            <div className="kp-body">
              <h3 className="kp-name">{profile.name} Saleem</h3>
              <p className="kp-sub">{knowledgePanel.subtitle}</p>
              <p className="kp-summary">{knowledgePanel.summary}</p>
              <dl className="kp-facts">
                {knowledgePanel.facts.map(([k, v]) => (
                  <div key={k}>
                    <dt>{k}:</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}