import {PRIVATE_SCOPE} from "@/lib/scopes";

export const ownerBookingKeys = {
    all: [PRIVATE_SCOPE, 'ownerBookings'] as const,
    branch: (branchId: string) => [...ownerBookingKeys.all, branchId] as const,
    day: (branchId: string, date: string) => [...ownerBookingKeys.branch(branchId), date] as const,
}
