import { profile } from '../data/content.js'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="container">{profile.location}, Canada</div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} {profile.name} Saleem. Built with React.</span>
        <nav>
          <a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
          <a href={profile.github} target="_blank" rel="noreferrer">GitHub</a>
          <a href="#top">Back to top</a>
        </nav>
      </div>
    </footer>
  )
}
