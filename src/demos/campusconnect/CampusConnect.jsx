import { useEffect, useRef, useState } from 'react'
import { loadModel, reply } from './engine.js'
import './CampusConnect.css'

const SUGGESTIONS = [
  'Where is the Test Centre?',
  'How do I book a test?',
  'When is the finals deadline?',
  'Do I need to renew my accommodations?',
]

const LABEL = {
  semantic: (r) => `FAQ match, ${r.score.toFixed(2)} similarity`,
  keywords: () => 'FAQ match by keywords',
  topic: (r) => (r.score != null ? `No close FAQ (best ${r.score.toFixed(2)}), answered from ${r.topic} info` : `Answered from ${r.topic} info`),
  unknown: (r) => (r.score != null ? `No close match (best ${r.score.toFixed(2)})` : 'No close match'),
  steps: () => 'Booking follow-up',
}

export default function CampusConnect() {
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [busy, setBusy] = useState(false)
  const [model, setModel] = useState({ state: 'loading', pct: 0 })
  const listRef = useRef(null)

  useEffect(() => {
    loadModel((pct) => setModel({ state: 'loading', pct }))
      .then(() => setModel({ state: 'ready' }))
      .catch(() => setModel({ state: 'failed' }))
  }, [])

  useEffect(() => {
    const el = listRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, busy])

  const send = async (q) => {
    const question = q.trim()
    if (!question || busy) return
    setText('')
    const isFollowUp = messages.some((m) => m.role === 'user')
    setMessages((m) => [...m, { role: 'user', text: question }])
    setBusy(true)
    const started = performance.now()
    const r = await reply(question, { isFollowUp })
    // A short pause so the reply doesn't feel instant and robotic
    const wait = Math.max(0, 350 - (performance.now() - started))
    setTimeout(() => {
      setMessages((m) => [...m, { role: 'bot', ...r }])
      setBusy(false)
    }, wait)
  }

  const status =
    model.state === 'ready' ? 'MiniLM running in your browser'
      : model.state === 'failed' ? 'Keyword mode, the language model could not load here'
        : model.pct >= 100 ? 'Preparing the FAQ answers'
          : `Loading the language model${model.pct ? `, ${model.pct}%` : ''}`

  return (
    <div className="cc">
      <header className="cc-head">
        <span className="cc-avatar" aria-hidden="true">TC</span>
        <div>
          <p className="cc-name">Test Centre Assistant</p>
          <p className={`cc-status cc-${model.state}`}><i aria-hidden="true" />{status}</p>
        </div>
      </header>

      <div className="cc-list" ref={listRef} aria-live="polite">
        {messages.length === 0 && (
          <div className="cc-empty">
            <p>Ask about the Ontario Tech Test Centre: where it is, booking tests, deadlines or accommodations.</p>
            <div className="cc-suggest">
              {SUGGESTIONS.map((s) => <button key={s} onClick={() => send(s)}>{s}</button>)}
            </div>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`cc-msg cc-${m.role}`}>
            <p>{m.text}</p>
            {m.role === 'bot' && LABEL[m.source] && <span className="cc-meta">{LABEL[m.source](m)}</span>}
          </div>
        ))}
        {busy && <div className="cc-msg cc-bot cc-typing" aria-label="Typing"><span /><span /><span /></div>}
      </div>

      <form className="cc-input" onSubmit={(e) => { e.preventDefault(); send(text) }}>
        <input
          id="cc-question"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Ask a question"
          aria-label="Ask the Test Centre Assistant a question"
          autoComplete="off"
        />
        <button type="submit" disabled={!text.trim() || busy}>Send</button>
      </form>
      <p className="cc-note">A 2024 class project. Dates and policies may have changed, so confirm with the Test Centre.</p>
    </div>
  )
}
