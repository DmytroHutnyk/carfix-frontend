import {BranchStatus, OwnerBranchSummary} from "@/features/ownerBranch/ownerBranchTypes";

export type BranchFilterKey = "all" | "active" | "closed" | "pending" | "openNow";

export const BRANCH_FILTER_OPTIONS: { value: BranchFilterKey; label: string }[] = [
    {value: "all", label: "All"},
    {value: "active", label: "Active"},
    {value: "closed", label: "Closed"},
    {value: "pending", label: "Pending"},
    {value: "openNow", label: "Open now"},
];

export function filterBranches(branches: OwnerBranchSummary[], filter: BranchFilterKey): OwnerBranchSummary[] {
    switch (filter) {
        case "active":
            return branches.filter((b) => b.status === "ACTIVE");
        case "closed":
            return branches.filter((b) => b.status === "SUSPENDED");
        case "pending":
            return branches.filter((b) => b.status === "VERIFICATION_PENDING");
        case "openNow":
            return branches.filter((b) => b.status === "ACTIVE" && b.openNow);
        default:
            return branches;
    }
}

export type BranchSortKey = "nameAsc" | "nameDesc" | "bookingsDesc" | "ratingDesc";

export const BRANCH_SORT_OPTIONS: { value: BranchSortKey; label: string }[] = [
    {value: "nameAsc", label: "Name A–Z"},
    {value: "nameDesc", label: "Name Z–A"},
    {value: "bookingsDesc", label: "Most bookings today"},
    {value: "ratingDesc", label: "Highest rating"},
];

export function sortBranches(branches: OwnerBranchSummary[], sort: BranchSortKey): OwnerBranchSummary[] {
    const byName = (a: OwnerBranchSummary, b: OwnerBranchSummary) => a.name.localeCompare(b.name);
    return [...branches].sort((a, b) => {
        switch (sort) {
            case "nameDesc":
                return byName(b, a);
            case "bookingsDesc":
                return b.bookingsToday - a.bookingsToday || byName(a, b);
            case "ratingDesc":
                return (b.rating ?? -1) - (a.rating ?? -1) || byName(a, b);
            default:
                return byName(a, b);
        }
    });
}

export interface OwnerTotals {
    bookingsToday: number;
    completedToday: number;
    employeesOnDutyToday: number;
    employeesTotal: number;
    averageRating: number | null;
}

/* The strip is the column sum of every loaded card; the rating is weighted by review count. */
export function summarizeBranches(branches: OwnerBranchSummary[]): OwnerTotals {
    const rated = branches.filter((b) => b.rating !== null && (b.reviewCount ?? 0) > 0);
    const reviews = rated.reduce((sum, b) => sum + (b.reviewCount ?? 0), 0);
    const weighted = rated.reduce((sum, b) => sum + (b.rating ?? 0) * (b.reviewCount ?? 0), 0);
    return {
        bookingsToday: branches.reduce((sum, b) => sum + b.bookingsToday, 0),
        completedToday: branches.reduce((sum, b) => sum + b.completedToday, 0),
        employeesOnDutyToday: branches.reduce((sum, b) => sum + b.employeesOnDutyToday, 0),
        employeesTotal: branches.reduce((sum, b) => sum + b.employeesTotal, 0),
        averageRating: reviews === 0 ? null : Math.round((weighted / reviews) * 10) / 10,
    };
}

export const BRANCH_STATUS_LABELS: Record<BranchStatus, string> = {
    ACTIVE: "Active",
    SUSPENDED: "Closed",
    VERIFICATION_PENDING: "Verification pending",
};

export function formatAddress(branch: OwnerBranchSummary): string {
    return `ul. ${branch.streetName} ${branch.buildingNumber}, ${branch.city}`;
}

export function personnelPercent(branch: OwnerBranchSummary): number {
    return branch.employeesTotal === 0
        ? 0
        : Math.round((branch.employeesOnDutyToday / branch.employeesTotal) * 100);
}
