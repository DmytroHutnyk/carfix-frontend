/* Only same-origin paths — anything the URL parser resolves to another origin ("//host", "/\host", full URLs) would make the login page an open redirect. */
export function safeReturnTo(value: string | null): string | null {
    if (!value || !value.startsWith("/")) return null;
    try {
        const url = new URL(value, "http://carfix.local");
        return url.origin === "http://carfix.local" ? url.pathname + url.search + url.hash : null;
    } catch {
        return null;
    }
}

export function loginPathFor(pathname: string): string {
    return pathname.startsWith("/business") ? "/business/login" : "/login";
}

export function withReturnTo(loginPath: string, returnTo: string): string {
    return `${loginPath}?returnTo=${encodeURIComponent(returnTo)}`;
}
