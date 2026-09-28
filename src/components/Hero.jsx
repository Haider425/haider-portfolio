import { useRef, useState } from 'react'
import Wordmark from './Wordmark.jsx'
import { SearchIcon, ArrowIcon, PinIcon } from './Icons.jsx'
import { profile, searchQueries, quickFacts } from '../data/content.js'
import { useTypewriter } from '../hooks/useTypewriter.js'
import { searchResults, flashElement, feelingLucky } from '../utils/siteSearch.js'
import './Hero.css'

const SUGGESTIONS = ['power bi', 'angular', 'python', 'llm', 'sql']

export default function Hero() {
  const typed = useTypewriter(searchQueries)
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const [status, setStatus] = useState(null) // { kind: 'hit' | 'miss', text }
  const last = useRef({ q: '', results: [], index: 0 })
  const hideTimer = useRef(null)

  const show = (s, ms = 4000) => {
    clearTimeout(hideTimer.current)
    setStatus(s)
    hideTimer.current = setTimeout(() => setStatus(null), ms)
  }

  const run = (q) => {
    const key = q.trim().toLowerCase()
    if (!key) return

    // Same search again: go to the next result
    if (key === last.current.q && last.current.results.length > 1) {
      last.current.index = (last.current.index + 1) % last.current.results.length
    } else {
      last.current = { q: key, results: searchResults(key), index: 0 }
    }

    const { results, index } = last.current
    if (!results.length) {
      show({ kind: 'miss', text: 'No results on this page.' }, 5000)
      return
    }
    flashElement(results[index])
    show({
      kind: 'hit',
      text:
        results.length === 1
          ? '1 result'
          : `Result ${index + 1} of ${results.length}. Press Enter for the next one.`,
    })
  }

  const onSubmit = (e) => {
    e.preventDefault()
    if (query.trim()) return run(query)
    // Empty box: search the phrase that's being typed out
    const phrase = searchQueries.find((q) => typed && q.startsWith(typed)) || searchQueries[0]
    setQuery(phrase)
    run(phrase)
  }

  const onChange = (e) => {
    setQuery(e.target.value)
    last.current = { q: '', results: [], index: 0 }
  }

  const pick = (s) => {
    setQuery(s)
    run(s)
  }

  const showTyped = !focused && query === ''

  return (
    <section className="hero" id="top">
      <div className="hero-shapes" aria-hidden="true">
        <span className="shape s1" />
        <span className="shape s2" />
        <span className="shape s3" />
        <span className="shape s4" />
      </div>

      <div className="container hero-inner">
        <Wordmark size="xl" text={profile.name} />
        <p className="hero-title">{profile.title}</p>

        <form className={`searchbox ${focused ? 'focused' : ''}`} onSubmit={onSubmit} role="search">
          <SearchIcon className="searchbox-icon" />
          <input
            value={query}
            onChange={onChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            aria-label="Search this portfolio"
            placeholder={focused ? 'Try a skill, tool, company, or project' : ''}
            enterKeyHint="search"
          />
          {showTyped && (
            <span className="searchbox-typed" aria-hidden="true">
              {typed}
              <span className="caret" />
            </span>
          )}
          <button type="submit" className="searchbox-go" aria-label="Search">
            <ArrowIcon />
          </button>
        </form>

        <div className={`search-status ${status ? 'show' : ''} ${status?.kind || ''}`} role="status">
          {status?.text}
          {status?.kind === 'miss' && (
            <span className="search-try">
              Try
              {SUGGESTIONS.map((s) => (
                <button key={s} type="button" onClick={() => pick(s)}>
                  {s}
                </button>
              ))}
            </span>
          )}
        </div>

        <div className="hero-actions">
          <a href="#projects" className="btn btn-tonal">View my work</a>
          <button type="button" className="btn btn-tonal" onClick={feelingLucky}>
            I'm Feeling Lucky
          </button>
        </div>

        <ul className="hero-facts">
          {quickFacts.map((f) => (
            <li key={f.label}>
              <strong>{f.label}</strong>
              <span>{f.sub}</span>
            </li>
          ))}
        </ul>

        <p className="hero-loc">
          <PinIcon width={16} height={16} /> {profile.location}
        </p>
      </div>
    </section>
  )
}