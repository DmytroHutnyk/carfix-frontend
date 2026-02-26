export interface User {
    id: string;
    name: string;
    surname: string;
    phoneCountryCode: string;
    phoneNumber: string;
    email: string;
    role: string;
    dateOfBirth: string | null;
    customerStatus: string;
}

export type Language = "EN" | "PL" | "UK";
export const LANGUAGES: Language[] = ["EN", "PL", "UK"];

export type RegionCode = "PL" | "DE" | "FR" | "ES" | "IT" | "GB" | "US" | "CA" | "MX";

export interface Region {
    code: RegionCode;
    name: string;
    continent: "Europe" | "North America";
}

export const REGIONS: Region[] = [
    { code: "PL", name: "Poland",  continent: "Europe" },
    { code: "DE", name: "Germany", continent: "Europe" },
    { code: "FR", name: "France",  continent: "Europe" },
    { code: "ES", name: "Spain",   continent: "Europe" },
    { code: "IT", name: "Italy",   continent: "Europe" },
    { code: "GB", name: "United Kingdom", continent: "Europe" },
    { code: "US", name: "United States",  continent: "North America" },
    { code: "CA", name: "Canada",  continent: "North America" },
    { code: "MX", name: "Mexico",  continent: "North America" },
];

export const FLAG_PLACEHOLDERS: Record<RegionCode, string> = {
    PL: "🇵🇱", DE: "🇩🇪", FR: "🇫🇷", ES: "🇪🇸",
    IT: "🇮🇹", GB: "🇬🇧", US: "🇺🇸", CA: "🇨🇦", MX: "🇲🇽",
};
