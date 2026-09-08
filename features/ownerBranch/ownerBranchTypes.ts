import {WorkshopReview} from "@/features/workshop/workshopTypes";
import {
    OpeningHoursMode,
    RegisterBranchAddressRequest,
    RegisterBranchOpeningHoursRequest,
    Weekday,
} from "@/features/branchRegistration/branchRegistrationTypes";

export const BRANCH_STATUSES = ["VERIFICATION_PENDING", "ACTIVE", "SUSPENDED"] as const;
export type BranchStatus = (typeof BRANCH_STATUSES)[number];

export const CANCELLATION_POLICIES = ["STRICT", "MODERATE", "FLEXIBLE"] as const;
export type CancellationPolicy = (typeof CANCELLATION_POLICIES)[number];

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

export interface OwnerBranchAddress {
    streetName: string;
    buildingNumber: string;
    flatNumber: string | null;
    postalCode: string;
    city: string;
    region: string;
    countryIso: string;
    countryName: string;
    latitude: number | null;
    longitude: number | null;
    googlePlaceId: string | null;
}

export interface OwnerBranchOpeningHours {
    dayOfWeek: Weekday;
    startTime: string;
    closeTime: string;
    mode: OpeningHoursMode;
}

export interface OwnerBranchOpeningHoursException {
    id: number;
    date: string;
    opensAt: string | null;
    closesAt: string | null;
    isOpen: boolean;
    reason: string | null;
}

export interface OwnerBranchBrand {
    carBrandId: number;
    name: string;
}

export interface OwnerBranchDetail {
    branchId: string;
    name: string;
    status: BranchStatus;
    description: string | null;
    cancellationPolicy: CancellationPolicy;
    phoneNumber: string;
    email: string;
    timezone: string;
    address: OwnerBranchAddress;
    brands: OwnerBranchBrand[];
    openingHours: OwnerBranchOpeningHours[];
    openingHoursExceptions: OwnerBranchOpeningHoursException[];
}

export interface UpdateBranchOpeningHoursExceptionRequest {
    date: string;
    opensAt: string | null;
    closesAt: string | null;
    isOpen: boolean;
    reason: string | null;
}

export interface UpdateBranchOverviewRequest {
    name: string;
    description: string | null;
    cancellationPolicy: CancellationPolicy;
    address: RegisterBranchAddressRequest;
    openingHours: RegisterBranchOpeningHoursRequest[];
    openingHoursExceptions: UpdateBranchOpeningHoursExceptionRequest[];
    carBrandIds: number[];
}
