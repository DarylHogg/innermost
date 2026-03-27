import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import Resend from 'next-auth/providers/resend'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from './prisma'

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma as any),
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  logger: {
    error: (error) => {
      console.error('[nextauth] error:', error)
    },
    warn: (code) => {
      console.warn('[nextauth] warn:', code)
    },
    debug: (code, metadata) => {
      console.log('[nextauth] debug:', code, JSON.stringify(metadata))
    },
  },
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
