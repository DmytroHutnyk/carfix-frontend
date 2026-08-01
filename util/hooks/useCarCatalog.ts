import {useQuery} from "@tanstack/react-query";
import {carCatalogApi} from "@/util/api/carCatalog/carCatalogApi";
import {carCatalogKeys} from "@/util/api/carCatalog/keys";

export function useCarCatalog(brandId: number | null, modelId: number | null) {
    const brandsQuery = useQuery({
        queryKey: carCatalogKeys.brands(),
        queryFn: carCatalogApi.getBrands,
        staleTime: Infinity,
    });

    const modelsQuery = useQuery({
        queryKey: carCatalogKeys.models(brandId ?? -1),
        queryFn: () => carCatalogApi.getModels(brandId!),
        enabled: brandId !== null,
        staleTime: Infinity,
    });

    const generationsQuery = useQuery({
        queryKey: carCatalogKeys.generations(modelId ?? -1),
        queryFn: () => carCatalogApi.getGenerations(modelId!),
        enabled: modelId !== null,
        staleTime: Infinity,
    });

    return {
        brands: brandsQuery.data ?? [],
        models: modelsQuery.data ?? [],
        generations: generationsQuery.data ?? [],
        isBrandsLoading: brandsQuery.isLoading,
        isModelsLoading: modelsQuery.isLoading,
        isGenerationsLoading: generationsQuery.isLoading,
    }
}
