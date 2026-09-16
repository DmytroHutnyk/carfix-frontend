import {
    EMPTY_SERVICE_FORM,
    SERVICE_STATUS,
    SERVICE_STATUS_LABEL,
    serviceFormSchema,
    ServiceForm,
    ServiceStatus,
} from "@/features/branchRegistration/branchRegistrationTypes";

export interface ServiceEmployeeRequirement {
    name: string;
    roles: string[];
}

export interface ServiceEquipmentRequirement {
    name: string;
    types: string[];
}

export interface OwnerService {
    id: number;
    name: string;
    description: string | null;
    durationMinutes: number;
    price: number;
    status: ServiceStatus;
    categoryId: number;
    categoryName: string;
    bayTypes: string[];
    employeeRequirements: ServiceEmployeeRequirement[];
    equipmentRequirements: ServiceEquipmentRequirement[];
}

export interface ServiceRequest {
    name: string;
    description: string | null;
    durationMinutes: number;
    price: number;
    categoryId: number;
    bayTypes: string[];
    employeeRequirements: ServiceEmployeeRequirement[];
    equipmentRequirements: ServiceEquipmentRequirement[];
}

export function toServiceForm(service: OwnerService): ServiceForm {
    return {
        name: service.name,
        description: service.description ?? "",
        durationMinutes: service.durationMinutes,
        price: service.price,
        categoryId: service.categoryId,
        status: service.status,
        bayTypes: service.bayTypes,
        employeeRequirements: service.employeeRequirements.map((r) => ({roles: r.roles})),
        equipmentRequirements: service.equipmentRequirements.map((r) => ({types: r.types})),
    };
}

export {EMPTY_SERVICE_FORM, SERVICE_STATUS, SERVICE_STATUS_LABEL, serviceFormSchema};
export type {ServiceForm, ServiceStatus};
