import type { Metadata } from 'next'
import { mockUser, mockStreak, mockBadges, mockEntries } from '@/lib/mock-data'

export const metadata: Metadata = { title: 'Settings' }

export default function SettingsPage() {
  const earnedCount = mockBadges.filter((b) => b.earned).length
  const totalWords  = mockEntries.reduce((sum, e) => sum + e.wordCount, 0)

  return (
    <div className="space-y-8 pb-16 md:pb-0">
      <div>
        <h1 className="text-2xl font-semibold text-[#1a1a1a] tracking-tight">Settings</h1>
        <p className="text-sm text-zinc-400 mt-1">Your account and preferences</p>
      </div>

      {/* Profile */}
      <section className="bg-white border border-zinc-100 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-50">
          <h2 className="text-sm font-semibold text-zinc-800">Profile</h2>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#FAEEDA] flex items-center justify-center text-lg font-semibold text-[#BA7517]">
              {mockUser.name?.[0] ?? '?'}
            </div>
            <div>
              <p className="text-sm font-medium text-[#1a1a1a]">{mockUser.name}</p>
              <p className="text-xs text-zinc-400">{mockUser.email}</p>
            </div>
          </div>
          <SettingRow label="Name" value={mockUser.name ?? '—'} />
          <SettingRow label="Email" value={mockUser.email} />
          <SettingRow label="Plan" value={(mockUser.tier as string) === 'PAID' ? 'Pro' : 'Free'} badge={(mockUser.tier as string) === 'FREE'} />
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border border-zinc-100 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-50">
          <h2 className="text-sm font-semibold text-zinc-800">Your stats</h2>
        </div>
        <div className="grid grid-cols-2 divide-x divide-y divide-zinc-50">
          <StatCell label="Total entries" value={String(mockEntries.length)} />
          <StatCell label="Total words"   value={totalWords.toLocaleString()} />
          <StatCell label="Best streak"   value={`${mockStreak.longest} days`} />
          <StatCell label="Badges earned" value={`${earnedCount} / ${mockBadges.length}`} />
        </div>
      </section>

      {/* Goals */}
      <section className="bg-white border border-zinc-100 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-50 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-zinc-800">My goals</h2>
          <button className="text-xs text-zinc-400 hover:text-zinc-600 transition-colors">Edit</button>
        </div>
        <div className="p-5 space-y-2">
          {mockUser.goals.map((goal) => (
            <div key={goal} className="flex items-center gap-2 text-sm text-zinc-600">
              <span className="w-1.5 h-1.5 rounded-full bg-[#EF9F27] shrink-0" />
              {goal}
            </div>
          ))}
        </div>
      </section>

      {/* Reminders */}
      <section className="bg-white border border-zinc-100 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-50 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-zinc-800">Reminders</h2>
          <button className="text-xs text-zinc-400 hover:text-zinc-600 transition-colors">Edit</button>
        </div>
        <div className="p-5 space-y-3">
          <SettingRow label="Frequency" value={mockUser.reminderFreq ?? 'Not set'} />
          <SettingRow label="Time"      value={mockUser.reminderTime ?? 'Not set'} />
        </div>
      </section>

      {/* Danger zone */}
      <section className="bg-white border border-red-100 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-red-50">
          <h2 className="text-sm font-semibold text-red-400">Danger zone</h2>
        </div>
        <div className="p-5 flex flex-col gap-3">
          <button className="text-sm text-zinc-600 border border-zinc-200 hover:border-zinc-300 px-4 py-2.5 rounded-xl text-left transition-colors w-fit">
            Sign out
          </button>
          <button className="text-sm text-red-500 border border-red-100 hover:border-red-300 px-4 py-2.5 rounded-xl text-left transition-colors w-fit">
            Delete account
          </button>
        </div>
      </section>
    </div>
  )
}

function SettingRow({ label, value, badge }: { label: string; value: string; badge?: boolean }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-xs text-zinc-400">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-sm text-zinc-700">{value}</span>
        {badge && (
          <button className="text-[10px] font-medium text-[#BA7517] bg-[#FAEEDA] border border-[#FAC775] px-2 py-0.5 rounded-full hover:bg-[#FAC775]/30 transition-colors">
            Upgrade
          </button>
        )}
      </div>
    </div>
  )
}

function StatCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-5 flex flex-col gap-1">
      <span className="text-xl font-semibold text-[#1a1a1a]">{value}</span>
      <span className="text-xs text-zinc-400">{label}</span>
    </div>
  )
}
