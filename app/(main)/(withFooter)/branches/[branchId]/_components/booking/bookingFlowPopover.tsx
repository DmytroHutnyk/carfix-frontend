"use client"

import {useRef, useState} from "react";
import {Button} from "@/_components/shadcn/button";
import {Popover, PopoverContent, PopoverTrigger} from "@/_components/shadcn/popover";
import {Workshop, WorkshopService} from "@/features/workshop/workshopTypes";
import {VisitRange} from "@/features/slots/slotTypes";
import BookingFlow from "./bookingFlow";

export default function BookingFlowPopover({workshop, selectedServices, onToggleService, initialRange, onBookingComplete}: {
    workshop: Workshop;
    selectedServices: WorkshopService[];
    onToggleService: (serviceId: number) => void;
    initialRange: VisitRange | null;
    onBookingComplete: () => void;
}) {
    const [open, setOpen] = useState(false);
    const [flowKey, setFlowKey] = useState(0);
    const booked = useRef(false);

    // This popover is anchored to the Summary card's own button, so the basket is emptied only after
    // the flow closes — clearing it under the success card would shrink the card and move the anchor.
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
        <Popover open={open} onOpenChange={onOpenChange}>
            <PopoverTrigger asChild>
                <Button className="w-full" disabled={selectedServices.length === 0}>
                    Book now
                </Button>
            </PopoverTrigger>
            <PopoverContent
                aria-label="Book a visit"
                align="end"
                collisionPadding={16}
                className="w-[min(420px,calc(100vw-2rem))] max-h-[var(--radix-popover-content-available-height)] overflow-y-auto p-0"
            >
                <BookingFlow
                    key={flowKey}
                    workshop={workshop}
                    selectedServices={selectedServices}
                    onToggleService={onToggleService}
                    initialRange={initialRange}
                    onBooked={() => {booked.current = true}}
                    onClose={() => onOpenChange(false)}
                />
            </PopoverContent>
        </Popover>
    );
}
