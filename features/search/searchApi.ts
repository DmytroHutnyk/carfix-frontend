import {clientApi} from "@/lib/clientApi";
import {isApiError} from "@/lib/apiTypes";
import {
    SearchLocationFilter,
    SearchSuggestions,
    WorkshopSearchPage,
    WorkshopSearchParams
} from "@/features/search/searchTypes";

export const searchApi = {
    async getSuggestions(q: string, location: SearchLocationFilter | null,
                         carProfileId: string | null): Promise<SearchSuggestions> {
        const params = new URLSearchParams({q});
        if (location?.city) params.set("city", location.city);
        if (location?.voivodeship) params.set("voivodeship", location.voivodeship);
        if (carProfileId) params.set("carProfileId", carProfileId);
        const result = await clientApi.get<SearchSuggestions>(`/search/suggestions?${params.toString()}`);
        if (isApiError(result)) throw result;
        return result;
    },

    async searchWorkshops(params: WorkshopSearchParams, page: number): Promise<WorkshopSearchPage> {
        const query = new URLSearchParams();
        if (params.q) query.set("q", params.q);
        if (params.serviceName) query.set("serviceName", params.serviceName);
        if (params.categoryId != null) query.set("categoryId", String(params.categoryId));
        if (params.city) query.set("city", params.city);
        if (params.voivodeship) query.set("voivodeship", params.voivodeship);
        if (params.country) query.set("country", params.country);
        if (params.lat != null && params.lng != null) {
            query.set("lat", String(params.lat));
            query.set("lng", String(params.lng));
        }
        if (params.radiusKm != null) query.set("radiusKm", String(params.radiusKm));
        if (params.carProfileId) query.set("carProfileId", params.carProfileId);
        if (params.sort) query.set("sort", params.sort);
        if (params.pinnedBranchId) query.set("pinnedBranchId", params.pinnedBranchId);
        if (params.size != null) query.set("size", String(params.size));
        if (params.from && params.to) {
            query.set("from", params.from);
            query.set("to", params.to);
            if (params.timeFrom) query.set("timeFrom", params.timeFrom);
            if (params.timeTo) query.set("timeTo", params.timeTo);
        }
        query.set("page", String(page));
        const result = await clientApi.get<WorkshopSearchPage>(`/search/workshops?${query.toString()}`);
        if (isApiError(result)) throw result;
        return result;
    },
}
