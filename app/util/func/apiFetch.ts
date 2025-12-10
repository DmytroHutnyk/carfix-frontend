import {fetch} from "next/dist/compiled/@edge-runtime/primitives";


export async function apiFetch (
    url: string,
    options: RequestInit = {},
    onUnauthorized?: () => void,
) {
    const response = await fetch(url, {
        ...options,
        credentials: "include",
    });

    if(response.status === 401 || response.status === 403){
        localStorage.removeItem("user");
    }

    if (onUnauthorized) {
        onUnauthorized();
    } else {
        if (typeof window !== 'undefined') {
            window.location.href = '/login'; //TODO, a better way?
        }
    }

    return response;
}