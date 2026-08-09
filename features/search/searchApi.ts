import {clientApi} from "@/lib/clientApi";
import {isApiError} from "@/lib/apiTypes";
import {SearchLocationFilter, SearchSuggestions} from "@/features/search/searchTypes";

export const searchApi = {
    async getSuggestions(q: string, location: SearchLocationFilter | null): Promise<SearchSuggestions> {
        const params = new URLSearchParams({q});
        if (location?.city) params.set("city", location.city);
        if (location?.voivodeship) params.set("voivodeship", location.voivodeship);
        const result = await clientApi.get<SearchSuggestions>(`/search/suggestions?${params.toString()}`);
        if (isApiError(result)) throw result;
        return result;
    },
}
