import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// 1. Define route matchers
const isAdminRoute = createRouteMatcher(['/admin(.*)']);
const isEventMutationRoute = createRouteMatcher(['/api/events(.*)']);
const isAuthRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)']);

export default clerkMiddleware(async (auth, req) => {
  const session = await auth();
  const role = session.sessionClaims?.metadata?.role;
  const { searchParams } = req.nextUrl;

  // --------------------------------------------------------
  // Rule A: Handing /sign-in and /sign-up attempts
  // --------------------------------------------------------
  if (isAuthRoute(req)) {
    // If they are already an authenticated admin, send them straight to dashboard
    if (session.userId && role === 'admin') {
      return NextResponse.redirect(new URL('/admin', req.url));
    }

    // Decode the redirect_url parameter to look for admin intent
    const rawRedirect = searchParams.get('redirect_url') || '';
    const decodedRedirect = decodeURIComponent(rawRedirect);
    const hasAdminRedirect = decodedRedirect.endsWith('/admin');
    
    // CHANGE: If a random guest types /sign-in or /sign-up manually, return a 404
    if (!session.userId && !hasAdminRedirect) {
      return new NextResponse(null, { status: 404 });
    }
  }

  // --------------------------------------------------------
  // Rule B: Standard protection for /admin and API mutations
  // --------------------------------------------------------
  if (isAdminRoute(req) || (isEventMutationRoute(req) && req.method !== 'GET')) {
    // Guard 1: If they aren't logged in at all, force redirect to sign-in
    if (!session.userId) {
      return session.redirectToSignIn({ returnBackUrl: req.url });
    }

    // CHANGE: If they are logged into Clerk but DO NOT have the admin role, return a 404
    if (role !== 'admin') {
      return new NextResponse(null, { status: 404 });
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};