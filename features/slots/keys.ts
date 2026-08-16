import {PUBLIC_SCOPE} from "@/lib/scopes";
import {SlotsQuery} from "@/features/slots/slotTypes";

export const slotKeys = {
    all: [PUBLIC_SCOPE, 'slots'] as const,
    branch: (branchId: string) => [...slotKeys.all, branchId] as const,
    range: (query: SlotsQuery) =>
        [...slotKeys.branch(query.branchId), query.serviceIds.join(","), query.from, query.to] as const,
}
