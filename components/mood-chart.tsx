'use client'

import { useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import { moodColor } from '@/lib/mock-data'

export type ChartEntry = {
  id: string
  moodScore: number
  moodLabel: string
  title: string | null
  createdAt: Date
}

type Props = {
  entries: ChartEntry[]   // should be sorted ascending by date
  height?: number
  compact?: boolean       // sparkline-only mode for dashboard
}

const PAD = { top: 16, right: 20, bottom: 36, left: 44 }
const W = 600

// Catmull-Rom control points for a smooth curve
function smoothPath(pts: { x: number; y: number }[]): string {
  if (pts.length < 2) return ''
  let d = `M ${pts[0].x} ${pts[0].y}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[Math.min(pts.length - 1, i + 2)]
    const cp1x = p1.x + (p2.x - p0.x) / 6
    const cp1y = p1.y + (p2.y - p0.y) / 6
    const cp2x = p2.x - (p3.x - p1.x) / 6
    const cp2y = p2.y - (p3.y - p1.y) / 6
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`
  }
  return d
}

const ZONES = [
  { min: 75, max: 100, label: 'Great',   color: '#1D9E75' },
  { min: 55, max: 75,  label: 'Okay',    color: '#65A30D' },
  { min: 35, max: 55,  label: 'Mixed',   color: '#CA8A04' },
  { min: 0,  max: 35,  label: 'Low',     color: '#DC2626' },
]

function shortDate(d: Date) {
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

export default function MoodChart({ entries, height = 200, compact = false }: Props) {
  const [active, setActive] = useState<number | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  const H = height
  const chartW = W - PAD.left - PAD.right
  const chartH = H - PAD.top - PAD.bottom

  // Map entries → SVG coordinates
  const pts = entries.map((e, i) => ({
    x: PAD.left + (entries.length === 1 ? chartW / 2 : (i / (entries.length - 1)) * chartW),
    y: PAD.top + chartH - (e.moodScore / 100) * chartH,
    entry: e,
    i,
  }))

  const linePath  = smoothPath(pts.map((p) => ({ x: p.x, y: p.y })))
  const areaPath  = pts.length > 0
    ? `${linePath} L ${pts[pts.length - 1].x} ${PAD.top + chartH} L ${pts[0].x} ${PAD.top + chartH} Z`
    : ''

  // Tooltip position — keep in bounds
  const getTooltip = useCallback((i: number) => {
    const pt = pts[i]
    const tipW = 160
    const tipH = 72
    let tx = pt.x - tipW / 2
    let ty = pt.y - tipH - 12
    tx = Math.max(PAD.left, Math.min(W - PAD.right - tipW, tx))
    ty = Math.max(PAD.top, ty)
    return { tx, ty, tipW, tipH }
  }, [pts])

  // Which date labels to show (max ~5 so they don't collide)
  const labelStep = Math.ceil(entries.length / 5)
  const labelIndices = entries.map((_, i) => i).filter(
    (i) => i === 0 || i === entries.length - 1 || i % labelStep === 0
  )

  if (compact) {
    // Sparkline — no axes, no tooltips, just the curve
    const sparH = 48
    const sparPts = entries.map((e, i) => ({
      x: entries.length === 1 ? W / 2 : (i / (entries.length - 1)) * W,
      y: sparH - (e.moodScore / 100) * sparH,
    }))
    const sparLine = smoothPath(sparPts)
    const latestScore = entries[entries.length - 1]?.moodScore ?? 50
    const color = moodColor(latestScore)
    return (
      <svg viewBox={`0 0 ${W} ${sparH}`} className="w-full" style={{ height: 40 }} preserveAspectRatio="none">
        <defs>
          <linearGradient id="spar-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {sparLine && (
          <>
            <path
              d={`${sparLine} L ${sparPts[sparPts.length - 1].x} ${sparH} L ${sparPts[0].x} ${sparH} Z`}
              fill="url(#spar-grad)"
            />
            <path d={sparLine} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </>
        )}
      </svg>
    )
  }

  return (
    <div className="relative select-none">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        style={{ height }}
        onMouseLeave={() => setActive(null)}
      >
        <defs>
          <linearGradient id="area-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1D9E75" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#1D9E75" stopOpacity="0" />
          </linearGradient>
          <clipPath id="chart-clip">
            <rect x={PAD.left} y={PAD.top} width={chartW} height={chartH} />
          </clipPath>
        </defs>

        {/* Mood zone bands */}
        {ZONES.map((z) => {
          const y1 = PAD.top + chartH - (z.max / 100) * chartH
          const y2 = PAD.top + chartH - (z.min / 100) * chartH
          return (
            <rect
              key={z.label}
              x={PAD.left} y={y1}
              width={chartW} height={y2 - y1}
              fill={z.color}
              opacity={0.04}
            />
          )
        })}

        {/* Horizontal grid lines + Y labels */}
        {[0, 25, 50, 75, 100].map((v) => {
          const y = PAD.top + chartH - (v / 100) * chartH
          return (
            <g key={v}>
              <line
                x1={PAD.left} y1={y} x2={PAD.left + chartW} y2={y}
                stroke="#e4e4e7" strokeWidth="1" strokeDasharray={v === 0 || v === 100 ? '0' : '3 3'}
              />
              <text
                x={PAD.left - 8} y={y + 4}
                textAnchor="end"
                fontSize="10" fill="#a1a1aa"
              >
                {v}
              </text>
            </g>
          )
        })}

        {/* Area fill */}
        {areaPath && (
          <path d={areaPath} fill="url(#area-grad)" clipPath="url(#chart-clip)" />
        )}

        {/* Line */}
        {linePath && (
          <path
            d={linePath}
            fill="none"
            stroke="#1D9E75"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            clipPath="url(#chart-clip)"
          />
        )}

        {/* X-axis date labels */}
        {labelIndices.map((i) => {
          const pt = pts[i]
          return (
            <text
              key={i}
              x={pt.x} y={PAD.top + chartH + 22}
              textAnchor="middle"
              fontSize="10" fill="#a1a1aa"
            >
              {shortDate(entries[i].createdAt)}
            </text>
          )
        })}

        {/* Invisible hit targets for each point */}
        {pts.map((pt) => (
          <rect
            key={pt.i}
            x={pt.x - (chartW / Math.max(entries.length - 1, 1)) / 2}
            y={PAD.top}
            width={chartW / Math.max(entries.length - 1, 1)}
            height={chartH}
            fill="transparent"
            onMouseEnter={() => setActive(pt.i)}
            style={{ cursor: 'pointer' }}
          />
        ))}

        {/* Hover vertical line */}
        {active !== null && (
          <line
            x1={pts[active].x} y1={PAD.top}
            x2={pts[active].x} y2={PAD.top + chartH}
            stroke="#d4d4d8" strokeWidth="1" strokeDasharray="3 3"
            pointerEvents="none"
          />
        )}

        {/* Data points */}
        {pts.map((pt) => {
          const color = moodColor(pt.entry.moodScore)
          const isActive = active === pt.i
          return (
            <g key={pt.i} pointerEvents="none">
              {isActive && (
                <circle cx={pt.x} cy={pt.y} r="10" fill={color} opacity="0.15" />
              )}
              <circle cx={pt.x} cy={pt.y} r={isActive ? 5 : 3.5} fill={color} />
              <circle cx={pt.x} cy={pt.y} r={isActive ? 2.5 : 1.5} fill="white" />
            </g>
          )
        })}

        {/* Tooltip */}
        {active !== null && (() => {
          const { tx, ty, tipW } = getTooltip(active)
          const e = entries[active]
          const color = moodColor(e.moodScore)
          return (
            <g pointerEvents="none">
              <rect x={tx} y={ty} width={tipW} height={68} rx="8" fill="white" filter="drop-shadow(0 2px 8px rgba(0,0,0,0.10))" />
              <rect x={tx} y={ty} width={tipW} height={68} rx="8" fill="none" stroke="#e4e4e7" strokeWidth="1" />
              {/* Score pill */}
              <rect x={tx + 10} y={ty + 10} width={44} height={18} rx="9" fill={color + '22'} />
              <text x={tx + 32} y={ty + 22.5} textAnchor="middle" fontSize="10" fontWeight="600" fill={color}>
                {e.moodScore}
              </text>
              {/* Mood label */}
              <text x={tx + 62} y={ty + 22} fontSize="11" fontWeight="600" fill="#1a1a1a">
                {e.moodLabel}
              </text>
              {/* Date */}
              <text x={tx + 10} y={ty + 40} fontSize="10" fill="#a1a1aa">
                {shortDate(e.createdAt)}
              </text>
              {/* Title */}
              <text x={tx + 10} y={ty + 56} fontSize="10" fill="#71717a">
                {(e.title ?? 'Untitled entry').slice(0, 22)}{(e.title ?? 'Untitled entry').length > 22 ? '…' : ''}
              </text>
            </g>
          )
        })()}
      </svg>
    </div>
  )
}
