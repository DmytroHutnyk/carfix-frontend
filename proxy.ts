import {NextRequest, NextResponse} from "next/server";

export function proxy(request: NextRequest) {
    if (request.cookies.has("JSESSIONID")) return NextResponse.next();
    const {pathname, search} = request.nextUrl;
    const url = new URL(pathname.startsWith("/business") ? "/business/login" : "/login", request.url);
    url.searchParams.set("returnTo", pathname + search);
    return NextResponse.redirect(url);
}

export const config = {
    matcher: [
        "/profile", "/profile/:path*",
        "/cars", "/cars/:path*",
        "/bookings", "/bookings/:path*",
        "/business/branches", "/business/branches/:path*",
        "/business/profile",
        "/business/subscriptions", "/business/statistics",
    ],
};
