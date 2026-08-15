import {countryName, isCountryCode, SearchLocation} from "@/lib/appTypes";
import {useSearchLocation} from "@/lib/store";
import {Location} from "@/features/user/userTypes";

export function locationLabel(location: Location | null): string {
    if (!location) return "";
    const named = [location.city, location.region].filter(Boolean).join(", ");
    return named || countryName(location.countryIso) || location.countryIso;
}

/* The header only knows the supported search countries; anything else cannot be applied. */
export function toSearchLocation(location: Location): SearchLocation | null {
    if (!isCountryCode(location.countryIso)) return null;
    return {
        city: location.city,
        region: location.region,
        country: location.countryIso,
        lat: location.latitude,
        lng: location.longitude,
    };
}

export function sameLocation(a: Location | null, b: Location | null): boolean {
    if (a === b) return true;
    if (!a || !b) return false;
    return a.city === b.city
        && a.region === b.region
        && a.countryIso === b.countryIso
        && a.latitude === b.latitude
        && a.longitude === b.longitude;
}

/* Writing into the persisted search-location store is what "prefill the header" means —
   SearchRow reads that store, and the cookie makes it survive reloads. */
export function applyPreferredLocation(location: Location | null): void {
    const next = location ? toSearchLocation(location) : null;
    if (next) useSearchLocation.getState().setSearchLocation(next);
}
