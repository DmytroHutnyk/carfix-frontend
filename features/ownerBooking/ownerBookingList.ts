import {format} from "date-fns";
import {OwnerBooking} from "@/features/ownerBooking/ownerBookingTypes";

export type OwnerBookingSort = "startAsc" | "startDesc";

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

export function formatBookingDate(value: string): string {
    const parsed = new Date(value + "T00:00:00");
    if (!Number.isNaN(parsed.getTime())) return format(parsed, "EEE, MMM d");
    return value;
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
    return [...list].sort((a, b) => {
        const byDate = a.date.localeCompare(b.date);
        if (byDate !== 0) return byDate * factor;
        return a.start.localeCompare(b.start) * factor;
    });
}
