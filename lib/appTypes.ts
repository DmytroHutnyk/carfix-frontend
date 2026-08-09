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
