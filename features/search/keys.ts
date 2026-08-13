import {PUBLIC_SCOPE} from "@/lib/scopes";
import {SearchLocationFilter, WorkshopSearchParams} from "@/features/search/searchTypes";

export const searchKeys = {
    all: [PUBLIC_SCOPE, 'search'] as const,
    suggestions: (q: string, location: SearchLocationFilter | null, carProfileId: string | null) =>
        [...searchKeys.all, 'suggestions', q, location, carProfileId] as const,
    workshops: (params: WorkshopSearchParams) =>
        [...searchKeys.all, 'workshops', params] as const,
}
