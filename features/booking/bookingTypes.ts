import {z} from "zod";

export const BOOKING_STATUSES = ["SCHEDULED", "IN_PROGRESS", "COMPLETED", "CANCELLED", "NO_SHOW"] as const;
export type BookingStatus = (typeof BOOKING_STATUSES)[number];

// Mirrors backend BookingBranchResponse
export interface BookingBranch {
    branchId: string;
    name: string;
    phoneNumber: string;
    email: string;
    streetName: string;
    buildingNumber: string;
    city: string;
}

// Mirrors backend BookingVehicleResponse
export interface BookingVehicle {
    carProfileId: string;
    name: string;
    brandName: string;
    modelName: string;
    plates: string | null;
}

// Mirrors backend BookingServiceResponse
export interface BookingService {
    name: string;
    price: number;
}

// Mirrors backend CustomerBookingResponse
export interface Booking {
    bookingId: string;
    reference: string;        // "BK-3F8A1B2C"
    date: string;             // ISO date "2026-08-12"
    startTime: string;        // "HH:mm:ss"
    endTime: string;          // "HH:mm:ss"
    status: BookingStatus;
    safeCancelUntil: string;  // ISO instant; informational 24h penalty threshold
    branch: BookingBranch;
    vehicle: BookingVehicle;
    services: BookingService[];
    totalPrice: number;
}

// Mirrors backend CreateBookingRequest
export interface CreateBookingRequest {
    branchId: string;
    carProfileId: string;
    serviceIds: number[];   // 1..3, distinct
    date: string;           // ISO date "2026-08-12"
    startTime: string;      // "HH:mm"
}

export const REVIEW_MIN_RATING = 1;
export const REVIEW_MAX_RATING = 5;
export const REVIEW_COMMENT_MAX = 1000;

export const createReviewSchema = z.object({
    rating: z.number()
        .int()
        .min(REVIEW_MIN_RATING, "Please select a rating")
        .max(REVIEW_MAX_RATING),
    comment: z.string()
        .max(REVIEW_COMMENT_MAX, `Comment cannot exceed ${REVIEW_COMMENT_MAX} characters`),
});

export type CreateReviewForm = z.infer<typeof createReviewSchema>;
