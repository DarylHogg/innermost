import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

const protectedRoutes = ['/dashboard', '/journal', '/settings']

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isProtected = protectedRoutes.some((r) => pathname.startsWith(r))

  if (isProtected && !req.auth) {
    const signInUrl = new URL('/sign-in', req.url)
    signInUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(signInUrl)
  }

  // Redirect signed-in users away from sign-in page
  if (pathname.startsWith('/sign-in') && req.auth) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
