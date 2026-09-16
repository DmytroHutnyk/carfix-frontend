import {clientApi} from "@/lib/clientApi";
import {isApiError} from "@/lib/apiTypes";
import {OwnerService, ServiceForm, ServiceRequest} from "@/features/ownerService/ownerServiceTypes";

const MAX_REQUIREMENT_NAME = 100;

function emptyToNull(value: string): string | null {
    const trimmed = value.trim();
    return trimmed === "" ? null : trimmed;
}

function requirementName(picked: string[], fallback: string): string {
    const joined = picked.join(" / ");
    return joined.length > 0 && joined.length <= MAX_REQUIREMENT_NAME ? joined : fallback;
}

export function toServiceRequest(form: ServiceForm): ServiceRequest {
    return {
        name: form.name.trim(),
        description: emptyToNull(form.description),
        durationMinutes: form.durationMinutes,
        price: form.price,
        categoryId: form.categoryId,
        bayTypes: form.bayTypes,
        employeeRequirements: form.employeeRequirements.map((r, i) => ({
            name: requirementName(r.roles, `Employee ${i + 1}`),
            roles: r.roles,
        })),
        equipmentRequirements: form.equipmentRequirements.map((r, i) => ({
            name: requirementName(r.types, `Equipment ${i + 1}`),
            types: r.types,
        })),
    };
}

export const ownerServiceApi = {
    async getServices(branchId: string): Promise<OwnerService[]> {
        const result = await clientApi.get<OwnerService[]>(`/owner/branches/${branchId}/services`);
        if (isApiError(result)) throw result;
        return result;
    },

    async createService(branchId: string, body: ServiceRequest): Promise<OwnerService> {
        const result = await clientApi.post<OwnerService, ServiceRequest>(`/owner/branches/${branchId}/services`, body);
        if (isApiError(result)) throw result;
        return result;
    },

    async updateService(branchId: string, serviceId: number, body: ServiceRequest): Promise<OwnerService> {
        const result = await clientApi.put<OwnerService, ServiceRequest>(`/owner/branches/${branchId}/services/${serviceId}`, body);
        if (isApiError(result)) throw result;
        return result;
    },

    async activateService(branchId: string, serviceId: number): Promise<OwnerService> {
        const result = await clientApi.post<OwnerService, undefined>(`/owner/branches/${branchId}/services/${serviceId}/activate`);
        if (isApiError(result)) throw result;
        return result;
    },

    async suspendService(branchId: string, serviceId: number): Promise<OwnerService> {
        const result = await clientApi.post<OwnerService, undefined>(`/owner/branches/${branchId}/services/${serviceId}/suspend`);
        if (isApiError(result)) throw result;
        return result;
    },

    async deleteService(branchId: string, serviceId: number): Promise<void> {
        const result = await clientApi.delete(`/owner/branches/${branchId}/services/${serviceId}`);
        if (isApiError(result)) throw result;
    },
}
