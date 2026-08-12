import {PUBLIC_SCOPE} from "@/lib/scopes";
import {ReviewsSort} from "@/features/workshop/workshopTypes";

export const workshopKeys = {
    all: [PUBLIC_SCOPE, 'workshop'] as const,
    detail: (branchId: string) => [...workshopKeys.all, branchId] as const,
    reviews: (branchId: string, sort: ReviewsSort) =>
        [...workshopKeys.all, branchId, 'reviews', sort] as const,
}
