import {WorkshopReview} from "@/features/workshop/workshopTypes";

export const BRANCH_STATUSES = ["VERIFICATION_PENDING", "ACTIVE", "SUSPENDED"] as const;
export type BranchStatus = (typeof BRANCH_STATUSES)[number];

// Mirrors backend OwnerBranchSummaryResponse (latestReviews[] mirrors BranchReviewResponse = WorkshopReview)
export interface OwnerBranchSummary {
    branchId: string;
    name: string;
    status: BranchStatus;
    streetName: string;
    buildingNumber: string;
    city: string;
    rating: number | null;
    reviewCount: number | null;
    openNow: boolean;
    bookingsToday: number;
    completedToday: number;
    employeesOnDutyToday: number;
    employeesTotal: number;
    latestReviews: WorkshopReview[];
}
