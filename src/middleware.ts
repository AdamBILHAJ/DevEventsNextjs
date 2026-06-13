// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// 1. Define route matchers
const isAdminRoute = createRouteMatcher(['/admin(.*)']);
const isEventMutationRoute = createRouteMatcher(['/api/events(.*)']);
const isAuthRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)']);

export default clerkMiddleware(async (auth, req) => {
  const session = await auth();
  const role = session.sessionClaims?.metadata?.role;
  const { pathname, searchParams } = req.nextUrl;

  // Rule A: If trying to access /sign-in or /sign-up
  if (isAuthRoute(req)) {
    // If they are already an authenticated admin, send them straight to dashboard
    if (session.userId && role === 'admin') {
      return NextResponse.redirect(new URL('/admin', req.url));
    }

    // Crucial Guard: To allow you to log in, we MUST let the request pass through 
    // IF it originates from trying to access the admin panel (Clerk appends redirect_url)
    const hasAdminRedirect = searchParams.get('redirect_url')?.includes('/admin');
    
    // If it's a random guest typing /sign-in manually from the base URL without an admin redirect intent
    if (!session.userId && !hasAdminRedirect) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  // Rule B: Standard protection for /admin and API mutations
  if (isAdminRoute(req) || (isEventMutationRoute(req) && req.method !== 'GET')) {
    // Guard 1: If they aren't logged in at all, force redirect to sign-in
    if (!session.userId) {
      return session.redirectToSignIn();
    }

    // Guard 2: Check for the custom admin role claim
    if (role !== 'admin') {
      return new NextResponse('Forbidden: Admin access required', { status: 403 });
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};