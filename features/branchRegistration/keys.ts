import {PUBLIC_SCOPE} from "@/lib/scopes";

export const serviceCategoryKeys = {
    all: [PUBLIC_SCOPE, 'serviceCategories'] as const,
    list: () => [...serviceCategoryKeys.all, 'list'] as const,
}
