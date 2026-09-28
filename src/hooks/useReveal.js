import { useEffect } from 'react'

// Adds `.in` to every `.reveal` element as it scrolls into view.
export function useReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in')
            observer.unobserve(e.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )

    const observe = () =>
      document.querySelectorAll('.reveal:not(.in)').forEach((el) => observer.observe(el))
    observe()

    // Catch elements added later (e.g. after filtering projects)
    const mo = new MutationObserver(observe)
    mo.observe(document.body, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
      mo.disconnect()
    }
  }, [])
}
