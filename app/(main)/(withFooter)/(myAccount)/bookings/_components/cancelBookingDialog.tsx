'use client'

import {useState} from "react";
import {CalendarDays, CircleCheck, MapPin, TriangleAlert} from "lucide-react";

import {Booking} from "@/features/booking/bookingTypes";
import {useBookings} from "@/features/booking/useBookings";
import {formatBookingDate, formatTime, isPenaltyCancel} from "@/features/booking/bookingList";
import {toDisplayError} from "@/lib/errorHandler";
import {ApiError} from "@/lib/apiTypes";

import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/_components/shadcn/dialog";
import {Badge} from "@/_components/shadcn/badge";
import {Button} from "@/_components/shadcn/button";
import {Checkbox} from "@/_components/shadcn/checkbox";
import {Label} from "@/_components/shadcn/label";
import {Separator} from "@/_components/shadcn/separator";
import FormErrorAlert from "@/_components/formErrorAlert";

export default function CancelBookingDialog({open, onOpenChange, booking}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    booking: Booking;
}) {
    const penalty = isPenaltyCancel(booking);
    const [acknowledged, setAcknowledged] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isCancelling, setIsCancelling] = useState(false);
    const {cancelBooking} = useBookings({enabled: false});

    const onConfirm = async () => {
        setError(null);
        setIsCancelling(true);
        try {
            await cancelBooking(booking.bookingId);
            onOpenChange(false);
        } catch (err) {
            setError(toDisplayError(err as ApiError).message);
        } finally {
            setIsCancelling(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[calc(100%-2rem)] rounded-lg">
                <DialogHeader>
                    <DialogTitle>Cancel booking</DialogTitle>
                </DialogHeader>

                {/*-==-==-=-=-=-=--==-=-=-=-Booking summary-==-==-=-=-=-=-=-=-=---==*/}
                <div className="flex flex-col items-start gap-2 text-xs lg:text-base">
                    <p className="flex items-center gap-2 text-muted-foreground">
                        <CalendarDays className="h-3.5 w-3.5 lg:h-4 lg:w-4"/>
                        {formatBookingDate(booking.date)} · {formatTime(booking.startTime)}–{formatTime(booking.endTime)}
                    </p>
                    <p className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5 lg:h-4 lg:w-4"/>
                        {booking.branch.name}
                    </p>
                    <Badge variant="secondary">#{booking.reference}</Badge>
                </div>

                <Separator/>

                {/*-==-==-=-=-=-=--==-=-=-=-Penalty / safe notice-==-==-=-=-=-=-=-=-=---==*/}
                {penalty ? (
                    <>
                        <div className="rounded-lg border border-destructive/50 p-3 text-xs text-destructive lg:p-4 lg:text-base">
                            <p className="flex items-center gap-2 font-semibold">
                                <TriangleAlert className="h-4 w-4"/>
                                Penalty applies.
                            </p>
                            <p className="pt-1">
                                If you cancel this booking, your account can be suspended.
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="acknowledge-penalty"
                                checked={acknowledged}
                                onCheckedChange={(checked) => setAcknowledged(checked === true)}
                            />
                            <Label htmlFor="acknowledge-penalty">I acknowledge the penalty terms.</Label>
                        </div>
                    </>
                ) : (
                    <div className="rounded-lg border border-success-badge p-3 text-xs lg:p-4 lg:text-base">
                        <p className="flex items-center gap-2">
                            <CircleCheck className="h-4 w-4 text-success-badge-foreground"/>
                            You can safely cancel this booking
                        </p>
                    </div>
                )}

                {/*-==-==-=-=-=-=--==-=-=-=-Actions-==-==-=-=-=-=-=-=-=---==*/}
                <div className="flex justify-end gap-2">
                    <Button variant="secondary" size="sm" className="lg:h-9 lg:px-4 lg:py-2 lg:text-sm" onClick={() => onOpenChange(false)} disabled={isCancelling}>
                        Return
                    </Button>
                    <Button
                        variant="destructive"
                        size="sm"
                        className="lg:h-9 lg:px-4 lg:py-2 lg:text-sm"
                        onClick={onConfirm}
                        disabled={isCancelling || (penalty && !acknowledged)}
                    >
                        {isCancelling ? "Cancelling..." : "Yes, Cancel"}
                    </Button>
                </div>

                <FormErrorAlert message={error}/>
            </DialogContent>
        </Dialog>
    )
}
