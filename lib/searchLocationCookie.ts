import {isCountryCode, SearchLocation} from "@/lib/appTypes";

export const SEARCH_LOCATION_COOKIE = "search-location-storage";

export const DEFAULT_SEARCH_LOCATION: SearchLocation = {
    city: null,
    region: null,
    country: "PL",
    lat: null,
    lng: null,
};

/* Zustand persist envelope, URL-encoded: {"state":{"searchLocation":{...}},"version":1} */
export function parseSearchLocationCookie(raw: string | undefined): SearchLocation {
    if (!raw) return DEFAULT_SEARCH_LOCATION;
    try {
        const envelope = JSON.parse(decodeURIComponent(raw)) as {
            state?: { searchLocation?: Partial<SearchLocation> };
        };
        const stored = envelope.state?.searchLocation;
        if (!stored) return DEFAULT_SEARCH_LOCATION;
        return {
            city: stored.city ?? null,
            region: stored.region ?? null,
            country: isCountryCode(stored.country) ? stored.country : "PL",
            lat: stored.lat ?? null,
            lng: stored.lng ?? null,
        };
    } catch {
        return DEFAULT_SEARCH_LOCATION;
    }
}
