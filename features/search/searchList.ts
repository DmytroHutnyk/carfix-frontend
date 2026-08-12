import {SearchEcho} from "@/features/search/searchTypes";
import {countryName} from "@/lib/appTypes";

export const SEARCH_SORTS = {
    DISTANCE: "distance",
    NAME: "name",
} as const;

export function composeTitle(echo: SearchEcho | undefined): string {
    if (!echo) return "Search results";
    const text = echo.q ?? echo.serviceName ?? echo.categoryName;
    const place = echo.city ?? echo.voivodeship ?? countryName(echo.country);
    if (!text) return place ? `All workshops in ${place}` : "All workshops";
    return `Search results for: "${place ? `${text} in ${place}` : text}"`;
}

export function composeEmptyMessage(echo: SearchEcho | undefined): string {
    if (!echo) return "No workshops found";
    const text = echo.q ?? echo.serviceName ?? echo.categoryName;
    const place = echo.city ?? echo.voivodeship ?? countryName(echo.country);
    if (text && place) return `No workshops in ${place} offer "${text}"`;
    if (text) return `No workshops offer "${text}"`;
    if (place) return `No workshops in ${place}`;
    return "No workshops found";
}

export function formatDistance(km: number): string {
    return `${km} km`;
}

export function formatDuration(minutes: number): string {
    return `~${minutes} min`;
}
