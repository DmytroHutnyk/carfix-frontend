import {PRIVATE_SCOPE} from "@/lib/scopes";

export const ownerEquipmentKeys = {
    all: [PRIVATE_SCOPE, 'ownerEquipment'] as const,
    branch: (branchId: string) => [...ownerEquipmentKeys.all, branchId] as const,
    list: (branchId: string) => [...ownerEquipmentKeys.branch(branchId), 'list'] as const,
}
