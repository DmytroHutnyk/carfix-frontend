import {PRIVATE_SCOPE} from "@/lib/scopes";

export const ownerBookingKeys = {
    all: [PRIVATE_SCOPE, 'ownerBookings'] as const,
    branch: (branchId: string) => [...ownerBookingKeys.all, branchId] as const,
    range: (branchId: string, from: string, to: string) => [...ownerBookingKeys.branch(branchId), from, to] as const,
}
