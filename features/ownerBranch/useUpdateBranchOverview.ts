import {useMutation, useQueryClient} from "@tanstack/react-query";
import {ownerBranchApi} from "@/features/ownerBranch/ownerBranchApi";
import {ownerBranchKeys} from "@/features/ownerBranch/keys";
import {OwnerBranchDetail, UpdateBranchOverviewRequest} from "@/features/ownerBranch/ownerBranchTypes";

export function useUpdateBranchOverview(branchId: string) {
    const queryClient = useQueryClient();

    const updateMutation = useMutation({
        mutationFn: (body: UpdateBranchOverviewRequest) => ownerBranchApi.updateBranch(branchId, body),
        onSuccess: (detail: OwnerBranchDetail) => {
            queryClient.setQueryData(ownerBranchKeys.detail(branchId), detail);
            void queryClient.invalidateQueries({queryKey: ownerBranchKeys.list()});
        },
    });

    return {
        updateBranch: (body: UpdateBranchOverviewRequest) => updateMutation.mutateAsync(body),
    }
}
