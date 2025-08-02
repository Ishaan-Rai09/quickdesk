import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/tickets(.*)',
  '/profile(.*)',
]);

const isAgentRoute = createRouteMatcher([
  '/agent(.*)',
]);

const isAdminRoute = createRouteMatcher([
  '/admin(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  // Handle protected user routes
  if (isProtectedRoute(req)) {
    await auth.protect();
  }

  // Agent and admin routes don't use Clerk - handle separately
  if (isAgentRoute(req) || isAdminRoute(req)) {
    // Allow these routes to be handled by their own auth logic
    return NextResponse.next();
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
