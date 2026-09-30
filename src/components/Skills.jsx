import SectionHead from './SectionHead.jsx'
import { skills, coreSkills } from '../data/content.js'
import './Skills.css'

// Logo file in public/skills/ for each core skill
const ICONS = {
  Python: 'python.svg', SQL: 'sql.svg', 'Power BI': 'power-bi.svg', Angular: 'angular.svg',
  'ASP.NET': 'dotnet.svg', React: 'react.svg', 'Node.js': 'nodejs.svg', 'Azure DevOps': 'azure-devops.svg',
  JavaScript: 'javascript.svg', TypeScript: 'typescript.svg', Java: 'java.svg', R: 'r.svg',
  Excel: 'excel.svg', Git: 'git.svg', Docker: 'docker.svg', PostgreSQL: 'postgresql.svg',
}

export default function Skills() {
  const core = new Set(coreSkills)

  return (
    <section className="section section-alt" id="skills">
      <div className="container">
        <SectionHead eyebrow="Skills" title="What I work with" />

        <div
          className="core reveal"
          data-search-title="Core skills"
          data-search={coreSkills.join(' ')}
        >
          <p className="core-label">Core stack</p>
          <div className="core-row">
            {coreSkills.map((s) => (
              <div key={s} className="core-item">
                {ICONS[s] && <img src={`./skills/${ICONS[s]}`} alt="" loading="lazy" />}
                <span>{s}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="more-skills">
          {skills.map((g, i) => {
            const rest = g.items.filter((s) => !core.has(s))
            if (!rest.length) return null
            return (
              <div
                key={g.group}
                className={`more-col reveal skill-${g.color}`}
                style={{ transitionDelay: `${i * 60}ms` }}
                data-search-title={g.group}
                data-search={[g.group, ...g.items, ...(g.keywords || [])].join(' ')}
              >
                <h3>
                  <span className="skill-dot" />
                  {g.group}
                </h3>
                <ul>
                  {rest.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}