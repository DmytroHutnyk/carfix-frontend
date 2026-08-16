import {clientApi} from "@/lib/clientApi";
import {isApiError} from "@/lib/apiTypes";
import {ServiceCategoryResponse} from "@/features/branchRegistration/branchRegistrationTypes";

export const serviceCategoryApi = {
    async getAll(): Promise<ServiceCategoryResponse[]> {
        const result = await clientApi.get<ServiceCategoryResponse[]>('/service-categories');
        if (isApiError(result)) throw result;
        return result;
    },
}
