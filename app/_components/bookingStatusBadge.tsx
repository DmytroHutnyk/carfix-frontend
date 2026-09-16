import {VariantProps} from "class-variance-authority";

import {BookingStatus} from "@/features/booking/bookingTypes";
import {Badge, badgeVariants} from "@/_components/shadcn/badge";

type BadgeVariant = VariantProps<typeof badgeVariants>["variant"];

export const BOOKING_STATUS_META: Record<BookingStatus, {label: string; variant: BadgeVariant}> = {
    SCHEDULED: {label: "Scheduled", variant: "success"},
    IN_PROGRESS: {label: "In progress", variant: "default"},
    COMPLETED: {label: "Completed", variant: "secondary"},
    CANCELLED: {label: "Cancelled", variant: "destructiveSoft"},
    NO_SHOW: {label: "No-show", variant: "destructive"},
};

export function bookingStatusLabel(status: string): string {
    return BOOKING_STATUS_META[status as BookingStatus]?.label ?? status;
}

export default function BookingStatusBadge({status, className}: {status: string; className?: string}) {
    const meta = BOOKING_STATUS_META[status as BookingStatus];
    return (
        <Badge variant={meta?.variant ?? "secondary"} className={className}>
            {meta?.label ?? status}
        </Badge>
    );
}
