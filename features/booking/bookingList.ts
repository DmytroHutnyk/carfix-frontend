import {format} from "date-fns";
import {Booking, BookingStatus} from "@/features/booking/bookingTypes";
import {DateRangeValue, EMPTY_DATE_RANGE} from "@/lib/appTypes";
import {ApiError, isProblemDetailError} from "@/lib/apiTypes";

export type BookingFilterState = {
    query: string;
    carProfileId: string;
    status: BookingStatus | "all";
    dateRange: DateRangeValue;
};

export const EMPTY_FILTERS: BookingFilterState = {
    query: "",
    carProfileId: "all",
    status: "all",
    dateRange: EMPTY_DATE_RANGE,
};

export function filterBookings(list: Booking[], filters: BookingFilterState): Booking[] {
    const q = filters.query.trim().toLowerCase();
    return list.filter((b) => {
        if (filters.carProfileId !== "all" && b.vehicle.carProfileId !== filters.carProfileId) return false;
        if (filters.status !== "all" && b.status !== filters.status) return false;
        if (filters.dateRange.from && b.date < filters.dateRange.from) return false;
        if (filters.dateRange.to && b.date > filters.dateRange.to) return false;
        if (!q) return true;
        const haystack = [b.branch.name, ...b.services.map((s) => s.name)]
            .join(" ")
            .toLowerCase();
        return haystack.includes(q);
    });
}

function startMillis(b: Booking): number {
    // Local-time interpretation is fine here: only used for relative ordering.
    return new Date(`${b.date}T${b.startTime}`).getTime();
}

export function sortBookings(list: Booking[], now: Date = new Date()): Booking[] {
    const nowMs = now.getTime();
    const upcoming = list.filter((b) => startMillis(b) >= nowMs)
        .sort((a, b) => startMillis(a) - startMillis(b));
    const past = list.filter((b) => startMillis(b) < nowMs)
        .sort((a, b) => startMillis(b) - startMillis(a));
    return [...upcoming, ...past];
}

export function formatBookingDate(isoDate: string): string {
    return format(new Date(isoDate + "T00:00:00"), "EEE, MMM d, yyyy");
}

export function formatTime(time: string): string {
    return time.slice(0, 5);
}

export function formatPrice(price: number): string {
    return `${Number.isInteger(price) ? price : price.toFixed(2)} PLN`;
}

export function isPenaltyCancel(booking: Booking, now: Date = new Date()): boolean {
    return now.getTime() > new Date(booking.safeCancelUntil).getTime();
}

// A rejected slot proves cached availability stale and forces a refetch.
export function isStaleSlotError(error: ApiError): boolean {
    if (!isProblemDetailError(error)) return false;
    return error.code === "SLOT_NOT_AVAILABLE" || error.errors?.startTime !== undefined;
}
