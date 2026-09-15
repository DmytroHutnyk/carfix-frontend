import {useOwnerServiceBays} from "@/features/ownerServiceBay/useOwnerServiceBays";
import {useOwnerEmployees} from "@/features/ownerEmployee/useOwnerEmployees";
import {useOwnerEquipment} from "@/features/ownerEquipment/useOwnerEquipment";

function dedupe(values: string[]): string[] {
    return [...new Set(values)].sort((a, b) => a.localeCompare(b));
}

export function useServiceFormOptions(branchId: string, options?: { enabled?: boolean }) {
    const enabled = options?.enabled ?? true;

    const {types, isLoading: baysLoading} = useOwnerServiceBays(branchId, {enabled});
    const {employees, isLoading: employeesLoading} = useOwnerEmployees(branchId, {enabled});
    const {equipment, isLoading: equipmentLoading} = useOwnerEquipment(branchId, {enabled});

    return {
        bayTypeOptions: dedupe(types.map((type) => type.name)),
        roleOptions: dedupe(employees.flatMap((employee) => employee.roles)),
        equipmentTypeOptions: dedupe(equipment.map((item) => item.type).filter((type) => type.trim().length > 0)),
        isLoading: baysLoading || employeesLoading || equipmentLoading,
    };
}
