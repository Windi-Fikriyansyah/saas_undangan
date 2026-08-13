import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Intercept Preview Scraped Templates
  if (pathname.startsWith('/preview/template/')) {
    const id = pathname.split('/').pop();
    if (id) {
      try {
        const res = await fetch(`${request.nextUrl.origin}/api/internal/check-scrape?type=template&id=${id}`);
        const data = await res.json();
        if (data.isScraped) {
          // Rewrite to render raw HTML API
          return NextResponse.rewrite(new URL(`/api/render-raw/template/${id}`, request.url));
        }
      } catch (error) {
        // Fallback to normal rendering if fetch fails
      }
    }
  } 
  
  // 2. Intercept Live Client Scraped Templates (Slug)
  // Check if it's a root slug by ensuring it doesn't match other known routes
  // The matcher already ignores /api, /_next, etc., but we should be careful
  // A root slug looks like "/romeo-juliet"
  else {
    const slug = pathname.substring(1); // remove leading slash
    
    // We only care about root level slugs, not nested paths like /admin/vendors
    if (slug && !slug.includes('/')) {
      try {
        const res = await fetch(`${request.nextUrl.origin}/api/internal/check-scrape?type=slug&id=${slug}`);
        if (res.ok) {
          const data = await res.json();
          if (data.isScraped) {
            // Rewrite to render raw HTML API, preserving search params
            return NextResponse.rewrite(new URL(`/api/render-raw/slug/${slug}${request.nextUrl.search}`, request.url));
          }
        }
      } catch (error) {
        // Fallback to normal rendering
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  // Matcher for paths we want to intercept.
  // We ignore common Next.js paths and specific App routes to avoid unnecessary fetch requests
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|images|dashboard|admin|signin|signup|onboarding|scraped|assets).*)',
  ],
};
