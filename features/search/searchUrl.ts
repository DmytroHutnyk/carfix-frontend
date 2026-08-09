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
 * The one place a /search URL is minted. Every navigation into the results page goes
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
            /* The header shows this; categoryId alone is not renderable */
            params.set("label", intent.name);
            break;
        case "workshop":
            /* Picking a workshop searches by its name and pins it to the top, rather than
               jumping straight to that one workshop — the customer still wants to compare. */
            params.set("q", intent.name);
            params.set("pinnedBranchId", intent.branchId);
            break;
        case "browse":
            break;
    }

    if (location.city) params.set("city", location.city);
    if (location.region) params.set("voivodeship", location.region);
    params.set("country", location.country);

    const hasCityCoordinates = location.lat != null && location.lng != null;
    const center = hasCityCoordinates
        ? {lat: location.lat as number, lng: location.lng as number}
        : COUNTRY_CENTERS[location.country];
    params.set("lat", String(center.lat));
    params.set("lng", String(center.lng));

    /* Distance ranking only means something around a chosen city. Country-wide, the
       capital is just a measuring point, so the list stays alphabetical. */
    params.set("sort", hasCityCoordinates ? SEARCH_SORTS.DISTANCE : SEARCH_SORTS.NAME);

    return `/search?${params.toString()}`;
}

function toNumber(value: string | null): number | null {
    if (value == null || value === "") return null;
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
}

export function parseSearchParams(sp: ReadonlyURLSearchParams): WorkshopSearchParams {
    return {
        q: sp.get("q"),
        serviceName: sp.get("serviceName"),
        categoryId: toNumber(sp.get("categoryId")),
        label: sp.get("label"),
        city: sp.get("city"),
        voivodeship: sp.get("voivodeship"),
        country: sp.get("country"),
        lat: toNumber(sp.get("lat")),
        lng: toNumber(sp.get("lng")),
        radiusKm: toNumber(sp.get("radiusKm")),
        carProfileId: sp.get("carProfileId"),
        sort: sp.get("sort"),
        pinnedBranchId: sp.get("pinnedBranchId"),
        size: toNumber(sp.get("size")),
    };
}

export function parseInitialPage(sp: ReadonlyURLSearchParams): number {
    const page = Number(sp.get("page"));
    return Number.isInteger(page) && page > 0 ? page : 0;
}

/**
 * What the search field shows for the current URL. `label` first because it is the only
 * readable form of a category search; then the two params that are already text.
 */
export function searchTextFromParams(params: WorkshopSearchParams): string {
    return params.label ?? params.q ?? params.serviceName ?? "";
}
