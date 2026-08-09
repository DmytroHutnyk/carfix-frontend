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
