"use client"

import {useRef, useState} from "react";
import {Button} from "@/_components/shadcn/button";
import {Dialog, DialogContent, DialogTrigger} from "@/_components/shadcn/dialog";
import {Workshop, WorkshopService} from "@/features/workshop/workshopTypes";
import {VisitRange} from "@/features/slots/slotTypes";
import BookingFlow from "./bookingFlow";

export default function BookingFlowDialog({workshop, selectedServices, onToggleService, initialRange, onBookingComplete}: {
    workshop: Workshop;
    selectedServices: WorkshopService[];
    onToggleService: (serviceId: number) => void;
    initialRange: VisitRange | null;
    onBookingComplete: () => void;
}) {
    const [open, setOpen] = useState(false);
    const [flowKey, setFlowKey] = useState(0);
    const booked = useRef(false);

    // The summary card sits behind the dialog, so the basket is emptied only once the flow is out of the way
    const onOpenChange = (next: boolean) => {
        setOpen(next);
        if (next) {
            // Radix keeps the old content mounted through the close animation; a new key guarantees a fresh flow
            setFlowKey((key) => key + 1);
            return;
        }
        if (booked.current) {
            booked.current = false;
            onBookingComplete();
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button className="w-full" disabled={selectedServices.length === 0}>
                    Book now
                </Button>
            </DialogTrigger>
            <DialogContent className="w-[calc(100vw-2rem)] max-w-md gap-0 overflow-hidden rounded-xl bg-card p-0 text-card-foreground sm:rounded-xl">
                <div className="max-h-[85vh] overflow-y-auto">
                    <BookingFlow
                        key={flowKey}
                        workshop={workshop}
                        selectedServices={selectedServices}
                        onToggleService={onToggleService}
                        initialRange={initialRange}
                        onBooked={() => {booked.current = true}}
                        onClose={() => onOpenChange(false)}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}
