import { useState } from 'react'

// Shows the company logo if `logo` is set in content.js,
// otherwise (or if the image fails to load) a coloured circle with the first letter.
export default function Logo({ job, color, className }) {
  const [broken, setBroken] = useState(false)

  if (job.logo && !broken) {
    return (
      <span className={`${className} has-logo`}>
        <img src={job.logo} alt="" onError={() => setBroken(true)} />
      </span>
    )
  }
  return (
    <span className={className} style={{ background: color }}>
      {job.org[0]}
    </span>
  )
}
