import type { Metadata } from 'next'
import Link from 'next/link'
import { mockEntries, moodColor, formatDate } from '@/lib/mock-data'
import MoodChart from '@/components/mood-chart'

export const metadata: Metadata = { title: 'Journal' }

export default function JournalPage() {
  // Sort ascending for chart, keep descending for list
  const chartEntries = [...mockEntries]
    .filter((e) => e.moodScore != null)
    .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
    .map((e) => ({
      id: e.id,
      moodScore: e.moodScore!,
      moodLabel: e.moodLabel!,
      title: e.title,
      createdAt: e.createdAt,
    }))

  // Summary stats
  const scores  = chartEntries.map((e) => e.moodScore)
  const avg     = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
  const highest = Math.max(...scores)
  const lowest  = Math.min(...scores)
  const recent7 = chartEntries.slice(-7)
  const prev7   = chartEntries.slice(-14, -7)
  const avgRecent = recent7.reduce((a, b) => a + b.moodScore, 0) / (recent7.length || 1)
  const avgPrev   = prev7.reduce((a, b) => a + b.moodScore, 0) / (prev7.length || 1)
  const trend   = avgRecent - avgPrev

  return (
    <div className="space-y-6 pb-16 md:pb-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#1a1a1a] tracking-tight">Journal</h1>
          <p className="text-sm text-zinc-400 mt-1">{mockEntries.length} entries</p>
        </div>
        <Link
          href="/journal/new"
          className="flex items-center gap-2 bg-[#1a1a1a] text-white text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-zinc-700 transition-colors"
        >
          + New entry
        </Link>
      </div>

      {/* Mood chart card */}
      <div className="bg-white border border-zinc-100 rounded-2xl overflow-hidden">
        {/* Stats row */}
        <div className="grid grid-cols-4 divide-x divide-zinc-50 border-b border-zinc-50">
          <StatCell label="Avg mood" value={String(avg)} color={moodColor(avg)} />
          <StatCell label="Highest"  value={String(highest)} color={moodColor(highest)} />
          <StatCell label="Lowest"   value={String(lowest)}  color={moodColor(lowest)} />
          <StatCell
            label="vs last week"
            value={(trend >= 0 ? '+' : '') + Math.round(trend)}
            color={trend >= 0 ? '#1D9E75' : '#DC2626'}
            arrow={trend >= 0 ? '↑' : '↓'}
          />
        </div>

        {/* Chart */}
        <div className="px-2 pt-4 pb-2">
          <div className="flex items-center justify-between px-3 mb-1">
            <p className="text-xs font-medium text-zinc-400">Mood over time</p>
            <div className="flex items-center gap-3">
              {[
                { label: 'Great',  color: '#1D9E75' },
                { label: 'Okay',   color: '#65A30D' },
                { label: 'Mixed',  color: '#CA8A04' },
                { label: 'Low',    color: '#DC2626' },
              ].map((z) => (
                <div key={z.label} className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full" style={{ background: z.color, opacity: 0.5 }} />
                  <span className="text-[10px] text-zinc-400">{z.label}</span>
                </div>
              ))}
            </div>
          </div>
          <MoodChart entries={chartEntries} height={200} />
        </div>

        {/* Hover hint */}
        <p className="text-center text-[10px] text-zinc-300 pb-3">
          Hover over a point to see details
        </p>
      </div>

      {/* Entries list */}
      <div className="space-y-3">
        {mockEntries.map((entry) => (
          <Link
            key={entry.id}
            href={`/journal/${entry.id}`}
            className="block bg-white border border-zinc-100 rounded-2xl p-5 hover:border-zinc-200 hover:shadow-sm transition-all"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-medium text-[#1a1a1a]">
                    {entry.title ?? 'Untitled entry'}
                  </p>
                  {entry.isPrivate && (
                    <span className="text-[10px] text-zinc-400 bg-zinc-100 px-1.5 py-0.5 rounded-full">
                      Private
                    </span>
                  )}
                </div>
                <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                  {entry.body.slice(0, 120)}…
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-[10px] text-zinc-400">{entry.wordCount} words</span>
                  {entry.aiFlags.length > 0 && (
                    <span className="text-[10px] text-[#BA7517]">
                      {entry.aiFlags.join(' · ')}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-end shrink-0 gap-1.5">
                {entry.moodScore != null && (
                  <span
                    className="text-xs font-medium px-2 py-0.5 rounded-full"
                    style={{
                      color: moodColor(entry.moodScore),
                      background: moodColor(entry.moodScore) + '18',
                    }}
                  >
                    {entry.moodLabel}
                  </span>
                )}
                <span className="text-[10px] text-zinc-400">{formatDate(entry.createdAt)}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

function StatCell({
  label, value, color, arrow,
}: {
  label: string; value: string; color: string; arrow?: string
}) {
  return (
    <div className="flex flex-col items-center justify-center py-4 gap-0.5">
      <span className="text-[10px] text-zinc-400 text-center leading-tight">{label}</span>
      <span className="text-base font-semibold" style={{ color }}>
        {arrow && <span className="text-sm mr-0.5">{arrow}</span>}
        {value}
      </span>
    </div>
  )
}
