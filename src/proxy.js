import { NextResponse } from 'next/server';
import { validateSession } from './utils/sessionValidator';

const ignoredPaths = [
  '/api/auth/verify_session',
  '/api/auth/signup',
  '/api/auth/login',
  // '/api/reset_password',
  // '/api/validate_reset_token',
  // '/api/update_password',
];

// const protectedApiRoutes = {
//   '/api/products/*': ['admin', 'manager', 'user'],
//   '/api/orders/*': ['admin', 'manager', 'user'],
//   '/api/users/*': ['admin', 'manager'],
//   '/api/orders/view': ['admin', 'manager', 'user'],
//   '/api/products/view': ['admin', 'manager', 'user'],
//   '/api/products/create': ['admin'],
//   '/api/products/update': ['admin'],
//   '/api/products/delete': ['admin'],
// };

export default async function proxy(request) {
  //Enable this to bypass the proxy
  // return NextResponse.next();

  if (ignoredPaths.includes(request.nextUrl.pathname)) {
    console.log("Ignored path: ", request.nextUrl.pathname);
    return NextResponse.next();
  }

  const validationResult = await validateSession(request);

  if (validationResult.success) {
    // Add sessionToken to request headers
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-session-token', JSON.stringify(validationResult.sessionToken));

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } else {
    console.log("Proxy: Session validation failed for path:", request.nextUrl.pathname);
    return NextResponse.json({
      success: false,
      errorCode: validationResult.errorCode || 'UNAUTHORIZED',
      message: validationResult.message || 'Session Failed',
      path: validationResult.path,
    }, {
      status: validationResult.status || 401,
    });
  }
}

export const config = {
  matcher: ['/api/:path*'],
};
