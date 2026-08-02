import {PUBLIC_SCOPE} from "@/util/api/scopes";

export const carCatalogKeys = {
    all: [PUBLIC_SCOPE, 'carCatalog'] as const,
    brands: () => [...carCatalogKeys.all, 'brands'] as const,
    models: (brandId: number) => [...carCatalogKeys.all, 'models', brandId] as const,
    generations: (modelId: number) => [...carCatalogKeys.all, 'generations', modelId] as const,
}
