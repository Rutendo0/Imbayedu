import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isAdminApi = pathname.startsWith('/api/admin')
  const isAdminPage = pathname.startsWith('/admin')
  const isAdminRoot = pathname === '/admin'

  if (isAdminApi || isAdminPage) {
    const cookie = request.cookies.get('admin_user')?.value

    if (!cookie) {
      // For admin API, return 401 JSON
      if (isAdminApi) {
        return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } })
      }
      // Allow the admin root page to render the login form
      if (isAdminRoot) {
        return NextResponse.next()
      }
      // For other admin pages, redirect to /admin (login)
      const url = request.nextUrl.clone()
      url.pathname = '/admin'
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)', '/api/admin/:path*'],
}
