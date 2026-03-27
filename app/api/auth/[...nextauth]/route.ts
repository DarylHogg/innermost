import { NextRequest, NextResponse } from 'next/server'

let handlers: { GET: any; POST: any } | null = null
let initError: string | null = null

try {
  const auth = require('@/lib/auth')
  handlers = auth.handlers
} catch (e: any) {
  initError = e?.message ?? String(e)
  console.error('[route] auth init failed:', initError)
}

export async function GET(req: NextRequest) {
  console.log('[route] GET called, initError:', initError, 'handlers:', !!handlers)
  if (initError || !handlers) {
    return NextResponse.json({ error: 'auth init failed', detail: initError }, { status: 500 })
  }
  return handlers.GET(req)
}

export async function POST(req: NextRequest) {
  if (!handlers) {
    return NextResponse.json({ error: 'auth init failed', detail: initError }, { status: 500 })
  }
  return handlers.POST(req)
}
