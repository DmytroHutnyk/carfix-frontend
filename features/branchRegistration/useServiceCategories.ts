import {useQuery} from "@tanstack/react-query";
import {serviceCategoryApi} from "@/features/branchRegistration/serviceCategoryApi";
import {serviceCategoryKeys} from "@/features/branchRegistration/keys";

export function useServiceCategories() {
    const query = useQuery({
        queryKey: serviceCategoryKeys.list(),
        queryFn: serviceCategoryApi.getAll,
        staleTime: Infinity,
    });

    return {
        categories: query.data ?? [],
        isLoading: query.isLoading,
        isError: query.isError,
    }
}
