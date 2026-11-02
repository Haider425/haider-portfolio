import { Star } from './Mark.jsx'

export default function SectionHead({ eyebrow, title, sub }) {
  return (
    <div className="section-head reveal">
      <span className="eyebrow">
        <Star />
        {eyebrow}
      </span>
      <h2 className="section-title">{title}</h2>
      {sub && <p className="section-sub">{sub}</p>}
    </div>
  )
}
