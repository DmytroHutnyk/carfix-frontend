import {PRIVATE_SCOPE} from "@/lib/scopes";

export const ownerServiceKeys = {
    all: [PRIVATE_SCOPE, 'ownerServices'] as const,
    branch: (branchId: string) => [...ownerServiceKeys.all, branchId] as const,
    list: (branchId: string) => [...ownerServiceKeys.branch(branchId), 'list'] as const,
}
