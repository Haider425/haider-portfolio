import { useEffect, useState } from 'react'
import { profile } from '../data/content.js'
import Mark from './Mark.jsx'
import './Footer.css'

// OTU webring (otu-ring.com): prev/next links need this site's hostname
function useRingLinks() {
  const [links, setLinks] = useState({ prev: 'https://otu-ring.com', next: 'https://otu-ring.com' })
  useEffect(() => {
    const host = window.location.hostname.replace(/^www\./, '')
    if (!host || host === 'localhost' || !host.includes('.')) return
    const from = encodeURIComponent(host)
    setLinks({
      prev: `https://otu-ring.com/prev.html?from=${from}`,
      next: `https://otu-ring.com/next.html?from=${from}`,
    })
  }, [])
  return links
}

export default function Footer() {
  const ring = useRingLinks()
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <Mark size={30} />
          <span>© {new Date().getFullYear()} {profile.fullName}. {profile.location}.</span>
        </div>
        <nav className="footer-links" aria-label="Elsewhere">
          <a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
          <a href={profile.github} target="_blank" rel="noreferrer">GitHub</a>
          <a href="#top">Back to top</a>
        </nav>
        <div className="webring" aria-label="OTU webring">
          <a href={ring.prev} title="Previous site in the OTU webring" aria-label="Previous site in the OTU webring">←</a>
          <a href="https://otu-ring.com" target="_blank" rel="noreferrer" className="webring-name">OTU webring</a>
          <a href={ring.next} title="Next site in the OTU webring" aria-label="Next site in the OTU webring">→</a>
        </div>
      </div>
    </footer>
  )
}
