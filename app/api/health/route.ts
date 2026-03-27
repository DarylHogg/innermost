import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    AUTH_SECRET:    !!process.env.AUTH_SECRET,
    DATABASE_URL:   !!process.env.DATABASE_URL,
    RESEND_API_KEY: !!process.env.RESEND_API_KEY,
    NEXTAUTH_URL:   process.env.NEXTAUTH_URL,
    NODE_ENV:       process.env.NODE_ENV,
  })
}
