import {clientApi} from "@/lib/clientApi";
import {isApiError} from "@/lib/apiTypes";
import {OwnerEquipment, OwnerEquipmentRequest} from "@/features/ownerEquipment/ownerEquipmentTypes";

export const ownerEquipmentApi = {
    async getEquipment(branchId: string): Promise<OwnerEquipment[]> {
        const result = await clientApi.get<OwnerEquipment[]>(`/owner/branches/${branchId}/equipment`);
        if (isApiError(result)) throw result;
        return result;
    },

    async createEquipment(branchId: string, body: OwnerEquipmentRequest): Promise<OwnerEquipment> {
        const result = await clientApi.post<OwnerEquipment, OwnerEquipmentRequest>(`/owner/branches/${branchId}/equipment`, body);
        if (isApiError(result)) throw result;
        return result;
    },

    async updateEquipment(branchId: string, equipmentId: string, body: OwnerEquipmentRequest): Promise<OwnerEquipment> {
        const result = await clientApi.put<OwnerEquipment, OwnerEquipmentRequest>(`/owner/branches/${branchId}/equipment/${equipmentId}`, body);
        if (isApiError(result)) throw result;
        return result;
    },
}
