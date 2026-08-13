import {keepPreviousData, useQuery} from "@tanstack/react-query";
import {searchApi} from "@/features/search/searchApi";
import {searchKeys} from "@/features/search/keys";
import {useSearchLocation} from "@/lib/store";
import {SearchLocationFilter} from "@/features/search/searchTypes";
import {useAuth} from "@/features/auth/useAuth";
import {useSelectedCarProfile} from "@/features/carProfile/useSelectedCarProfile";

export const MIN_QUERY_LENGTH = 2;

export function useSearchSuggestions(query: string) {
    const city = useSearchLocation((s) => s.searchLocation.city);
    const region = useSearchLocation((s) => s.searchLocation.region);
    const location: SearchLocationFilter | null =
        city || region ? {city, voivodeship: region} : null;

    const {isAuthenticated} = useAuth();
    const {selectedCarProfile} = useSelectedCarProfile({enabled: isAuthenticated});
    const carProfileId = selectedCarProfile?.id ?? null;

    const enabled = query.length >= MIN_QUERY_LENGTH;

    const suggestionsQuery = useQuery({
        queryKey: searchKeys.suggestions(query, location, carProfileId),
        queryFn: () => searchApi.getSuggestions(query, location, carProfileId),
        enabled,
        staleTime: 60_000,
        placeholderData: keepPreviousData,
    });

    return {
        suggestions: enabled ? suggestionsQuery.data : undefined,
        isLoading: enabled && suggestionsQuery.isPending,
    }
}
