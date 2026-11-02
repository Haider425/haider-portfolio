// Major meteor showers, peak nights from the American Meteor Society calendar
// (amsmeteors.org). Radiant in degrees; rate is the zenithal hourly rate.
const SHOWERS = [
  { name: 'Leonids', peak: '2026-11-16', nights: 'Nov 16 to 17', ra: 152, dec: 21.8, rate: 15 },
  { name: 'Geminids', peak: '2026-12-13', nights: 'Dec 13 to 14', ra: 112, dec: 33, rate: 150 },
  { name: 'Ursids', peak: '2026-12-21', nights: 'Dec 21 to 22', ra: 217, dec: 76, rate: 10 },
  { name: 'Quadrantids', peak: '2027-01-03', nights: 'Jan 3 to 4', ra: 230, dec: 49, rate: 120 },
  { name: 'Lyrids', peak: '2027-04-22', nights: 'Apr 22 to 23', ra: 271, dec: 34, rate: 18 },
  { name: 'Eta Aquariids', peak: '2027-05-05', nights: 'May 5 to 6', ra: 338, dec: -1, rate: 50 },
]

// The next shower whose peak night hasn't ended. A peak night runs until
// noon the next day, so 2 am on Dec 14 still counts as Geminid night.
export function nextShower(date) {
  const t = new Date(date).getTime()
  return SHOWERS.find((s) => new Date(`${s.peak}T12:00:00`).getTime() + 86400000 > t) || null
}

// Days until a shower's peak night, from a date
export function daysUntil(shower, date) {
  const a = new Date(date); a.setHours(0, 0, 0, 0)
  const b = new Date(`${shower.peak}T00:00:00`)
  return Math.round((b - a) / 86400000)
}
