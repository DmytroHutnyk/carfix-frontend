import {PUBLIC_SCOPE} from "@/lib/scopes";
import {SearchLocationFilter} from "@/features/search/searchTypes";

export const searchKeys = {
    all: [PUBLIC_SCOPE, 'search'] as const,
    suggestions: (q: string, location: SearchLocationFilter | null) =>
        [...searchKeys.all, 'suggestions', q, location] as const,
}
