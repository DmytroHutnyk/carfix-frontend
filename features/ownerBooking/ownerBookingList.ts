import {format} from "date-fns";
import {OwnerBooking} from "@/features/ownerBooking/ownerBookingTypes";

export const OWNER_BOOKING_STATUS_LABELS: Record<string, string> = {
    SCHEDULED: "Scheduled",
    IN_PROGRESS: "In progress",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled",
    NO_SHOW: "No-show",
};

export type OwnerBookingSort = "startAsc" | "startDesc";

export type OwnerBookingBadgeVariant =
    "default" | "secondary" | "destructive" | "destructiveSoft" | "success" | "outline";

const OWNER_BOOKING_STATUS_VARIANT: Record<string, OwnerBookingBadgeVariant> = {
    SCHEDULED: "success",
    IN_PROGRESS: "default",
    COMPLETED: "secondary",
    CANCELLED: "destructiveSoft",
    NO_SHOW: "destructive",
};

export function ownerBookingStatusLabel(status: string): string {
    return OWNER_BOOKING_STATUS_LABELS[status] ?? status;
}

export function ownerBookingStatusVariant(status: string): OwnerBookingBadgeVariant {
    return OWNER_BOOKING_STATUS_VARIANT[status] ?? "secondary";
}

export function formatClock(value: string): string {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) return format(parsed, "HH:mm");
    return value.slice(0, 5);
}

export function formatDateTime(value: string): string {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) return format(parsed, "MMM d, yyyy · HH:mm");
    return value;
}

export function formatMoney(price: number): string {
    return `${Number.isInteger(price) ? price : price.toFixed(2)} PLN`;
}

export function initialsOf(name: string): string {
    return name
        .split(/\s+/)
        .filter(Boolean)
        .map((part) => part[0]?.toUpperCase() ?? "")
        .slice(0, 2)
        .join("");
}

export function filterOwnerBookings(list: OwnerBooking[], query: string): OwnerBooking[] {
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter((b) => {
        const haystack = [
            b.customer.name,
            b.car.plate,
            b.car.brand,
            b.car.model,
            b.reference,
            ...b.services.map((s) => s.name),
        ].join(" ").toLowerCase();
        return haystack.includes(q);
    });
}

export function sortOwnerBookings(list: OwnerBooking[], sort: OwnerBookingSort): OwnerBooking[] {
    const factor = sort === "startDesc" ? -1 : 1;
    return [...list].sort((a, b) => a.start.localeCompare(b.start) * factor);
}
