import { useEffect, useRef, useState } from 'react'
import { profile, accountLinks } from '../data/content.js'
import { CloseIcon, GitHubIcon, LinkedInIcon, MailIcon, ExternalIcon } from './Icons.jsx'
import './AccountMenu.css'

const s = { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }
const icons = {
  linkedin: <LinkedInIcon />,
  github: <GitHubIcon />,
  mail: <MailIcon />,
  resume: (
    <svg width="20" height="20" viewBox="0 0 24 24"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" {...s} /><path d="M14 3v5h5M9 13h6M9 17h6" {...s} /></svg>
  ),
  message: (
    <svg width="20" height="20" viewBox="0 0 24 24"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12Z" {...s} /></svg>
  ),
  copy: (
    <svg width="20" height="20" viewBox="0 0 24 24"><rect x="9" y="9" width="11" height="11" rx="2" {...s} /><path d="M5 15V5a2 2 0 0 1 2-2h10" {...s} /></svg>
  ),
  check: (
    <svg width="20" height="20" viewBox="0 0 24 24"><path d="m5 12 5 5 9-10" {...s} /></svg>
  ),
  link: <ExternalIcon />,
  projects: (
    <svg width="20" height="20" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1.5" {...s} /><rect x="14" y="3" width="7" height="7" rx="1.5" {...s} /><rect x="3" y="14" width="7" height="7" rx="1.5" {...s} /><rect x="14" y="14" width="7" height="7" rx="1.5" {...s} /></svg>
  ),
  share: (
    <svg width="20" height="20" viewBox="0 0 24 24"><circle cx="18" cy="5" r="3" {...s} /><circle cx="6" cy="12" r="3" {...s} /><circle cx="18" cy="19" r="3" {...s} /><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4" {...s} /></svg>
  ),
  contact: (
    <svg width="20" height="20" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2" {...s} /><circle cx="9" cy="11" r="2.5" {...s} /><path d="M5.5 17a3.5 3.5 0 0 1 7 0M15 10h3M15 14h3" {...s} /></svg>
  ),
}

// Builds a contact card (.vcf) that phones and Outlook can import
function downloadContact() {
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${profile.fullName || profile.name}`,
    `TITLE:${profile.title}`,
    `EMAIL;TYPE=INTERNET:${profile.email}`,
    `URL:${window.location.origin}${window.location.pathname}`,
    profile.linkedin && `URL;TYPE=LinkedIn:${profile.linkedin}`,
    profile.github && `URL;TYPE=GitHub:${profile.github}`,
    `ADR;TYPE=HOME:;;;${profile.location};;;`,
    'END:VCARD',
  ].filter(Boolean)
  const blob = new Blob([lines.join('\r\n')], { type: 'text/vcard' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `${(profile.fullName || profile.name).replace(/\s+/g, '-')}.vcf`
  a.click()
  URL.revokeObjectURL(a.href)
}

// Photo with a fallback to the first letter of your name
function Avatar({ size }) {
  const [broken, setBroken] = useState(false)
  return (
    <span className="avatar" style={{ width: size, height: size, fontSize: size * 0.45 }}>
      {profile.avatar && !broken ? (
        <img src={profile.avatar} alt="" onError={() => setBroken(true)} />
      ) : (
        profile.name[0]
      )}
    </span>
  )
}

export default function AccountMenu() {
  const [open, setOpen] = useState(false)
  const [done, setDone] = useState(null) // label of a tile that just finished an action
  const wrap = useRef(null)
  const button = useRef(null)

  // Close on outside click or Escape
  useEffect(() => {
    if (!open) return
    const onDown = (e) => wrap.current && !wrap.current.contains(e.target) && setOpen(false)
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false)
        button.current?.focus()
      }
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const flash = (label) => {
    setDone(label)
    setTimeout(() => setDone(null), 1800)
  }

  const runAction = async (l) => {
    try {
      if (l.action === 'copy-email') {
        await navigator.clipboard.writeText(profile.email)
        flash(l.label)
      } else if (l.action === 'share') {
        const url = window.location.origin + window.location.pathname
        if (navigator.share) {
          await navigator.share({ title: `${profile.name} · Portfolio`, url })
        } else {
          await navigator.clipboard.writeText(url)
          flash(l.label)
        }
      } else if (l.action === 'save-contact') {
        downloadContact()
        flash(l.label)
      }
    } catch {
      /* share sheet closed or clipboard blocked: nothing to do */
    }
  }

  const doneText = { 'copy-email': 'Copied', share: 'Link copied', 'save-contact': 'Saved' }

  return (
    <div className="account" ref={wrap}>
      <button
        ref={button}
        className="account-btn"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={`${profile.name}'s links`}
        title={`${profile.name}\n${profile.email}`}
      >
        <span className="ring">
          <Avatar size={32} />
        </span>
      </button>

      <div className={`account-card ${open ? 'open' : ''}`} role="dialog" aria-label="Links" hidden={!open}>
        <div className="ac-top">
          <span className="ac-email">{profile.email}</span>
          <button className="ac-close" onClick={() => setOpen(false)} aria-label="Close">
            <CloseIcon width={18} height={18} />
          </button>
        </div>

        <div className="ac-hero">
          <span className="ring ring-lg">
            <Avatar size={80} />
          </span>
          <h3>Hi, I'm {profile.name}!</h3>
          <p>{profile.title}</p>
          <a className="ac-primary" href={profile.resume} target="_blank" rel="noreferrer">
            View my résumé
          </a>
        </div>

        <div className="ac-grid">
          {accountLinks.map((l) => {
            const isDone = done === l.label
            const content = (
              <>
                <span className={`ac-icon ic-${l.icon}`}>{icons[isDone ? 'check' : l.icon] || icons.link}</span>
                <span className="ac-label">{isDone ? doneText[l.action] : l.label}</span>
              </>
            )
            if (l.action) {
              return (
                <button key={l.label} className="ac-tile" onClick={() => runAction(l)}>
                  {content}
                </button>
              )
            }
            const external = /^https?:/.test(l.href)
            return (
              <a
                key={l.label}
                className="ac-tile"
                href={l.href}
                target={external ? '_blank' : undefined}
                rel={external ? 'noreferrer' : undefined}
                onClick={() => !external && setOpen(false)}
              >
                {content}
              </a>
            )
          })}
        </div>

        <p className="ac-foot">
          {profile.location} · Open to new roles
        </p>
      </div>
    </div>
  )
}