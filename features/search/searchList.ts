import {SearchEcho} from "@/features/search/searchTypes";
import {countryName} from "@/lib/appTypes";

export const SEARCH_SORTS = {
    DISTANCE: "distance",
    NAME: "name",
} as const;

function composeWhere(echo: SearchEcho, radiusKm: number | null): string | null {
    const place = echo.city ?? echo.voivodeship ?? countryName(echo.country);
    if (!place) return null;
    return radiusKm != null ? `within ${radiusKm} km of ${place}` : `in ${place}`;
}

export function composeTitle(echo: SearchEcho | undefined, radiusKm: number | null): string {
    if (!echo) return "Search results";
    const text = echo.q ?? echo.serviceName ?? echo.categoryName;
    const where = composeWhere(echo, radiusKm);
    if (!text) return where ? `All workshops ${where}` : "All workshops";
    return `Search results for: "${where ? `${text} ${where}` : text}"`;
}

export function composeEmptyMessage(echo: SearchEcho | undefined, radiusKm: number | null): string {
    if (!echo) return "No workshops found";
    const text = echo.q ?? echo.serviceName ?? echo.categoryName;
    const where = composeWhere(echo, radiusKm);
    if (text && where) return `No workshops ${where} offer "${text}"`;
    if (text) return `No workshops offer "${text}"`;
    if (where) return `No workshops ${where}`;
    return "No workshops found";
}

export function formatDistance(km: number): string {
    return `${km} km`;
}

export function formatDuration(minutes: number): string {
    return `~${minutes} min`;
}
