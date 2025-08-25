import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export async function middleware(req: any) {
    const token = await getToken({
        req,
        secret: process.env.AUTH_SECRET,
    });

    console.log('Token', token)

    const isAuthenticated = !!token;

    if (req.nextUrl.pathname === '/' && isAuthenticated) {
        return NextResponse.redirect(new URL('/app', req.url));
    }

    const protectedPaths = ['/app'];
    const isProtected = protectedPaths.some((path) =>
        req.nextUrl.pathname.startsWith(path)
    );

    if (isProtected && !isAuthenticated) {
        return NextResponse.redirect(new URL('/auth/login', req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/', '/app', '/app/role', '/app/:path*']
};
