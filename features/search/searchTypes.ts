// Backend wire contract: SearchSuggestionsResponse and its three nested records
export interface ServiceSuggestion {
    name: string;
    categoryName: string;
}

export interface CategorySuggestion {
    categoryId: number;
    name: string;
}

export interface WorkshopSuggestion {
    branchId: string;
    name: string;
}

export interface SearchSuggestions {
    services: ServiceSuggestion[];
    categories: CategorySuggestion[];
    workshops: WorkshopSuggestion[];
}

export type SearchSuggestion =
    | ({ kind: "service" } & ServiceSuggestion)
    | ({ kind: "category" } & CategorySuggestion)
    | ({ kind: "workshop" } & WorkshopSuggestion);

export interface SearchLocationFilter {
    city: string | null;
    voivodeship: string | null;
}

// Backend wire contract: WorkshopSearchPageResponse and its nested records
export interface MatchedService {
    serviceId: number;
    name: string;
    price: number;
    durationMinutes: number;
    categoryName: string;
}

export interface WorkshopResult {
    branchId: string;
    name: string;
    streetName: string;
    buildingNumber: string;
    city: string;
    latitude: number;
    longitude: number;
    distanceKm: number | null;
    rating: number | null;
    reviewCount: number | null;
    matchedServices: MatchedService[];
}

export interface SearchEcho {
    q: string | null;
    serviceName: string | null;
    categoryId: number | null;
    categoryName: string | null;
    city: string | null;
    voivodeship: string | null;
    country: string | null;
}

export interface WorkshopSearchPage {
    content: WorkshopResult[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    echo: SearchEcho;
}

/* Everything /search reads from its URL, minus paging (the hook owns page). */
export interface WorkshopSearchParams {
    q: string | null;
    serviceName: string | null;
    categoryId: number | null;
    city: string | null;
    voivodeship: string | null;
    lat: number | null;
    lng: number | null;
    radiusKm: number | null;
    carProfileId: string | null;
    size: number | null;
}
