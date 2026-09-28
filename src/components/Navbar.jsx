import { useEffect, useState } from 'react'
import Wordmark from './Wordmark.jsx'
import { SunIcon, MoonIcon, MenuIcon, CloseIcon } from './Icons.jsx'
import { profile } from '../data/content.js'
import AccountMenu from './AccountMenu.jsx'
import './Navbar.css'

const links = [
  ['About', '#about'],
  ['Experience', '#experience'],
  ['Projects', '#projects'],
  ['Skills', '#skills'],
  ['Contact', '#contact'],
]

export default function Navbar({ theme, onToggleTheme }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Highlight the tab for the section in view
  useEffect(() => {
    const sections = links.map(([, href]) => document.querySelector(href)).filter(Boolean)
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive('#' + e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' }
    )
    sections.forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [])

  return (
    <header className={`nav ${scrolled ? 'nav-scrolled' : ''}`}>
      <div className="container nav-inner">
        <a href="#top" className="nav-logo" onClick={() => setOpen(false)}>
          {/* <Wordmark size="sm" text={profile.name} /> */}
          <img src="./logos/logo.svg" alt={profile.name} className="nav-logo-img" />
        </a>

        <nav className={`nav-links ${open ? 'open' : ''}`}>
          {links.map(([label, href]) => (
            <a
              key={href}
              href={href}
              className={active === href ? 'active' : ''}
              onClick={() => setOpen(false)}
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="nav-actions">
          <button
            className="icon-btn"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
             <AccountMenu />
          <button className="icon-btn nav-menu" onClick={() => setOpen((o) => !o)} aria-label="Menu">
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>
    </header>
  )
}
