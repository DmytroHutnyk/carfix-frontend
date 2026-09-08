import {z} from "zod";

export const BOOKING_STATUSES = ["SCHEDULED", "IN_PROGRESS", "COMPLETED", "CANCELLED", "NO_SHOW"] as const;
export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export interface BookingBranch {
    branchId: string;
    name: string;
    phoneNumber: string;
    email: string;
    streetName: string;
    buildingNumber: string;
    city: string;
}

export interface BookingVehicle {
    carProfileId: string;
    name: string;
    brandName: string;
    modelName: string;
    plates: string | null;
}

export interface BookingService {
    name: string;
    price: number;
}

export interface Booking {
    bookingId: string;
    reference: string;
    date: string;
    startTime: string;
    endTime: string;
    status: BookingStatus;
    safeCancelUntil: string;
    branch: BookingBranch;
    vehicle: BookingVehicle;
    services: BookingService[];
    totalPrice: number;
}

export interface CreateBookingRequest {
    branchId: string;
    carProfileId: string;
    serviceIds: number[];
    date: string;
    startTime: string;
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
