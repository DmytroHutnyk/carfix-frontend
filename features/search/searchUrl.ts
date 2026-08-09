import {ReadonlyURLSearchParams} from "next/navigation";
import {SearchLocation} from "@/lib/appTypes";
import {WorkshopSearchParams} from "@/features/search/searchTypes";

export type SearchIntent =
    | { kind: "text"; q: string }
    | { kind: "service"; serviceName: string }
    | { kind: "category"; categoryId: number }
    | { kind: "browse" };

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
            break;
        case "browse":
            break;
    }
    if (location.city) params.set("city", location.city);
    if (location.region) params.set("voivodeship", location.region);
    if (location.lat != null && location.lng != null) {
        params.set("lat", String(location.lat));
        params.set("lng", String(location.lng));
    }
    const qs = params.toString();
    return qs ? `/search?${qs}` : "/search";
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
        city: sp.get("city"),
        voivodeship: sp.get("voivodeship"),
        lat: toNumber(sp.get("lat")),
        lng: toNumber(sp.get("lng")),
        radiusKm: toNumber(sp.get("radiusKm")),
        carProfileId: sp.get("carProfileId"),
        size: toNumber(sp.get("size")),
    };
}

export function parseInitialPage(sp: ReadonlyURLSearchParams): number {
    const page = Number(sp.get("page"));
    return Number.isInteger(page) && page > 0 ? page : 0;
}
