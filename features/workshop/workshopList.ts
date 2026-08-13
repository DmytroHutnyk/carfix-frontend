import {Workshop, WorkshopOpeningHours, WorkshopReview} from "@/features/workshop/workshopTypes";

export const DAY_ORDER = [
    "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY",
] as const;

export function formatDay(dayOfWeek: string): string {
    return dayOfWeek.charAt(0) + dayOfWeek.slice(1).toLowerCase();
}

/* "Today" in the branch's own timezone, not the viewer's. */
export function todayInTz(tz: string): string {
    return new Intl.DateTimeFormat("en-US", {weekday: "long", timeZone: tz})
        .format(new Date())
        .toUpperCase();
}

export function hoursForDay(openingHours: WorkshopOpeningHours[], dayOfWeek: string): WorkshopOpeningHours[] {
    return openingHours.filter((oh) => oh.dayOfWeek === dayOfWeek);
}

export function formatHoursRange(oh: WorkshopOpeningHours): string {
    return `${oh.startTime} - ${oh.closeTime}`;
}

export function reviewerName(review: WorkshopReview): string {
    return `${review.customerName} ${review.customerSurname}`;
}

export function formatReviewDate(createdAt: string): string {
    return new Date(createdAt).toLocaleDateString();
}

export function fullAddress(workshop: Workshop): string {
    return `ul. ${workshop.streetName} ${workshop.buildingNumber}, ${workshop.city}`;
}

export function mapsUrl(workshop: Workshop): string | null {
    if (workshop.latitude == null || workshop.longitude == null) return null;
    const base = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        `${workshop.latitude},${workshop.longitude}`)}`;
    return workshop.googlePlaceId
        ? `${base}&query_place_id=${encodeURIComponent(workshop.googlePlaceId)}`
        : base;
}
