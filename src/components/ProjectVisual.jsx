/**
 * Abstract, CSS-only visual for a project that has no real screenshot.
 * Monochrome, one accent element at most. Never a fake UI mockup.
 *
 * Each treatment is drawn as inline SVG so it scales crisply and costs no
 * image bytes. `aria-hidden` throughout — the row's text carries the meaning.
 */

/* Rising step-line over a faint grid: a forecast. */
const Forecast = () => (
  <svg viewBox="0 0 400 300" className="h-full w-full" aria-hidden="true">
    <defs>
      <pattern id="v-grid" width="25" height="25" patternUnits="userSpaceOnUse">
        <path d="M25 0H0V25" fill="none" stroke="#C9C8C2" strokeWidth="0.75" />
      </pattern>
    </defs>
    <rect width="400" height="300" fill="url(#v-grid)" />
    <path d="M0 240 H75 V205 H150 V215 H225 V150 H300 V120 H350"
          fill="none" stroke="#11110F" strokeWidth="2.5" />
    <path d="M350 120 H400" fill="none" stroke="#FF4D00" strokeWidth="2.5" strokeDasharray="6 5" />
    <circle cx="350" cy="120" r="4.5" fill="#FF4D00" />
    <line x1="350" y1="0" x2="350" y2="300" stroke="#11110F" strokeWidth="0.75" strokeDasharray="2 4" />
  </svg>
)

/* Ledger rows with tabular figures: a finance tracker. */
const Ledger = () => {
  const rows = [
    ['01', 142], ['02', 96], ['03', 188], ['04', 61], ['05', 124], ['06', 210], ['07', 88],
  ]
  return (
    <svg viewBox="0 0 400 300" className="h-full w-full" aria-hidden="true">
      {rows.map(([n, w], i) => {
        const y = 22 + i * 38
        return (
          <g key={n}>
            <line x1="0" y1={y + 28} x2="400" y2={y + 28} stroke="#C9C8C2" strokeWidth="0.75" />
            <text x="0" y={y + 14} fontFamily="JetBrains Mono, monospace" fontSize="10"
                  fill="#6D6C67" letterSpacing="1">{n}</text>
            <rect x="60" y={y} width={w} height="14" fill={i === 5 ? '#FF4D00' : '#11110F'} />
            <text x="400" y={y + 12} textAnchor="end" fontFamily="JetBrains Mono, monospace"
                  fontSize="10" fill="#11110F">{(w * 3.4).toFixed(2)}</text>
          </g>
        )
      })}
    </svg>
  )
}

/* A tight grid of tiles, some filled, one marked: a content calendar. */
const Grid = () => {
  const cells = Array.from({ length: 48 }, (_, i) => i)
  const filled = new Set([2, 5, 9, 12, 14, 17, 21, 23, 26, 30, 33, 35, 38, 41, 44, 46])
  return (
    <svg viewBox="0 0 400 300" className="h-full w-full" aria-hidden="true">
      {cells.map((i) => {
        const x = (i % 8) * 50
        const y = Math.floor(i / 8) * 50
        return (
          <g key={i}>
            <rect x={x} y={y} width="50" height="50" fill="none" stroke="#C9C8C2" strokeWidth="0.75" />
            {filled.has(i) && (
              <rect x={x + 12} y={y + 12} width="26" height="26"
                    fill={i === 26 ? '#FF4D00' : '#11110F'} />
            )}
          </g>
        )
      })}
    </svg>
  )
}

/* One oversized letterform cropped by the frame: a brand mark. */
const Mark = () => (
  <svg viewBox="0 0 400 300" className="h-full w-full" aria-hidden="true">
    <text x="-8" y="292" fontFamily="Archivo, sans-serif" fontWeight="800" fontSize="380"
          letterSpacing="-20" fill="#11110F">A</text>
    <circle cx="352" cy="48" r="14" fill="#FF4D00" />
    <line x1="0" y1="150" x2="400" y2="150" stroke="#F2F1ED" strokeWidth="1.5" />
  </svg>
)

const TREATMENTS = { forecast: Forecast, ledger: Ledger, grid: Grid, mark: Mark }

const ProjectVisual = ({ project }) => {
  if (project.image_url) {
    return (
      <img
        src={project.image_url}
        alt={`${project.name} interface`}
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover"
      />
    )
  }
  const Treatment = TREATMENTS[project.visual] || Mark
  return (
    <div className="h-full w-full bg-paper-2 p-6 md:p-8">
      <Treatment />
    </div>
  )
}

export default ProjectVisual
