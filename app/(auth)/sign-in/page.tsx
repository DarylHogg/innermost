import type { Metadata } from 'next'
import Link from 'next/link'
import SignInForm from './sign-in-form'

export const metadata: Metadata = { title: 'Sign in' }

export default function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ verify?: string }>
}) {
  return (
    <div className="w-full max-w-sm">
      {/* Logo */}
      <div className="text-center mb-8">
        <Link href="/" className="text-2xl font-semibold tracking-tight text-[#1a1a1a]">
          innermost
        </Link>
        <p className="mt-2 text-sm text-zinc-500">Your private journaling space</p>
      </div>

      <div className="bg-white border border-zinc-200 rounded-2xl p-8 shadow-sm">
        <SignInForm searchParams={searchParams} />
      </div>

      <p className="text-center text-xs text-zinc-400 mt-6">
        By continuing, you agree to our{' '}
        <Link href="#" className="underline underline-offset-2 hover:text-zinc-600">Terms</Link>{' '}
        and{' '}
        <Link href="#" className="underline underline-offset-2 hover:text-zinc-600">Privacy Policy</Link>.
      </p>
    </div>
  )
}
