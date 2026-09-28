import { useState } from 'react'
import SectionHead from './SectionHead.jsx'
import { MailIcon, GitHubIcon, LinkedInIcon, ArrowIcon } from './Icons.jsx'
import { profile } from '../data/content.js'
import './Contact.css'

const empty = { name: '', email: '', message: '' }
const hasKey = profile.formKey && !profile.formKey.startsWith('REPLACE')

export default function Contact() {
  const [form, setForm] = useState(empty)
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const onSubmit = async (e) => {
    e.preventDefault()

    // No key yet: fall back to opening the visitor's email app
    if (!hasKey) {
      const subject = encodeURIComponent(`Hello from ${form.name || 'your portfolio'}`)
      const body = encodeURIComponent(`${form.message}\n\n${form.name}\n${form.email}`)
      window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`
      return
    }

    setStatus('sending')
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: profile.formKey,
          subject: `Portfolio message from ${form.name}`,
          from_name: 'Portfolio contact form',
          name: form.name,
          email: form.email, // lets you hit Reply in your inbox
          message: form.message,
          botcheck: form.botcheck || '',
        }),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.message)
      setStatus('sent')
      setForm(empty)
    } catch {
      setStatus('error')
    }
  }

  return (
    <section className="section" id="contact">
      <div className="container">
        <div className="contact-card reveal">
          <div className="contact-left">
            <SectionHead
              eyebrow="Contact"
              title="Let's talk"
              sub="Open to data, analytics, and software roles. Send a note and I'll get back to you."
            />
            <div className="contact-links">
              <a className="btn btn-outline" href={`mailto:${profile.email}`}>
                <MailIcon /> Email
              </a>
              <a className="btn btn-outline" href={profile.linkedin} target="_blank" rel="noreferrer">
                <LinkedInIcon /> LinkedIn
              </a>
              <a className="btn btn-outline" href={profile.github} target="_blank" rel="noreferrer">
                <GitHubIcon /> GitHub
              </a>
            </div>
          </div>

          {status === 'sent' ? (
            <div className="contact-done" role="status">
              <span className="done-check">✓</span>
              <h3>Message sent</h3>
              <p>Thanks for reaching out. I'll get back to you soon.</p>
              <button className="btn btn-outline" onClick={() => setStatus('idle')}>
                Send another
              </button>
            </div>
          ) : (
            <form className="contact-form" onSubmit={onSubmit}>
              <label className="field">
                <input value={form.name} onChange={update('name')} placeholder=" " required />
                <span>Your name</span>
              </label>
              <label className="field">
                <input type="email" value={form.email} onChange={update('email')} placeholder=" " required />
                <span>Your email</span>
              </label>
              <label className="field">
                <textarea value={form.message} onChange={update('message')} placeholder=" " rows={5} required />
                <span>Message</span>
              </label>
              {/* Hidden spam trap: bots fill it, people don't see it */}
              <input type="checkbox" name="botcheck" className="botcheck" tabIndex={-1} autoComplete="off"
                onChange={(e) => setForm((f) => ({ ...f, botcheck: e.target.checked ? 'on' : '' }))} />
              <button className="btn btn-filled" type="submit" disabled={status === 'sending'}>
                {status === 'sending' ? 'Sending…' : 'Send message'} <ArrowIcon width={18} height={18} />
              </button>
              {status === 'error' && (
                <p className="form-error" role="alert">
                  Something went wrong. Please try again or email me directly.
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  )
}