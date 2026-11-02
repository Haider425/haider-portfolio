// CampusConnect AI, running in the browser.
// Same approach as the original Flask server: detect the kind of question,
// match it to the FAQ by meaning with all-MiniLM-L6-v2, and
// fall back to the topic's context. The model runs on-device via Transformers.js.
import data from './data.js'

const TERMS = {
  location: ['where', 'location', 'building', 'room', 'floor', 'campus', 'downtown', 'north', 'ua', 'charles',
    'shawenjigewining', 'find', 'get to', 'directions', 'address', 'situated', 'located', 'place', 'which floor', 'what room'],
  booking: ['book', 'register', 'sign up', 'schedule', 'appointment', 'deadline', 'date', 'time', 'slot', 'reservation',
    'when', 'available', 'upcoming', 'test date', 'timing', 'registration', 'sign-up', 'reserve', 'booking process'],
  accommodation: ['accommodation', 'extra time', 'extension', 'quiet', 'modify', 'change', 'update', 'renew', 'letter',
    'sas', 'accessibility', 'service', 'help', 'support', 'extended time', 'special needs', 'assistance', 'aids'],
  contact: ['contact', 'email', 'reach', 'phone', 'call', 'speak', 'talk', 'ask', 'question', 'inquire',
    'get in touch', 'connect', 'message', 'communicate'],
}
const GREETINGS = ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'greetings', 'howdy', 'hola', 'morning', 'afternoon', 'evening']
const FAREWELLS = ['bye', 'goodbye', 'thanks', 'thank you', 'appreciate', 'helped', 'understood', 'got it', 'see you', 'take care', 'have a good day']

// Whole-word matching, so "this" doesn't count as "hi"
const has = (msg, term) => new RegExp(`(^|[^a-z])${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^a-z]|$)`).test(msg)

export function detectType(text) {
  const msg = text.toLowerCase()
  if (GREETINGS.some((g) => has(msg, g))) return 'greeting'
  if (FAREWELLS.some((f) => has(msg, f))) return 'farewell'
  for (const [type, terms] of Object.entries(TERMS)) if (terms.some((t) => has(msg, t))) return type
  return 'conversation'
}

const pick = (list) => list[Math.floor(Math.random() * list.length)]
const PHRASES = data.faq.flatMap((f) => [f.question, ...f.variations].map((text) => ({ text, answer: f.answer, question: f.question })))

// ---------- The model ----------
let extractor = null
let vectors = null
let loading = null

export function loadModel(onProgress) {
  if (loading) return loading
  loading = (async () => {
    const { pipeline, env } = await import('@huggingface/transformers')
    env.allowLocalModels = false
    extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', {
      dtype: 'q8',
      progress_callback: (e) => {
        if (e.status === 'progress' && e.file?.endsWith('.onnx')) onProgress?.(Math.round(e.progress))
      },
    })
    const out = await extractor(PHRASES.map((p) => p.text), { pooling: 'mean', normalize: true })
    vectors = out.tolist()
    return true
  })().catch((err) => {
    loading = null
    throw err
  })
  return loading
}

const dot = (a, b) => a.reduce((s, v, i) => s + v * b[i], 0)

async function semanticMatch(text) {
  const [q] = (await extractor([text], { pooling: 'mean', normalize: true })).tolist()
  let best = { score: -1 }
  PHRASES.forEach((p, i) => {
    const score = dot(q, vectors[i]) // vectors are normalized, so this is cosine similarity
    if (score > best.score) best = { score, answer: p.answer, matched: p.text }
  })
  return best
}

// Without the model: overlap of meaningful words
const STOP = new Set('a an the is are do does did i my me to of for in on at and or can could how what where when who it be with test tests centre center get go there any about need want please you your'.split(' '))
const words = (t) => new Set(t.toLowerCase().match(/[a-z]+/g)?.filter((w) => !STOP.has(w) && w.length > 1) || [])
function keywordMatch(text) {
  const q = words(text)
  let best = { score: 0 }
  for (const p of PHRASES) {
    const w = words(p.text)
    const shared = [...q].filter((x) => w.has(x)).length
    const score = shared / Math.max(1, Math.min(q.size, w.size) + 0.5)
    if (score > best.score) best = { score, answer: p.answer, matched: p.text }
  }
  return best
}

const BOOKING_STEPS = "To book a test, follow these steps:\n1. Log into the Student Accessibility Services (SAS) Portal\n2. Select 'Book Assessment'\n3. Choose your course and test date\n4. Submit your booking at least 7 days in advance\n\nNeed help with any of these steps?"
const CONTACT_LINE = 'For anything I can\'t answer, email testcentre@ontariotechu.ca. They usually reply within 1 to 2 business days.'

export async function reply(text, { isFollowUp }) {
  const type = detectType(text)
  const short = text.trim().split(/\s+/).length <= 4

  if (type === 'greeting' && short) return { text: pick(data.greeting), source: 'greeting' }
  if (type === 'farewell' && short) return { text: pick(data.farewell), source: 'farewell' }
  if (isFollowUp && /\bbook/i.test(text)) return { text: BOOKING_STEPS, source: 'steps' }

  const model = Boolean(extractor && vectors)
  const best = model ? await semanticMatch(text) : keywordMatch(text)
  // 0.55 rather than the original 0.5: borderline matches go to the topic answer instead
  const threshold = model ? 0.55 : 0.6
  if (best.score >= threshold) {
    return { text: best.answer, source: model ? 'semantic' : 'keywords', score: best.score, matched: best.matched }
  }
  if (data.topics[type]) {
    return { text: `${data.topics[type]}\n\n${CONTACT_LINE}`, source: 'topic', topic: type, score: model ? best.score : undefined }
  }
  return { text: `I'm not sure about that one. ${CONTACT_LINE}`, source: 'unknown', score: model ? best.score : undefined }
}
