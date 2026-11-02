import { flushSync } from 'react-dom'

// Morph between two elements with the View Transitions API.
// The element marked data-vt="<key>" on the way in shares a name with the
// target, so the browser animates one into the other. Browsers without the
// API (or visitors who prefer less motion) just switch instantly.
export function morph(key, update) {
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  if (!document.startViewTransition || reduced) {
    update()
    return
  }
  const source = document.querySelector(`[data-vt="${key}"]`)
  if (source) source.style.viewTransitionName = 'vt-hero'
  document.startViewTransition(() => {
    if (source) source.style.viewTransitionName = ''
    flushSync(update)
  })
}

// The reverse: the open view's hero shrinks back into its row
export function unmorph(key, update) {
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  if (!document.startViewTransition || reduced) {
    update()
    return
  }
  document.startViewTransition(() => {
    flushSync(update)
    const source = document.querySelector(`[data-vt="${key}"]`)
    if (source) source.style.viewTransitionName = 'vt-hero'
  }).finished.finally(() => {
    const source = document.querySelector(`[data-vt="${key}"]`)
    if (source) source.style.viewTransitionName = ''
  })
}
