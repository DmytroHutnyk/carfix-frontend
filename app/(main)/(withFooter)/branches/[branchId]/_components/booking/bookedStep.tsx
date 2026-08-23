import Link from "next/link";
import {CalendarDays, CircleCheck, MapPin} from "lucide-react";
import {Badge} from "@/_components/shadcn/badge";
import {Button} from "@/_components/shadcn/button";
import {DialogDescription, DialogHeader, DialogTitle} from "@/_components/shadcn/dialog";
import {Booking} from "@/features/booking/bookingTypes";
import {formatBookingDate, formatTime} from "@/features/booking/bookingList";

export default function BookedStep({booking, onClose}: {
    booking: Booking;
    onClose: () => void;
}) {
    return (
        <div className="flex flex-col gap-4 p-6">
            <DialogHeader className="space-y-0.5 pr-8 text-left">
                <DialogTitle className="flex items-center gap-2 text-base">
                    <CircleCheck className="h-4 w-4 shrink-0 text-success-badge-foreground"/>
                    Booked
                </DialogTitle>
                <DialogDescription className="text-xs">
                    You can review or cancel it in My Bookings.
                </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col items-start gap-2 text-sm">
                <Badge variant="secondary">#{booking.reference}</Badge>
                <p className="flex items-center gap-2 text-muted-foreground tabular-nums">
                    <CalendarDays className="h-4 w-4 shrink-0"/>
                    {formatBookingDate(booking.date)} · {formatTime(booking.startTime)}–{formatTime(booking.endTime)}
                </p>
                <p className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4 shrink-0"/>
                    <span className="min-w-0 wrap-anywhere">{booking.branch.name}</span>
                </p>
            </div>

            <div className="flex justify-end gap-2">
                <Button variant="secondary" onClick={onClose}>Close</Button>
                <Button asChild><Link href="/bookings">My Bookings</Link></Button>
            </div>
        </div>
    );
}
