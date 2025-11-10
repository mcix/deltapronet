import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    // Check curator/moderator routes
    if (path.startsWith('/curator')) {
      if (!token || (token.role !== 'CURATOR' && token.role !== 'MODERATOR')) {
        return NextResponse.redirect(new URL('/', req.url))
      }
    }

    // Check if user is accessing dashboard
    if (path.startsWith('/dashboard')) {
      if (!token) {
        return NextResponse.redirect(new URL('/api/auth/signin', req.url))
      }
    }

    // Check if user is posting questions
    if (path.startsWith('/questions/new')) {
      if (!token) {
        return NextResponse.redirect(new URL('/api/auth/signin', req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = {
  matcher: ['/dashboard/:path*', '/curator/:path*', '/questions/new'],
}

