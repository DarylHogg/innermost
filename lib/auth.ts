import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import Google from 'next-auth/providers/google'
import Resend from 'next-auth/providers/resend'
import { prisma } from './prisma'

console.log('[auth] AUTH_SECRET set:', !!process.env.AUTH_SECRET)
console.log('[auth] RESEND_API_KEY set:', !!process.env.RESEND_API_KEY)
console.log('[auth] DATABASE_URL set:', !!process.env.DATABASE_URL)

let authExports: ReturnType<typeof NextAuth>
try {
  authExports = NextAuth({
    secret: process.env.AUTH_SECRET,
    trustHost: true,
    // adapter: PrismaAdapter(prisma as any), // temporarily disabled for debugging
    providers: [
      ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
        ? [Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          })]
        : []),
      Resend({
        apiKey: process.env.RESEND_API_KEY,
        from: 'Innermost <onboarding@resend.dev>',
      }),
    ],
    pages: {
      signIn: '/sign-in',
      verifyRequest: '/sign-in?verify=1',
    },
    callbacks: {
      session({ session, user }) {
        session.user.id = user.id
        return session
      },
    },
  })
} catch (e) {
  console.error('[auth] NextAuth init error:', e)
  throw e
}

export const { handlers, auth, signIn, signOut } = authExports
