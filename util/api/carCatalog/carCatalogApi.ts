import {clientApi} from "@/util/api/clientApi";
import {isApiError} from "@/util/types/apiTypes";
import {CarBrand, CarModel, ModelGeneration} from "@/util/types/carProfileTypes";

export const carCatalogApi = {
    async getBrands(): Promise<CarBrand[]> {
        const result = await clientApi.get<CarBrand[]>('/car-catalog/brands');
        if (isApiError(result)) throw result;
        return result;
    },

    async getModels(brandId: number): Promise<CarModel[]> {
        const result = await clientApi.get<CarModel[]>(`/car-catalog/brands/${brandId}/models`);
        if (isApiError(result)) throw result;
        return result;
    },

    async getGenerations(modelId: number): Promise<ModelGeneration[]> {
        const result = await clientApi.get<ModelGeneration[]>(`/car-catalog/models/${modelId}/generations`);
        if (isApiError(result)) throw result;
        return result;
    },
}
