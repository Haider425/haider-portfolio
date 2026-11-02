import { useCallback, useState } from 'react'
import { GitHubIcon, ExternalIcon, ArrowIcon } from './Icons.jsx'
import Mission from './Mission.jsx'
import ProjectWindow from './ProjectWindow.jsx'
import { morph, unmorph } from './vt.js'
import { experience, projects } from '../data/content.js'
import './Lists.css'

const roles = experience.filter((e) => e.type !== 'Project')
const firstSentence = (s) => (s.match(/^.*?[.!?](\s|$)/) || [s])[0].trim()
const isLive = (p) => Boolean(p.demo) || (p.link && !/github\.com/.test(p.link))
const searchable = (title, ...parts) => ({
  'data-search-title': title,
  'data-search': parts.flat().filter(Boolean).join(' '),
})

export function WorkList() {
  const [open, setOpen] = useState(null) // index into roles
  const show = (i) => morph(`role-${i}`, () => setOpen(i))
  const close = useCallback(() => {
    const i = open
    unmorph(`role-${i}`, () => setOpen(null))
  }, [open])
  const step = useCallback((d) => setOpen((i) => (i + d + roles.length) % roles.length), [])
  const jumpRole = useCallback((i) => setOpen(i), [])

  return (
    <>
      <ul className="list">
        {roles.map((j, i) => (
          <li key={j.id} className="row lrow" {...searchable(`${j.role} ${j.org}`, j.org, j.role, j.snippet, j.tags, j.keywords || [])}>
            <button className="lbtn" onClick={() => show(i)} aria-haspopup="dialog">
              <span className="mark-img" data-vt={`role-${i}`}>{j.logo ? <img src={j.logo} alt="" /> : j.org[0]}</span>
              <span className="row-main">
                <span className="row-title">
                  {j.role} <span className="at">at</span> {j.org}
                  {j.current && <span className="now">Now</span>}
                </span>
                <span className="row-desc">{j.snippet}</span>
              </span>
              <span className="row-date">{j.period}</span>
              <span className="lgo" aria-hidden="true">Open mission <ArrowIcon /></span>
            </button>
          </li>
        ))}
      </ul>
      {open != null && <Mission job={roles[open]} index={open} total={roles.length} jobs={roles} onClose={close} onStep={step} onJump={jumpRole} />}
    </>
  )
}

export function ProjectList() {
  const [open, setOpen] = useState(null)
  const [min, setMin] = useState(null) // a minimized project waits in the dock
  const show = (i) => morph(`proj-${i}`, () => { setOpen(i); setMin(null) })
  const close = useCallback(() => {
    const i = open
    unmorph(`proj-${i}`, () => setOpen(null))
  }, [open])
  const minimize = useCallback(() => {
    const i = open
    unmorph('dock', () => { setOpen(null); setMin(i) })
  }, [open])
  const restore = () => morph('dock', () => { setOpen(min); setMin(null) })
  const step = useCallback((d) => setOpen((i) => (i + d + projects.length) % projects.length), [])
  const jump = useCallback((i) => setOpen(i), [])

  return (
    <>
      <ul className="list">
        {projects.map((p, i) => (
          <li key={p.name} className="row lrow" data-lucky {...searchable(p.name, p.name, p.description, p.stack, p.category, p.keywords || [])}>
            <button className="lbtn" onClick={() => show(i)} aria-haspopup="dialog">
              <span className="mark-img thumb" data-vt={`proj-${i}`}>{p.thumb && <img src={p.thumb} alt="" />}</span>
              <span className="row-main">
                <span className="row-title">
                  {p.name}
                  {isLive(p) && <span className="live-tag">Try it live</span>}
                </span>
                <span className="row-desc">{firstSentence(p.description)}</span>
              </span>
              <span className="lgo" aria-hidden="true">{isLive(p) ? 'Launch' : 'Open'} <ArrowIcon /></span>
            </button>
            <span className="row-links">
              {p.code && <a href={p.code} target="_blank" rel="noreferrer" aria-label={`${p.name} code on GitHub`}><GitHubIcon /></a>}
              {p.link && <a href={p.link} target="_blank" rel="noreferrer" aria-label={`Open ${p.name} in a new tab`}><ExternalIcon /></a>}
            </span>
          </li>
        ))}
      </ul>
      {min != null && (
        <div className="dock" role="region" aria-label="Minimized project">
          <button className="dock-app" data-vt="dock" onClick={restore} title={`Restore ${projects[min].name}`}>
            {projects[min].thumb && <img src={projects[min].thumb} alt="" />}
            <span>{projects[min].name}</span>
          </button>
          <button className="dock-x" onClick={() => setMin(null)} aria-label={`Close ${projects[min].name}`}>×</button>
        </div>
      )}
      {open != null && <ProjectWindow project={projects[open]} index={open} total={projects.length} onClose={close} onMinimize={minimize} onStep={step} onJump={jump} />}
    </>
  )
}
