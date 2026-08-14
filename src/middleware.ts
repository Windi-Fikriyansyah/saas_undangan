import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;



  return NextResponse.next();
}

export const config = {
  // Matcher for paths we want to intercept.
  // We ignore common Next.js paths and specific App routes to avoid unnecessary fetch requests
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|images|dashboard|admin|signin|signup|onboarding|scraped|assets).*)',
  ],
};
