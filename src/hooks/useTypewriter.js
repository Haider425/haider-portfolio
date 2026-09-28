import { useEffect, useState } from 'react'

// Types and deletes each phrase in turn, like someone searching.
export function useTypewriter(phrases, { typeMs = 70, deleteMs = 35, holdMs = 1800 } = {}) {
  const [text, setText] = useState('')
  const [index, setIndex] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setText(phrases[0])
      return
    }
    const full = phrases[index % phrases.length]
    let t
    if (!deleting && text === full) {
      t = setTimeout(() => setDeleting(true), holdMs)
    } else if (deleting && text === '') {
      setDeleting(false)
      setIndex((i) => i + 1)
    } else {
      t = setTimeout(
        () => setText(deleting ? full.slice(0, text.length - 1) : full.slice(0, text.length + 1)),
        deleting ? deleteMs : typeMs
      )
    }
    return () => clearTimeout(t)
  }, [text, deleting, index, phrases, typeMs, deleteMs, holdMs])

  return text
}
