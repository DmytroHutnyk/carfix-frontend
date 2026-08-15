import {addDays, format} from "date-fns";
import {DaySlots, Slot, SlotPick, VisitRange} from "@/features/slots/slotTypes";

/* Same limits as SlotService on the backend — exceeding either is a 400 */
export const MAX_SERVICES_PER_VISIT = 3;
export const MAX_RANGE_DAYS = 7;
export const SUGGESTION_COUNT = 3;

export type AvailabilityLevel = "high" | "medium" | "low";
const HIGH_AVAILABILITY_MIN = 8;
const MEDIUM_AVAILABILITY_MIN = 4;

export function availabilityLevel(slotCount: number): AvailabilityLevel {
    if (slotCount >= HIGH_AVAILABILITY_MIN) return "high";
    if (slotCount >= MEDIUM_AVAILABILITY_MIN) return "medium";
    return "low";
}

export type DayPeriod = "morning" | "afternoon" | "evening";
const PERIOD_LABELS: Record<DayPeriod, string> = {
    morning: "Morning",
    afternoon: "Afternoon",
    evening: "Evening",
};
const AFTERNOON_FROM = "12:00";
const EVENING_FROM = "17:00";

/* "HH:mm" strings order correctly as plain text */
export function periodOf(startTime: string): DayPeriod {
    if (startTime < AFTERNOON_FROM) return "morning";
    if (startTime < EVENING_FROM) return "afternoon";
    return "evening";
}

export function groupSlotsByPeriod(slots: Slot[]): { period: DayPeriod; label: string; slots: Slot[] }[] {
    return (Object.keys(PERIOD_LABELS) as DayPeriod[])
        .map((period) => ({
            period,
            label: PERIOD_LABELS[period],
            slots: slots.filter((slot) => periodOf(slot.startTime) === period),
        }))
        .filter((group) => group.slots.length > 0);
}

export function parseIsoDate(iso: string): Date {
    return new Date(iso + "T00:00:00");
}

export function toIsoDate(date: Date): string {
    return format(date, "yyyy-MM-dd");
}

/* Today as the branch sees it — a viewer in an earlier timezone would otherwise send a `from` that is already past there */
export function todayIsoInTz(tz: string): string {
    const parts = new Intl.DateTimeFormat("en-US", {timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit"})
        .formatToParts(new Date());
    const part = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
    return `${part("year")}-${part("month")}-${part("day")}`;
}

export function defaultVisitRange(tz: string): VisitRange {
    const from = todayIsoInTz(tz);
    return {from, to: toIsoDate(addDays(parseIsoDate(from), MAX_RANGE_DAYS - 1))};
}

export function defaultDate(days: DaySlots[]): string | null {
    return days.find((day) => day.slots.length > 0)?.date ?? days[0]?.date ?? null;
}

export function hasSlot(days: DaySlots[], pick: SlotPick): boolean {
    return days.some((day) => day.date === pick.date
        && day.slots.some((slot) => slot.startTime === pick.startTime && slot.endTime === pick.endTime));
}

export function canonicalServiceIds(ids: number[]): number[] {
    return [...ids].sort((a, b) => a - b);
}

export function pickRandom<T>(items: T[], count: number): T[] {
    const pool = [...items];
    for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    return pool.slice(0, count);
}

export function formatDayOfWeek(iso: string): string {
    return format(parseIsoDate(iso), "EEE");
}

export function formatDayMonth(iso: string): string {
    return format(parseIsoDate(iso), "MMM d");
}
