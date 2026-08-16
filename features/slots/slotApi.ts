import {clientApi} from "@/lib/clientApi";
import {isApiError} from "@/lib/apiTypes";
import {BranchSlots, SlotsQuery} from "@/features/slots/slotTypes";

export const slotApi = {
    async getBranchSlots({branchId, serviceIds, from, to}: SlotsQuery): Promise<BranchSlots> {
        const params = new URLSearchParams({serviceIds: serviceIds.join(","), from, to});
        const result = await clientApi.get<BranchSlots>(`/branches/${branchId}/slots?${params.toString()}`);
        if (isApiError(result)) throw result;
        return result;
    },
}
