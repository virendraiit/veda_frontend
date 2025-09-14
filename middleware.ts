import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define protected routes and their required user types
const protectedRoutes = {
  '/teacher': 'teacher',
  '/student': 'student',
  '/content-generator': 'teacher',
  '/question-paper-generator': 'teacher',
  '/knowledge-base': 'teacher',
  '/visual-aids': 'teacher',
  '/worksheet-generator': 'teacher',
  '/lesson-planner': 'teacher',
  '/reading-assessment': 'teacher',
  '/storytelling': 'teacher',
  '/educational-games': 'teacher',
  '/image-generator': 'teacher',
  '/game-creator': 'teacher',
} as const

// Routes that should redirect authenticated users to their dashboard
const authRedirectRoutes = ['/', '/auth/login']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Get user info from cookies (Firebase auth token)
  const authToken = request.cookies.get('auth-token')?.value
  const userType = request.cookies.get('user-type')?.value
  
  // Check if this is a protected route
  const isProtectedRoute = Object.keys(protectedRoutes).some(route => 
    pathname.startsWith(route)
  )
  
  // Check if this is an auth redirect route
  const isAuthRedirectRoute = authRedirectRoutes.includes(pathname)
  
  if (isProtectedRoute) {
    // If no auth token, redirect to home
    if (!authToken) {
      return NextResponse.redirect(new URL('/', request.url))
    }
    
    // Check if user has the required user type
    const requiredUserType = Object.entries(protectedRoutes).find(([route]) => 
      pathname.startsWith(route)
    )?.[1]
    
    if (requiredUserType && userType !== requiredUserType) {
      // User doesn't have access, redirect to access denied
      return NextResponse.redirect(new URL('/access-denied', request.url))
    }
  }
  
  if (isAuthRedirectRoute && authToken && userType) {
    // User is authenticated, redirect to appropriate dashboard
    const dashboardPath = userType === 'teacher' ? '/teacher/dashboard' : '/student/dashboard'
    return NextResponse.redirect(new URL(dashboardPath, request.url))
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
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
} 