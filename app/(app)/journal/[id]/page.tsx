import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { mockEntries, moodColor } from '@/lib/mock-data'

export const metadata: Metadata = { title: 'Entry' }

export default async function EntryPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const entry = mockEntries.find((e) => e.id === id)
  if (!entry) notFound()

  const score = entry.moodScore ?? 50
  const color = moodColor(score)

  return (
    <div className="space-y-8 pb-16 md:pb-0">
      {/* Back */}
      <Link
        href="/journal"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-600 transition-colors"
      >
        ← Journal
      </Link>

      {/* Entry header */}
      <div>
        <div className="flex items-start justify-between gap-4 mb-2">
          <h1 className="text-2xl font-semibold text-[#1a1a1a] tracking-tight leading-snug">
            {entry.title ?? 'Untitled entry'}
          </h1>
          {entry.moodScore != null && (
            <span
              className="shrink-0 text-sm font-medium px-3 py-1 rounded-full mt-0.5"
              style={{ color, background: color + '18' }}
            >
              {entry.moodLabel}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 text-xs text-zinc-400">
          <span>
            {entry.createdAt.toLocaleDateString('en-GB', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </span>
          <span>·</span>
          <span>{entry.wordCount} words</span>
          {entry.isPrivate && (
            <>
              <span>·</span>
              <span className="text-zinc-400">🔒 Private</span>
            </>
          )}
        </div>
      </div>

      {/* Entry body */}
      <div className="prose prose-sm max-w-none text-[#1a1a1a] leading-relaxed">
        {entry.body.split('\n\n').map((para, i) => (
          <p key={i} className="mb-4 last:mb-0">
            {para}
          </p>
        ))}
      </div>

      {/* AI insights */}
      {entry.aiSummary && (
        <div className="bg-[#E1F5EE] border border-[#9FE1CB] rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-sm">✨</span>
            <h2 className="text-sm font-semibold text-[#1D9E75]">AI reflection</h2>
            <span className="text-[10px] text-[#1D9E75]/60 ml-auto">Powered by Claude</span>
          </div>

          <p className="text-sm text-zinc-700 leading-relaxed">{entry.aiSummary}</p>

          {entry.aiFlags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="text-xs text-zinc-500 mr-1">Themes noticed:</span>
              {entry.aiFlags.map((flag) => (
                <span
                  key={flag}
                  className="text-xs bg-white/70 border border-[#9FE1CB] text-zinc-600 px-2.5 py-1 rounded-full capitalize"
                >
                  {flag.replace('-', ' ')}
                </span>
              ))}
            </div>
          )}

          <p className="text-[10px] text-zinc-400 pt-1">
            AI insights are observations, not clinical advice. Speak to a professional if you&apos;re concerned about your wellbeing.
          </p>
        </div>
      )}

      {/* Mood score bar */}
      {entry.moodScore != null && (
        <div className="bg-white border border-zinc-100 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-medium text-zinc-500">Mood score</p>
            <span className="text-sm font-semibold" style={{ color }}>{entry.moodScore}/100</span>
          </div>
          <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${entry.moodScore}%`, background: color }}
            />
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <button className="text-xs text-zinc-400 hover:text-zinc-600 border border-zinc-200 hover:border-zinc-300 px-3 py-2 rounded-xl transition-colors">
          Edit entry
        </button>
        <button className="text-xs text-red-400 hover:text-red-600 border border-red-100 hover:border-red-200 px-3 py-2 rounded-xl transition-colors">
          Delete
        </button>
        {!entry.sharedWithTherapist && !entry.isPrivate && (
          <button className="text-xs text-[#1D9E75] hover:text-[#166d4f] border border-[#9FE1CB] hover:border-[#1D9E75] px-3 py-2 rounded-xl transition-colors ml-auto">
            Share with therapist
          </button>
        )}
      </div>
    </div>
  )
}
