/* Only same-origin paths — a full URL or "//host" would make the login page an open redirect. */
export function safeReturnTo(value: string | null): string | null {
    return value && value.startsWith("/") && !value.startsWith("//") ? value : null;
}

export function loginPathFor(pathname: string): string {
    return pathname.startsWith("/business") ? "/business/login" : "/login";
}

export function withReturnTo(loginPath: string, returnTo: string): string {
    return `${loginPath}?returnTo=${encodeURIComponent(returnTo)}`;
}
