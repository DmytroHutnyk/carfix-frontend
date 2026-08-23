import {clientApi} from "@/lib/clientApi";
import {isApiError} from "@/lib/apiTypes";
import {
    OwnerBranchDetail,
    OwnerBranchSummary,
    UpdateBranchOverviewRequest,
} from "@/features/ownerBranch/ownerBranchTypes";

export const ownerBranchApi = {
    async getMyBranches(): Promise<OwnerBranchSummary[]> {
        const result = await clientApi.get<OwnerBranchSummary[]>('/owner/branches');
        if (isApiError(result)) throw result;
        return result;
    },

    async getBranch(branchId: string): Promise<OwnerBranchDetail> {
        const result = await clientApi.get<OwnerBranchDetail>(`/owner/branches/${branchId}`);
        if (isApiError(result)) throw result;
        return result;
    },

    async updateBranch(branchId: string, body: UpdateBranchOverviewRequest): Promise<OwnerBranchDetail> {
        const result = await clientApi.put<OwnerBranchDetail, UpdateBranchOverviewRequest>(`/owner/branches/${branchId}`, body);
        if (isApiError(result)) throw result;
        return result;
    },
}
