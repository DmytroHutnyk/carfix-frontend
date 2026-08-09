import {PUBLIC_SCOPE} from "@/lib/scopes";
import {SearchLocationFilter, WorkshopSearchParams} from "@/features/search/searchTypes";

export const searchKeys = {
    all: [PUBLIC_SCOPE, 'search'] as const,
    suggestions: (q: string, location: SearchLocationFilter | null) =>
        [...searchKeys.all, 'suggestions', q, location] as const,
    workshops: (params: WorkshopSearchParams) =>
        [...searchKeys.all, 'workshops', params] as const,
}
