import {useQuery} from "@tanstack/react-query";
import {ownerBranchApi} from "@/features/ownerBranch/ownerBranchApi";
import {ownerBranchKeys} from "@/features/ownerBranch/keys";
import {OwnerBranchSummary} from "@/features/ownerBranch/ownerBranchTypes";
import {ApiError} from "@/lib/apiTypes";

export function useOwnerBranches(options?: { enabled?: boolean }) {
    const listQuery = useQuery<OwnerBranchSummary[], ApiError>({
        queryKey: ownerBranchKeys.list(),
        queryFn: ownerBranchApi.getMyBranches,
        enabled: options?.enabled ?? true,
        staleTime: 60 * 1000,
    });

    return {
        branches: listQuery.data ?? [],
        isLoading: listQuery.isLoading,
        isError: listQuery.isError,
        error: listQuery.error,
    }
}
