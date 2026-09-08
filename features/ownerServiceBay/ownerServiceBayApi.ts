import {clientApi} from "@/lib/clientApi";
import {isApiError} from "@/lib/apiTypes";
import {OwnerServiceBay, OwnerServiceBayType, ServiceBayRequest} from "@/features/ownerServiceBay/ownerServiceBayTypes";

export const ownerServiceBayApi = {
    async getServiceBays(branchId: string): Promise<OwnerServiceBay[]> {
        const result = await clientApi.get<OwnerServiceBay[]>(`/owner/branches/${branchId}/service-bays`);
        if (isApiError(result)) throw result;
        return result;
    },

    async getServiceBayTypes(branchId: string): Promise<OwnerServiceBayType[]> {
        const result = await clientApi.get<OwnerServiceBayType[]>(`/owner/branches/${branchId}/service-bays/types`);
        if (isApiError(result)) throw result;
        return result;
    },

    async createServiceBay(branchId: string, body: ServiceBayRequest): Promise<OwnerServiceBay> {
        const result = await clientApi.post<OwnerServiceBay, ServiceBayRequest>(`/owner/branches/${branchId}/service-bays`, body);
        if (isApiError(result)) throw result;
        return result;
    },

    async updateServiceBay(branchId: string, bayId: number, body: ServiceBayRequest): Promise<OwnerServiceBay> {
        const result = await clientApi.put<OwnerServiceBay, ServiceBayRequest>(`/owner/branches/${branchId}/service-bays/${bayId}`, body);
        if (isApiError(result)) throw result;
        return result;
    },
}
