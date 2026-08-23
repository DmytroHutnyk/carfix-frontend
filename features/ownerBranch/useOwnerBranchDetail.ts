import {useQuery} from "@tanstack/react-query";
import {ownerBranchApi} from "@/features/ownerBranch/ownerBranchApi";
import {ownerBranchKeys} from "@/features/ownerBranch/keys";
import {OwnerBranchDetail} from "@/features/ownerBranch/ownerBranchTypes";
import {ApiError} from "@/lib/apiTypes";

export function useOwnerBranchDetail(branchId: string, options?: { enabled?: boolean }) {
    const detailQuery = useQuery<OwnerBranchDetail, ApiError>({
        queryKey: ownerBranchKeys.detail(branchId),
        queryFn: () => ownerBranchApi.getBranch(branchId),
        enabled: options?.enabled ?? true,
        staleTime: 60 * 1000,
    });

    return {
        branch: detailQuery.data ?? null,
        isLoading: detailQuery.isLoading,
        isError: detailQuery.isError,
        error: detailQuery.error,
    }
}
