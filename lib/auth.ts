import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import Google from 'next-auth/providers/google'
import Resend from 'next-auth/providers/resend'
import { prisma } from './prisma'

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  adapter: PrismaAdapter(prisma as any),
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
