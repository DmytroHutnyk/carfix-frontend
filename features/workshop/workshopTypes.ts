// Backend wire contract: WorkshopResponse and its nested records
export interface WorkshopBrand {
    carBrandId: number;
    name: string;
}

export type OpeningHoursMode = "OPEN" | "BY_APPOINTMENT";

export interface WorkshopOpeningHours {
    dayOfWeek: string;
    startTime: string;
    closeTime: string;
    mode: OpeningHoursMode;
}

export interface WorkshopService {
    serviceId: number;
    name: string;
    description: string | null;
    durationMinutes: number;
    price: number;
}

export interface WorkshopServiceCategory {
    categoryId: number;
    name: string;
    services: WorkshopService[];
}

export interface Workshop {
    branchId: string;
    name: string;
    phoneNumber: string;
    email: string;
    description: string | null;
    cancellationPolicy: string | null;
    rating: number | null;
    reviewCount: number | null;
    streetName: string;
    buildingNumber: string;
    city: string;
    latitude: number | null;
    longitude: number | null;
    googlePlaceId: string | null;
    tz: string;
    brands: WorkshopBrand[];
    openingHours: WorkshopOpeningHours[];
    serviceCategories: WorkshopServiceCategory[];
}

export type ReviewsSort = "newest" | "highest" | "lowest";

// Backend wire contract: WorkshopReviewsPageResponse
export interface WorkshopReview {
    reviewId: string;
    starsNumber: number;
    contents: string | null;
    createdAt: string;
    customerName: string;
    customerSurname: string;
}

export interface WorkshopReviewsPage {
    content: WorkshopReview[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
}
