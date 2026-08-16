import {PRIVATE_SCOPE} from "@/lib/scopes";

export const ownerBranchKeys = {
    all: [PRIVATE_SCOPE, 'ownerBranches'] as const,
    list: () => [...ownerBranchKeys.all, 'list'] as const,
}
