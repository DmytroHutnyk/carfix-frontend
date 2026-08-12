/*Interface and location search engine language*/
export type Language = "EN" | "PL" | "UK";

/*location search engine country restriction*/
export type CountryCode = "PL" | "DE" | "FR" | "ES" | "IT" | "GB" | "UA" | "US" | "CA";

/*used for grouping the countries in selection bar*/
type Continent = "Europe" | "North America";

/*Used for zustand state (useSearchLocation) to keep one source of truth location restriction for location search engine */
export interface SearchLocation {
    city: string | null,
    region: string | null,
    country: CountryCode,
    lat: number | null,
    lng: number | null,
}

export interface Country {
    code: CountryCode;
    name: string;
    continent: Continent;
}

/*to move somewhere else?*/
export const LANGUAGES: Language[] = ["EN", "PL", "UK"];

export const COUNTRIES: Country[] = [
    { code: "PL", name: "Poland",  continent: "Europe" },
    { code: "DE", name: "Germany", continent: "Europe" },
    { code: "FR", name: "France",  continent: "Europe" },
    { code: "ES", name: "Spain",   continent: "Europe" },
    { code: "IT", name: "Italy",   continent: "Europe" },
    { code: "GB", name: "United Kingdom", continent: "Europe" },
    { code: "UA", name: "Ukraine", continent: "Europe" },
    { code: "US", name: "United States",  continent: "North America" },
    { code: "CA", name: "Canada",  continent: "North America" },
];

export const FLAG_PLACEHOLDERS: Record<CountryCode, string> = {
    PL: "🇵🇱", DE: "🇩🇪", FR: "🇫🇷", ES: "🇪🇸",
    IT: "🇮🇹", GB: "🇬🇧", UA: "🇺🇦", US: "🇺🇸", CA: "🇨🇦",
};

/* Inclusive date range used by filters; ISO date strings ("2026-08-12"), nulls mean unbounded */
export interface DateRangeValue {
    from: string | null;
    to: string | null;
}

export const EMPTY_DATE_RANGE: DateRangeValue = {from: null, to: null};

/* Capital-city centres. A search with no city still needs a point to measure a radius
   from and to show distances against; this is that point. Coordinates are the capitals'
   city centres */
export const COUNTRY_CENTERS: Record<CountryCode, { lat: number; lng: number }> = {
    PL: { lat: 52.2297, lng: 21.0122 },   // Warsaw
    DE: { lat: 52.5200, lng: 13.4050 },   // Berlin
    FR: { lat: 48.8566, lng: 2.3522 },    // Paris
    ES: { lat: 40.4168, lng: -3.7038 },   // Madrid
    IT: { lat: 41.9028, lng: 12.4964 },   // Rome
    GB: { lat: 51.5074, lng: -0.1278 },   // London
    UA: { lat: 50.4501, lng: 30.5234 },   // Kyiv
    US: { lat: 38.9072, lng: -77.0369 },  // Washington, D.C.
    CA: { lat: 45.4215, lng: -75.6972 },  // Ottawa
};

/* The wire carries ISO codes; the UI shows names. Unknown codes pass through unchanged
   rather than disappearing, so a stale URL still reads sensibly. */
export function countryName(code: string | null): string | null {
    if (!code) return null;
    return COUNTRIES.find((country) => country.code === code)?.name ?? code;
}
