import { NextResponse, type NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('access_token')?.value

  // Check if the path is for auth pages (login)
  const isAuthPage = pathname.includes('/login')
  
  // Check if the path is the root language page (/vi)
  const isRootLangPage = pathname === '/vi' || pathname === '/vi/'
  
  // If user is on auth page and has token, redirect to main page
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/vi', request.url))
  }
  
  // If user is on root language page, allow access (no token check needed)
  if (isRootLangPage) {
    return NextResponse.next()
  }
  
  // If user is on protected page and has no token, redirect to login
  if (!isAuthPage && !token && !isRootLangPage) {
    return NextResponse.redirect(new URL('/vi/login', request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}