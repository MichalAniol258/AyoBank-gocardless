import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';


export async function middleware(req: NextRequest) {

    if (
        req.nextUrl.pathname.startsWith("/_next") ||
        req.nextUrl.pathname.startsWith("/images") ||
        req.nextUrl.pathname.startsWith("/favicon.ico") ||
        req.nextUrl.pathname.startsWith("/public") ||
        req.nextUrl.pathname.startsWith("/api/accounts") ||
        req.nextUrl.pathname.startsWith("/api/balance") ||
        req.nextUrl.pathname.startsWith("/api/transactions")
    ) {
        return NextResponse.next();
    }

    const userInfoCookie = req.cookies.get('requisitionId')?.value;



    const isLoginPage = req.nextUrl.pathname.startsWith('/main');


    if (!userInfoCookie && isLoginPage) {
        return NextResponse.redirect(new URL('/', req.url));
    }

    if (userInfoCookie && !isLoginPage) {
        return NextResponse.redirect(new URL('/main', req.url));
    }


    return NextResponse.next();
}
