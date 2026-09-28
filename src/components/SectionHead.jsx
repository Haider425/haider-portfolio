export default function SectionHead({ eyebrow, title, sub }) {
  return (
    <div className="section-head reveal">
      <span className="eyebrow">
        <span className="dots">
          <i style={{ background: 'var(--g-blue)' }} />
          <i style={{ background: 'var(--g-red)' }} />
          <i style={{ background: 'var(--g-yellow)' }} />
          <i style={{ background: 'var(--g-green)' }} />
        </span>
        {eyebrow}
      </span>
      <h2 className="section-title">{title}</h2>
      {sub && <p className="section-sub">{sub}</p>}
    </div>
  )
}
