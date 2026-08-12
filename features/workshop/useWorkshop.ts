import {useQuery} from "@tanstack/react-query";
import {workshopApi} from "@/features/workshop/workshopApi";
import {workshopKeys} from "@/features/workshop/keys";

export function useWorkshop(branchId: string) {
    const query = useQuery({
        queryKey: workshopKeys.detail(branchId),
        queryFn: () => workshopApi.getWorkshop(branchId),
        staleTime: 60_000,
    });

    return {
        workshop: query.data,
        isLoading: query.isPending,
        isError: query.isError,
        error: query.error,
    };
}
