export type Language = "EN" | "PL" | "UK";

export type CountryCode = "PL" | "DE" | "FR" | "ES" | "IT" | "GB" | "UA" | "US" | "CA";

type Continent = "Europe" | "North America";

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

export interface DateRangeValue {
    from: string | null;
    to: string | null;
}

export const EMPTY_DATE_RANGE: DateRangeValue = {from: null, to: null};

// Country centers anchor radius searches that have no city.
export const COUNTRY_CENTERS: Record<CountryCode, { lat: number; lng: number }> = {
    PL: { lat: 52.2297, lng: 21.0122 },
    DE: { lat: 52.5200, lng: 13.4050 },
    FR: { lat: 48.8566, lng: 2.3522 },
    ES: { lat: 40.4168, lng: -3.7038 },
    IT: { lat: 41.9028, lng: 12.4964 },
    GB: { lat: 51.5074, lng: -0.1278 },
    UA: { lat: 50.4501, lng: 30.5234 },
    US: { lat: 38.9072, lng: -77.0369 },
    CA: { lat: 45.4215, lng: -75.6972 },
};

export function isCountryCode(code: string | null | undefined): code is CountryCode {
    return code != null && code in COUNTRY_CENTERS;
}

// Preserve unknown codes so stale URLs remain readable.
export function countryName(code: string | null): string | null {
    if (!code) return null;
    return COUNTRIES.find((country) => country.code === code)?.name ?? code;
}
