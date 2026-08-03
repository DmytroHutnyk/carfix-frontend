'use client'

import {useState} from "react";
import {CalendarDays, CircleCheck, MapPin, TriangleAlert} from "lucide-react";

import {Booking} from "@/util/types/bookingTypes";
import {useBookings} from "@/util/hooks/useBookings";
import {formatBookingDate, formatTime, isPenaltyCancel} from "@/util/func/bookingList";
import {toDisplayError} from "@/util/func/errorHandler";
import {ApiError} from "@/util/types/apiTypes";

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
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Cancel booking</DialogTitle>
                </DialogHeader>

                {/*-==-==-=-=-=-=--==-=-=-=-Booking summary-==-==-=-=-=-=-=-=-=---==*/}
                <div className="flex flex-col items-start gap-2">
                    <p className="flex items-center gap-2 text-muted-foreground">
                        <CalendarDays className="h-4 w-4"/>
                        {formatBookingDate(booking.date)} · {formatTime(booking.startTime)}–{formatTime(booking.endTime)}
                    </p>
                    <p className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4"/>
                        {booking.branch.name}
                    </p>
                    <Badge variant="secondary">#{booking.reference}</Badge>
                </div>

                <Separator/>

                {/*-==-==-=-=-=-=--==-=-=-=-Penalty / safe notice-==-==-=-=-=-=-=-=-=---==*/}
                {penalty ? (
                    <>
                        <div className="rounded-lg border border-destructive/50 p-4 text-destructive">
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
                    <div className="rounded-lg border border-success-badge p-4">
                        <p className="flex items-center gap-2">
                            <CircleCheck className="h-4 w-4 text-success-badge-foreground"/>
                            You can safely cancel this booking
                        </p>
                    </div>
                )}

                {/*-==-==-=-=-=-=--==-=-=-=-Actions-==-==-=-=-=-=-=-=-=---==*/}
                <div className="flex justify-start gap-2">
                    <Button variant="secondary" onClick={() => onOpenChange(false)} disabled={isCancelling}>
                        Return
                    </Button>
                    <Button
                        variant="destructive"
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
