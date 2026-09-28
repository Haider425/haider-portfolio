import SectionHead from './SectionHead.jsx'
import Wordmark from './Wordmark.jsx'
import { about, aboutKeywords, knowledgePanel, profile } from '../data/content.js'
import './About.css'

export default function About() {
  return (
    <section className="section" id="about">
      <div className="container">
        <SectionHead eyebrow="About" title="A bit about me" />
        <div className="about-grid">
          <div
            className="about-body reveal"
            data-search-title="About"
            data-search={[...about, ...aboutKeywords, ...knowledgePanel.facts.flat()].join(' ')}
          >
            {about.map((p, i) => (
              <p key={i}>{p}</p>
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