import {useMutation} from "@tanstack/react-query";
import {ownerBranchApi} from "@/features/branchRegistration/branchRegistrationApi";
import {BranchRegistrationDraft} from "@/features/branchRegistration/branchRegistrationTypes";

export function useRegisterBranch() {
    const mutation = useMutation({
        mutationFn: ownerBranchApi.registerBranch,
    });

    return {
        registerBranch: (draft: BranchRegistrationDraft) => mutation.mutateAsync(draft),
        isPending: mutation.isPending,
    }
}
