import {AvailableStart, SearchAvailability, SearchEcho, WorkshopSearchParams} from "@/features/search/searchTypes";
import {formatDayMonth, formatDayOfWeek} from "@/features/slots/slotList";
import {countryName} from "@/lib/appTypes";

export const SEARCH_SORTS = {
    DISTANCE: "distance",
    NAME: "name",
} as const;

export const AVAILABILITY_PARAMS = ["from", "to", "timeFrom", "timeTo"] as const;

const TIME_WINDOW_FIRST_HOUR = 6;
const TIME_WINDOW_LAST_HOUR = 22;
export const TIME_WINDOW_OPTIONS: string[] = Array.from(
    {length: TIME_WINDOW_LAST_HOUR - TIME_WINDOW_FIRST_HOUR + 1},
    (_, i) => `${String(TIME_WINDOW_FIRST_HOUR + i).padStart(2, "0")}:00`,
);

export function hasAvailabilityFilter(
    params: Pick<WorkshopSearchParams, "from" | "to">,
): params is Pick<WorkshopSearchParams, "from" | "to"> & { from: string; to: string } {
    return params.from != null && params.to != null;
}

export function formatAvailabilityLabel({from, to, timeFrom, timeTo}: SearchAvailability): string {
    const days = from === to ? formatDayMonth(from) : `${formatDayMonth(from)} – ${formatDayMonth(to)}`;
    const time = timeFrom && timeTo ? `${timeFrom}–${timeTo}`
        : timeFrom ? `from ${timeFrom}`
            : timeTo ? `until ${timeTo}`
                : null;
    return time ? `${days} · ${time}` : days;
}

export function formatStartLabel(start: AvailableStart, singleDay: boolean): string {
    return singleDay
        ? start.startTime
        : `${formatDayOfWeek(start.date)}, ${formatDayMonth(start.date)} · ${start.startTime}`;
}

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
    const when = echo.availability ? ` with a free slot on ${formatAvailabilityLabel(echo.availability)}` : "";
    if (text && where) return `No workshops ${where} offer "${text}"${when}`;
    if (text) return `No workshops offer "${text}"${when}`;
    if (where) return `No workshops ${where}`;
    return "No workshops found";
}

export function formatDistance(km: number): string {
    return `${km} km`;
}

export function formatDuration(minutes: number): string {
    return `~${minutes} min`;
}
