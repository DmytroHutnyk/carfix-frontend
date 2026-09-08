import {PRIVATE_SCOPE} from "@/lib/scopes";

export const ownerServiceBayKeys = {
    all: [PRIVATE_SCOPE, 'ownerServiceBays'] as const,
    branch: (branchId: string) => [...ownerServiceBayKeys.all, branchId] as const,
    list: (branchId: string) => [...ownerServiceBayKeys.branch(branchId), 'list'] as const,
    types: (branchId: string) => [...ownerServiceBayKeys.branch(branchId), 'types'] as const,
}
