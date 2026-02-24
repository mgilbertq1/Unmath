import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, COOKIE_NAME } from '@/lib/auth';

// Public routes that don't require auth
const PUBLIC_PATHS = [
    '/welcome',
    '/login',
    '/register',
    '/welcome-done',
    '/api/auth/login',
    '/api/auth/register',
    '/_next',
    '/favicon.ico',
];

function isPublicPath(pathname: string): boolean {
    return PUBLIC_PATHS.some((p) => pathname.startsWith(p));
}

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Always allow public paths and static assets
    if (isPublicPath(pathname)) {
        // If user is already logged in and tries to access main auth pages, redirect to home
        if (pathname === '/welcome' || pathname === '/login' || pathname === '/register') {
            const token = request.cookies.get(COOKIE_NAME)?.value;
            if (token) {
                const payload = await verifyToken(token);
                if (payload) {
                    return NextResponse.redirect(new URL('/', request.url));
                }
            }
        }
        return NextResponse.next();
    }

    // Check auth for all other routes
    const token = request.cookies.get(COOKIE_NAME)?.value;
    if (!token) {
        return NextResponse.redirect(new URL('/welcome', request.url));
    }

    const payload = await verifyToken(token);
    if (!payload) {
        // Invalid/expired token — redirect to welcome
        const response = NextResponse.redirect(new URL('/welcome', request.url));
        response.cookies.set(COOKIE_NAME, '', { expires: new Date(0), path: '/' });
        return response;
    }

    // Attach user info to request headers for downstream use
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', payload.userId);
    requestHeaders.set('x-username', payload.username);

    return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|public/).*)',
    ],
};
