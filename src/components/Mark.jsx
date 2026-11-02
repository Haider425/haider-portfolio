// Personal logo: an H with a small planet on an orbit around it.
export default function Mark({ size = 36, className = '' }) {
  return (
    <svg className={`mark ${className}`} width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
      <ellipse cx="20" cy="20" rx="17" ry="8.5" fill="none" stroke="var(--hue-violet)" strokeWidth="1.6" transform="rotate(-24 20 20)" opacity=".9" />
      <path d="M14 11v18M26 11v18M14 20h12" stroke="var(--text)" strokeWidth="3.4" strokeLinecap="round" fill="none" />
      <circle cx="33.6" cy="13.4" r="3" fill="var(--hue-amber)" />
    </svg>
  )
}

// Four-point star used beside section labels
export function Star(props) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" {...props}>
      <path d="M8 0c.6 4.2 3.8 7.4 8 8-4.2.6-7.4 3.8-8 8-.6-4.2-3.8-7.4-8-8 4.2-.6 7.4-3.8 8-8Z" fill="currentColor" />
    </svg>
  )
}
