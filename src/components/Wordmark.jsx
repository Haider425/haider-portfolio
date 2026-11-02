import './Wordmark.css'

export default function Wordmark({ text = 'Haider', size = 'md' }) {
  return <span className={`wordmark wordmark-${size}`}>{text}</span>
}
