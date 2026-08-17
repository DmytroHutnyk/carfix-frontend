import {NextRequest, NextResponse} from "next/server";

export function proxy(request: NextRequest) {
    if (!request.cookies.has("JSESSIONID")) {
        return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
}

export const config = {
    matcher: [
        "/profile", "/profile/:path*",
        "/cars", "/cars/:path*",
        "/bookings", "/bookings/:path*",
        "/business/branches", "/business/branches/:path*",
        "/business/subscriptions", "/business/statistics", "/business/contact", "/business/faq",
    ],
};
