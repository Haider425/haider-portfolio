import { useEffect } from 'react'

// Stops the page behind a full-screen view from scrolling. It locks the root
// element (not just <body>), because the root clips sideways overflow, which
// stops body styles from reaching the page's own scrollbar.
let locks = 0
export function useScrollLock() {
  useEffect(() => {
    const root = document.documentElement
    if (locks++ === 0) {
      root.dataset.locked = ''
    }
    return () => {
      if (--locks === 0) delete root.dataset.locked
    }
  }, [])
}
