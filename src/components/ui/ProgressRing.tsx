import type { CSSProperties } from 'react'

interface ProgressRingProps {
  value: number
  max: number
  label: string
  display?: string
  caption?: string
  tone?: string
  size?: number
}

export default function ProgressRing({ value, max, label, display, caption, tone = 'lime', size = 100 }: ProgressRingProps) {
  const safeValue = Math.min(Math.max(Number.isFinite(value) ? value : 0, 0), max)
  const percentage = max > 0 ? Math.round(safeValue / max * 100) : 0
  return <div className={`progress-ring tone-${tone}`} style={{ '--ring-size': `${size}px` } as CSSProperties}
    role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={max} aria-valuenow={safeValue} aria-valuetext={`${safeValue} of ${max} · ${percentage}%`}>
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <circle className="ring-track" cx="50" cy="50" r="43" fill="none" strokeWidth="5" />
      <circle className="ring-value" cx="50" cy="50" r="43" fill="none" strokeWidth="5" pathLength="100" strokeDasharray={`${percentage} 100`} strokeLinecap={percentage ? 'round' : 'butt'} transform="rotate(-90 50 50)" />
    </svg>
    <span className="ring-center"><strong>{display ?? `${percentage}%`}</strong><span>{caption ?? label}</span></span>
  </div>
}
