import {ReadonlyURLSearchParams} from "next/navigation";
import {COUNTRY_CENTERS, SearchLocation} from "@/lib/appTypes";
import {WorkshopSearchParams} from "@/features/search/searchTypes";
import {SEARCH_SORTS} from "@/features/search/searchList";

export type SearchIntent =
    | { kind: "text"; q: string }
    | { kind: "service"; serviceName: string }
    | { kind: "category"; categoryId: number; name: string }
    | { kind: "workshop"; branchId: string; name: string }
    | { kind: "browse" };

/**
 * The one place a /search URL is created. Every navigation into the results page goes
 * through here, so the page can treat its URL as complete and never fall back to store
 * state it cannot see.
 */
export function buildSearchUrl(intent: SearchIntent, location: SearchLocation): string {
    const params = new URLSearchParams();

    switch (intent.kind) {
        case "text":
            params.set("q", intent.q);
            break;
        case "service":
            params.set("serviceName", intent.serviceName);
            break;
        case "category":
            params.set("categoryId", String(intent.categoryId));
            params.set("label", intent.name);
            break;
        case "workshop":
            params.set("q", intent.name);
            params.set("pinnedBranchId", intent.branchId);
            break;
        case "browse":
            break;
    }

    if (location.city) params.set("city", location.city);
    if (location.region) params.set("voivodeship", location.region);

    // always set from the toggle
    params.set("country", location.country);

    const hasCityCoordinates = location.lat != null && location.lng != null;
    const center = hasCityCoordinates
        ? {lat: location.lat as number, lng: location.lng as number}
        : COUNTRY_CENTERS[location.country];
    params.set("lat", String(center.lat));
    params.set("lng", String(center.lng));

    params.set("sort", hasCityCoordinates ? SEARCH_SORTS.DISTANCE : SEARCH_SORTS.NAME);

    return `/search?${params.toString()}`;
}

function toNumber(value: string | null): number | null {
    if (value == null || value === "") return null;
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
}

const isIsoDate = (value: string | null): value is string =>
    !!value && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(new Date(value + "T00:00:00").getTime());

const asTimeOfDay = (value: string | null) => (/^\d{2}:\d{2}$/.test(value ?? "") ? value : null);

export function parseSearchParams(sp: ReadonlyURLSearchParams): WorkshopSearchParams {
    const serviceName = sp.get("serviceName");
    const from = sp.get("from");
    const to = sp.get("to");
    /* Availability only exists for a concrete service and needs a well-formed pair of dates — a stale or hand-edited URL must not become a 400 or a render crash */
    const hasRange = !!serviceName && isIsoDate(from) && isIsoDate(to) && from <= to;
    const timeFrom = hasRange ? asTimeOfDay(sp.get("timeFrom")) : null;
    const timeTo = hasRange ? asTimeOfDay(sp.get("timeTo")) : null;
    const times = timeFrom && timeTo && timeFrom >= timeTo ? {timeFrom: null, timeTo: null} : {timeFrom, timeTo};
    return {
        q: sp.get("q"),
        serviceName,
        categoryId: toNumber(sp.get("categoryId")),
        label: sp.get("label"),
        city: sp.get("city"),
        voivodeship: sp.get("voivodeship"),
        country: sp.get("country"),
        lat: toNumber(sp.get("lat")),
        lng: toNumber(sp.get("lng")),
        radiusKm: toNumber(sp.get("radiusKm")),
        /* Filled from the selected car by the results page, never from the URL */
        carProfileId: null,
        allBrands: sp.get("allBrands") != null,
        sort: sp.get("sort"),
        pinnedBranchId: sp.get("pinnedBranchId"),
        size: toNumber(sp.get("size")),
        from: hasRange ? from : null,
        to: hasRange ? to : null,
        ...times,
    };
}

export function parseInitialPage(sp: ReadonlyURLSearchParams): number {
    const page = Number(sp.get("page"));
    return Number.isInteger(page) && page > 0 ? page : 0;
}

export function searchTextFromParams(params: WorkshopSearchParams): string {
    return params.label ?? params.q ?? params.serviceName ?? "";
}

/* The card hands the searched service (and the availability range) to the workshop page, which preselects them */
export function buildBranchUrl(branchId: string, params: WorkshopSearchParams): string {
    const query = new URLSearchParams();
    if (params.serviceName) {
        query.set("service", params.serviceName);
        if (params.from && params.to) {
            query.set("from", params.from);
            query.set("to", params.to);
        }
    }
    const qs = query.toString();
    return qs ? `/branches/${branchId}?${qs}` : `/branches/${branchId}`;
}
