// Site search for the hero search bar.
//
// Every searchable element on the page has:
//   data-search        all the text and keywords for that item
//   data-search-title  its name (matches here count for more)
//
// Search understands partial words ("dash" finds "dashboard"), plurals
// ("dashboards"), and common short forms ("bi", "js", "ml", ".net").
// Results are ranked, and searchResults() returns them best first.

const STOP_WORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'of', 'in', 'on', 'for', 'to', 'with', 'at', 'by', 'from',
  'who', 'that', 'is', 'are', 'was', 'i', 'me', 'my', 'your', 'you', 'he', 'his', 'haider',
  'show', 'find', 'any', 'has', 'have', 'do', 'does', 'can', 'using', 'use', 'used', 'about',
  'some', 'did', 'what', 'where', 'which', 'people', 'actually', 'something',
])

// Query word -> extra terms to look for
const SYNONYMS = {
  bi: ['power bi', 'business intelligence'],
  powerbi: ['power bi'],
  pbi: ['power bi'],
  js: ['javascript'],
  ts: ['typescript'],
  py: ['python'],
  ml: ['machine learning', 'scikit-learn'],
  ai: ['llm', 'machine learning'],
  genai: ['generative ai', 'llm'],
  llm: ['ollama', 'gemini', 'mistral'],
  llms: ['llm', 'ollama', 'gemini'],
  gpt: ['llm', 'generative ai'],
  nlp: ['natural language processing'],
  db: ['database', 'sql'],
  database: ['sql', 'postgresql', 'mysql', 'mongodb', 'sqlite'],
  sql: ['postgresql', 'mysql', 'sqlite'],
  postgres: ['postgresql'],
  mongo: ['mongodb'],
  net: ['.net', 'asp.net'],
  dotnet: ['.net', 'asp.net'],
  'c#': ['asp.net', '.net'],
  csharp: ['asp.net', '.net'],
  aspnet: ['asp.net'],
  node: ['node.js'],
  nodejs: ['node.js'],
  reactjs: ['react'],
  angularjs: ['angular'],
  viz: ['data visualization', 'ggplot2'],
  dataviz: ['data visualization', 'ggplot2'],
  visualisation: ['data visualization'],
  charts: ['data visualization', 'ggplot2'],
  qa: ['quality assurance', 'testing'],
  test: ['testing', 'qa'],
  tests: ['testing', 'qa'],
  bot: ['chatbot'],
  robot: ['robotics', 'turtlebot'],
  robots: ['robotics', 'turtlebot'],
  spreadsheet: ['excel'],
  spreadsheets: ['excel'],
  gov: ['government', 'public sector'],
  cloud: ['gcp', 'azure'],
  gcp: ['google cloud'],
  web: ['web app', 'website', 'angular', 'react'],
  frontend: ['angular', 'react'],
  backend: ['node.js', 'flask', 'asp.net'],
  fullstack: ['full stack'],
  cicd: ['ci/cd'],
  automate: ['automation', 'power automate'],
  automated: ['automation'],
  analyst: ['data analyst', 'analytics'],
  analysis: ['analytics', 'data analysis'],
  opg: ['ontario power generation'],
  ops: ['ontario public service'],
}

const norm = (s) =>
  s
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9+#./\s-]/g, ' ')
    .replace(/(\w)[./-](?=\s|$)/g, '$1') // drop trailing punctuation like "apps."
    .replace(/\s+/g, ' ')
    .trim()

// "dashboards" -> "dashboard", "queries" -> "query"
const stem = (w) => {
  if (w.length > 4 && w.endsWith('ies')) return w.slice(0, -3) + 'y'
  if (w.length > 3 && w.endsWith('s') && !w.endsWith('ss')) return w.slice(0, -1)
  return w
}

const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const wordRe = (t) => new RegExp(`(^|[\\s/(])${escape(t)}($|[\\s/),])`)
const prefixRe = (t) => new RegExp(`(^|[\\s/(])${escape(t)}`)

function queryTerms(raw) {
  const words = norm(raw).split(' ').filter((w) => w && !STOP_WORDS.has(w))
  return words
    .filter((w) => w.length > 1 || w === 'r' || w === 'c')
    .map((w) => {
      const base = stem(w)
      const alts = new Set([w, base, ...(SYNONYMS[w] || []), ...(SYNONYMS[base] || [])])
      return [...alts]
    })
}

function scoreTerm(alts, title, hay) {
  let best = 0
  for (const t of alts) {
    if (wordRe(t).test(title)) best = Math.max(best, 6)
    else if (wordRe(t).test(hay)) best = Math.max(best, 4)
    else if (t.length >= 2 && prefixRe(t).test(title)) best = Math.max(best, 3)
    else if (t.length >= 2 && prefixRe(t).test(hay)) best = Math.max(best, 2)
    else if (t.length >= 4 && hay.includes(t)) best = Math.max(best, 1)
  }
  return best
}

// Returns matching elements, best match first
export function searchResults(raw) {
  const terms = queryTerms(raw)
  if (!terms.length) return []
  const phrase = norm(raw)

  return [...document.querySelectorAll('[data-search]')]
    .map((el) => {
      const title = norm(el.dataset.searchTitle || '')
      const hay = `${title} ${norm(el.dataset.search)}`
      const scores = terms.map((alts) => scoreTerm(alts, title, hay))
      const matched = scores.filter((s) => s > 0).length
      if (!matched) return null
      let score = scores.reduce((a, b) => a + b, 0)
      score += (matched / terms.length) * 6 // prefer items that match every word
      if (phrase.length > 3 && hay.includes(phrase)) score += 8
      if (phrase.length > 3 && title.includes(phrase)) score += 6
      return { el, score }
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score)
    .map((r) => r.el)
}

// Kept for anything that still calls the old API
export function siteSearch(raw) {
  const results = searchResults(raw)
  if (results.length) flashElement(results[0])
  return results.length > 0
}

export function feelingLucky() {
  const cards = [...document.querySelectorAll('[data-lucky]')]
  if (!cards.length) return
  flashElement(cards[Math.floor(Math.random() * cards.length)])
}

export function flashElement(el) {
  el.classList.add('in')
  el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  // Restart the highlight, cancelling any earlier timer on this element
  clearTimeout(el._flashTimer)
  el.classList.remove('flash')
  void el.offsetWidth
  el.classList.add('flash')
  el._flashTimer = setTimeout(() => el.classList.remove('flash'), 2400)
}