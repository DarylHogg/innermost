import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-full flex flex-col bg-[#FAFAF8]">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-5 max-w-5xl mx-auto w-full">
        <span className="text-lg font-semibold tracking-tight text-[#1a1a1a]">innermost</span>
        <div className="flex items-center gap-6">
          <Link href="/sign-in" className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors">
            Sign in
          </Link>
          <Link
            href="/sign-in"
            className="text-sm bg-[#1a1a1a] text-white px-4 py-2 rounded-full hover:bg-zinc-700 transition-colors"
          >
            Get started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-24 text-center">
        <div className="inline-flex items-center gap-2 bg-[#FAEEDA] border border-[#FAC775] text-[#BA7517] text-xs font-medium px-3 py-1.5 rounded-full mb-8">
          <span>✦</span>
          <span>Your private journaling space</span>
        </div>

        <h1 className="text-5xl sm:text-6xl font-semibold tracking-tight text-[#1a1a1a] leading-[1.1] max-w-2xl mb-6">
          A quiet place for<br />
          <span className="text-[#BA7517]">your inner world</span>
        </h1>

        <p className="text-lg text-zinc-500 max-w-md mb-10 leading-relaxed">
          Write freely. Understand yourself better. Track your moods, build a journaling habit, and get gentle AI insights when you want them.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/sign-in"
            className="bg-[#1a1a1a] text-white px-7 py-3.5 rounded-full text-sm font-medium hover:bg-zinc-700 transition-colors"
          >
            Start writing for free
          </Link>
          <Link
            href="#features"
            className="bg-white border border-zinc-200 text-zinc-600 px-7 py-3.5 rounded-full text-sm font-medium hover:border-zinc-300 hover:text-zinc-900 transition-colors"
          >
            See how it works
          </Link>
        </div>

        {/* Social proof */}
        <p className="mt-8 text-xs text-zinc-400">No credit card required · Free forever plan available</p>
      </main>

      {/* Features */}
      <section id="features" className="py-24 px-6 bg-white border-t border-zinc-100">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-semibold tracking-tight text-center text-[#1a1a1a] mb-4">
            Everything you need, nothing you don&apos;t
          </h2>
          <p className="text-center text-zinc-500 mb-16 text-base">
            Built for people who want to understand themselves, not just track themselves.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="bg-[#FAFAF8] border border-zinc-100 rounded-2xl p-6">
                <div className="text-2xl mb-3">{f.emoji}</div>
                <h3 className="font-semibold text-[#1a1a1a] mb-2">{f.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-[#1a1a1a]">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-3xl font-semibold text-white mb-4 tracking-tight">
            Your thoughts deserve a home
          </h2>
          <p className="text-zinc-400 mb-8 leading-relaxed">
            Start your journaling practice today. It only takes a minute to write your first entry.
          </p>
          <Link
            href="/sign-in"
            className="inline-block bg-[#EF9F27] text-white px-8 py-3.5 rounded-full text-sm font-medium hover:bg-[#BA7517] transition-colors"
          >
            Begin your journey
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-100 px-6 py-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-sm font-semibold text-[#1a1a1a]">innermost</span>
          <p className="text-xs text-zinc-400">© 2026 Innermost. All rights reserved.</p>
          <div className="flex gap-5">
            <Link href="#" className="text-xs text-zinc-400 hover:text-zinc-600">Privacy</Link>
            <Link href="#" className="text-xs text-zinc-400 hover:text-zinc-600">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

const features = [
  {
    emoji: '📝',
    title: 'Free-form journaling',
    description: 'Write without limits or structure. Your entries are private by default and fully encrypted.',
  },
  {
    emoji: '🎨',
    title: 'Mood tracking',
    description: 'Log how you feel with each entry. See patterns over time with a simple mood chart.',
  },
  {
    emoji: '✨',
    title: 'AI insights',
    description: 'Get optional AI-powered reflections on your entries — themes, patterns, and gentle observations.',
  },
  {
    emoji: '🔥',
    title: 'Streak tracking',
    description: 'Build a daily writing habit with streaks. Use shield tokens to protect your streak on off days.',
  },
  {
    emoji: '🏆',
    title: 'Badges',
    description: 'Earn badges as you write more, maintain streaks, and reach personal milestones.',
  },
  {
    emoji: '🩺',
    title: 'Therapist sharing',
    description: 'Optionally share entries with your therapist so they arrive prepared to every session.',
  },
]
