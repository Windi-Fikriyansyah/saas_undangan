import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Routes that require authentication
const protectedRoutes = ['/dashboard', '/admin', '/onboarding'];
// Routes that should redirect authenticated users away
const authRoutes = ['/signin', '/signup'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get the session token from the cookie
  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET 
  });
  
  const isAuthenticated = !!token;
  const isAdmin = !!(token as any)?.isAdmin;

  // 1. If user is authenticated and tries to access auth pages (signin/signup),
  //    redirect them to the appropriate dashboard
  if (isAuthenticated && authRoutes.some(route => pathname.startsWith(route))) {
    const redirectUrl = isAdmin ? '/admin' : '/dashboard';
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  // 2. If user is authenticated and accesses root ("/"), 
  //    redirect to appropriate dashboard (skip for subdomains/custom domains)
  if (isAuthenticated && pathname === '/') {
    const host = request.headers.get('host') || '';
    const mainDomain = process.env.NEXT_PUBLIC_MAIN_DOMAIN || 'saas-undangan.com';
    const isLocalhost = host.includes('localhost');
    const isMainDomain = host === mainDomain || host.endsWith('.' + (process.env.NEXT_PUBLIC_VERCEL_URL || ''));

    // Only redirect on main domain or localhost
    if (isLocalhost || isMainDomain) {
      const redirectUrl = isAdmin ? '/admin' : '/dashboard';
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }
  }

  // 3. If user is NOT authenticated and tries to access protected routes,
  //    redirect to signin
  if (!isAuthenticated && protectedRoutes.some(route => pathname.startsWith(route))) {
    const signinUrl = new URL('/signin', request.url);
    // Preserve the original URL so we can redirect back after login
    signinUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(signinUrl);
  }

  // 4. If non-admin user tries to access /admin routes, redirect to dashboard
  if (isAuthenticated && !isAdmin && pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes (API endpoints)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon)
     * - images directory (public images)
     * - assets directory (public assets)
     * - preview routes (public invitation previews)
     * - [slug] routes handled by page.tsx (public invitation pages)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images|assets|preview|preview-engine|scraped).*)',
  ],
};
