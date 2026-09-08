import {PRIVATE_SCOPE} from "@/lib/scopes";

export const ownerEmployeeKeys = {
    all: [PRIVATE_SCOPE, 'ownerEmployees'] as const,
    branch: (branchId: string) => [...ownerEmployeeKeys.all, branchId] as const,
    list: (branchId: string) => [...ownerEmployeeKeys.branch(branchId), 'list'] as const,
}
