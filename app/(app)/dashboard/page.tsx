import type { Metadata } from 'next'
import Link from 'next/link'
import { mockUser, mockStreak, mockBadges, mockPrompt, mockEntries, moodColor, formatDate } from '@/lib/mock-data'
import MoodChart from '@/components/mood-chart'

export const metadata: Metadata = { title: 'Home' }

export default function DashboardPage() {
  const recentEntries = mockEntries.slice(0, 3)
  const earnedBadges = mockBadges.filter((b) => b.earned)

  const sparkEntries = [...mockEntries]
    .filter((e) => e.moodScore != null)
    .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
    .slice(-14)
    .map((e) => ({
      id: e.id,
      moodScore: e.moodScore!,
      moodLabel: e.moodLabel!,
      title: e.title,
      createdAt: e.createdAt,
    }))

  const recentScores = sparkEntries.slice(-7).map((e) => e.moodScore)
  const avgMood = recentScores.length
    ? Math.round(recentScores.reduce((a, b) => a + b, 0) / recentScores.length)
    : null

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-semibold text-[#1a1a1a] tracking-tight">
          Good {getTimeOfDay()}, {mockUser.name}
        </h1>
        <p className="text-zinc-400 text-sm mt-1">
          {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
      </div>

      {/* Streak + quick stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white border border-zinc-100 rounded-2xl p-5 col-span-1 flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-bold text-[#1a1a1a]">{mockStreak.current}</span>
          <span className="text-xs text-zinc-400 mt-1">day streak</span>
          <div className="flex gap-1 mt-2">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i < mockStreak.current % 7 || mockStreak.current >= 7
                    ? 'bg-[#EF9F27]'
                    : 'bg-zinc-100'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="bg-white border border-zinc-100 rounded-2xl p-5 flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-bold text-[#1a1a1a]">{mockStreak.longest}</span>
          <span className="text-xs text-zinc-400 mt-1">best streak</span>
        </div>

        <div className="bg-white border border-zinc-100 rounded-2xl p-5 flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-bold text-[#1a1a1a]">{mockStreak.shields}</span>
          <span className="text-xs text-zinc-400 mt-1">
            shield{mockStreak.shields !== 1 ? 's' : ''}
          </span>
          <span className="text-base mt-1">🛡️</span>
        </div>
      </div>

      {/* Mood sparkline */}
      {sparkEntries.length > 1 && (
        <Link
          href="/journal"
          className="block bg-white border border-zinc-100 rounded-2xl p-5 hover:border-zinc-200 transition-colors group"
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs font-medium text-zinc-500">Mood · last 2 weeks</p>
              {avgMood != null && (
                <p className="text-sm font-semibold mt-0.5" style={{ color: moodColor(avgMood) }}>
                  Avg {avgMood}
                </p>
              )}
            </div>
            <span className="text-xs text-zinc-300 group-hover:text-zinc-400 transition-colors">
              View full chart →
            </span>
          </div>
          <MoodChart entries={sparkEntries} compact />
        </Link>
      )}

      {/* Today's prompt */}
      <div className="bg-[#FAEEDA] border border-[#FAC775] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-[#BA7517] uppercase tracking-wide">
            Prompt · {mockPrompt.category}
          </span>
          <span className="text-[10px] text-[#BA7517]/60">Daily</span>
        </div>
        <p className="text-[#1a1a1a] font-medium leading-relaxed mb-4">
          &ldquo;{mockPrompt.text}&rdquo;
        </p>
        <Link
          href={`/journal/new?prompt=${mockPrompt.id}`}
          className="inline-flex items-center gap-2 bg-[#BA7517] text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-[#9A6010] transition-colors"
        >
          Respond to this prompt
        </Link>
      </div>

      {/* Recent entries */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-zinc-800">Recent entries</h2>
          <Link href="/journal" className="text-xs text-zinc-400 hover:text-zinc-600 transition-colors">
            View all
          </Link>
        </div>

        <div className="space-y-3">
          {recentEntries.map((entry) => (
            <Link
              key={entry.id}
              href={`/journal/${entry.id}`}
              className="block bg-white border border-zinc-100 rounded-2xl p-5 hover:border-zinc-200 hover:shadow-sm transition-all group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-[#1a1a1a] truncate">
                    {entry.title ?? 'Untitled entry'}
                  </p>
                  <p className="text-xs text-zinc-400 mt-0.5 line-clamp-1">
                    {entry.body.slice(0, 80)}…
                  </p>
                </div>
                <div className="flex flex-col items-end shrink-0 gap-1">
                  <span
                    className="text-xs font-medium px-2 py-0.5 rounded-full"
                    style={{
                      color: moodColor(entry.moodScore ?? 50),
                      background: moodColor(entry.moodScore ?? 50) + '18',
                    }}
                  >
                    {entry.moodLabel}
                  </span>
                  <span className="text-[10px] text-zinc-400">{formatDate(entry.createdAt)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {recentEntries.length === 0 && (
          <div className="text-center py-12 border border-dashed border-zinc-200 rounded-2xl">
            <p className="text-zinc-400 text-sm">No entries yet.</p>
            <Link href="/journal/new" className="text-sm font-medium text-[#BA7517] mt-2 inline-block hover:underline">
              Write your first one →
            </Link>
          </div>
        )}
      </div>

      {/* Badges */}
      {earnedBadges.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-zinc-800 mb-4">Your badges</h2>
          <div className="flex flex-wrap gap-2">
            {earnedBadges.map((badge) => (
              <div
                key={badge.key}
                title={badge.description}
                className="flex items-center gap-2 bg-white border border-zinc-100 rounded-full px-3 py-1.5 text-xs font-medium text-zinc-700"
              >
                <span>{badge.iconEmoji}</span>
                {badge.name}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Write CTA — if no entry today */}
      <div className="flex justify-center pb-6 md:pb-0">
        <Link
          href="/journal/new"
          className="inline-flex items-center gap-2 bg-[#1a1a1a] text-white text-sm font-medium px-6 py-3 rounded-full hover:bg-zinc-700 transition-colors"
        >
          ✍️ Write today&apos;s entry
        </Link>
      </div>
    </div>
  )
}

function getTimeOfDay(): string {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 17) return 'afternoon'
  return 'evening'
}
