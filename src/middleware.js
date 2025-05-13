import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware ({
  publicRoutes: [
    '/',
    '/sign-in(.*)',
    '/sign-up(.*)',
    '/api/webhooks(.*)',
    '/auth-redirect',
    '/loading',
    '/api/auth/status'  // Add this
  ],
  afterAuth(auth, req) {
    // Handle auth redirects
    if (auth.userId && req.nextUrl.pathname === '/auth-redirect') {
      const user = auth.user;
      const email = user.emailAddresses[0].emailAddress;
      
      // Your role detection logic
      let dashboard = '/students-dashboard';
      if (email.endsWith('@school.edu')) dashboard = '/dashboard';
      if (email.endsWith('@admin.edu')) dashboard = '/admin-dashboard';

      return Response.redirect(new URL(dashboard, req.url));
    }

    // Redirect unauthenticated users to sign-in
    if (!auth.userId && !auth.isPublicRoute) {
      return Response.redirect(new URL('/sign-in', req.url));
    }
  }
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)'],
};