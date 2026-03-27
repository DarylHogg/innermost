'use client'

import { use, useState } from 'react'
import { signIn } from 'next-auth/react'

export default function SignInForm({
  searchParams,
}: {
  searchParams: Promise<{ verify?: string }>
}) {
  const { verify } = use(searchParams)
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    setError('')
    try {
      const result = await signIn('resend', {
        email,
        redirect: false,
        callbackUrl: '/dashboard',
      })
      if (result?.error) {
        setError('Something went wrong. Please try again.')
      } else {
        setSubmitted(true)
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (verify || submitted) {
    return (
      <div className="text-center py-4">
        <div className="text-3xl mb-4">📬</div>
        <h2 className="font-semibold text-[#1a1a1a] mb-2">Check your inbox</h2>
        <p className="text-sm text-zinc-500 leading-relaxed">
          We sent a sign-in link to{' '}
          <span className="font-medium text-[#1a1a1a]">{email || 'your email'}</span>.
          <br />Click it to continue.
        </p>
        <button
          onClick={() => { setSubmitted(false); setEmail('') }}
          className="mt-6 text-xs text-zinc-400 underline underline-offset-2 hover:text-zinc-600"
        >
          Use a different email
        </button>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-xl font-semibold text-[#1a1a1a] mb-1">Welcome back</h1>
      <p className="text-sm text-zinc-500 mb-6">Sign in or create your account</p>

      <form onSubmit={handleSubmit}>
        <label className="block text-xs font-medium text-zinc-600 mb-1.5" htmlFor="email">
          Email address
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          disabled={loading}
          className="w-full border border-zinc-200 rounded-xl px-4 py-3 text-sm text-[#1a1a1a] placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#EF9F27]/30 focus:border-[#EF9F27] transition-colors disabled:opacity-50"
        />
        {error && (
          <p className="mt-2 text-xs text-red-500">{error}</p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="mt-3 w-full bg-[#1a1a1a] text-white text-sm font-medium py-3 rounded-xl hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Sending link…' : 'Continue with email'}
        </button>
      </form>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  )
}
