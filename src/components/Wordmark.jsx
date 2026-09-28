import './Wordmark.css'

// Google-style multicolor wordmark
const palette = ['var(--g-blue)', 'var(--g-red)', 'var(--g-yellow)', 'var(--g-blue)', 'var(--g-green)', 'var(--g-red)']

export default function Wordmark({ text = 'Haider', size = 'md' }) {
  return (
    <span className={`wordmark wordmark-${size}`} aria-label={text}>
      {text.split('').map((ch, i) => (
        <span key={i} style={{ color: palette[i % palette.length], '--i': i }} aria-hidden="true">
          {ch}
        </span>
      ))}
    </span>
  )
}
