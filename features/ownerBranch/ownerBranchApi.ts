import {clientApi} from "@/lib/clientApi";
import {isApiError} from "@/lib/apiTypes";
import {OwnerBranchSummary} from "@/features/ownerBranch/ownerBranchTypes";

export const ownerBranchApi = {
    async getMyBranches(): Promise<OwnerBranchSummary[]> {
        const result = await clientApi.get<OwnerBranchSummary[]>('/owner/branches');
        if (isApiError(result)) throw result;
        return result;
    },
}
