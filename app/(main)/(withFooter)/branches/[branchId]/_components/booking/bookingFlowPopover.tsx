"use client"

import {useRef, useState} from "react";
import {Button} from "@/_components/shadcn/button";
import {Popover, PopoverContent, PopoverTrigger} from "@/_components/shadcn/popover";
import {Sheet, SheetContent, SheetTitle, SheetTrigger} from "@/_components/shadcn/sheet";
import {Workshop, WorkshopService} from "@/features/workshop/workshopTypes";
import {VisitRange} from "@/features/slots/slotTypes";
import {useIsMobile} from "@/lib/use-mobile";
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
    const isMobile = useIsMobile();

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

    const trigger = (
        <Button className="w-full" disabled={selectedServices.length === 0}>
            Book now
        </Button>
    );

    const flow = (
        <BookingFlow
            key={flowKey}
            workshop={workshop}
            selectedServices={selectedServices}
            onToggleService={onToggleService}
            initialRange={initialRange}
            onBooked={() => {booked.current = true}}
            onClose={() => onOpenChange(false)}
        />
    );

    if (isMobile) {
        return (
            <Sheet open={open} onOpenChange={onOpenChange}>
                <SheetTrigger asChild>{trigger}</SheetTrigger>
                <SheetContent
                    side="bottom"
                    aria-describedby={undefined}
                    className="max-h-[85vh] overflow-y-auto rounded-t-xl p-0 pt-4"
                >
                    <SheetTitle className="sr-only">Book a visit</SheetTitle>
                    {flow}
                </SheetContent>
            </Sheet>
        );
    }

    return (
        <Popover open={open} onOpenChange={onOpenChange}>
            <PopoverTrigger asChild>{trigger}</PopoverTrigger>
            <PopoverContent
                aria-label="Book a visit"
                align="end"
                collisionPadding={16}
                className="w-[min(420px,calc(100vw-2rem))] max-h-[var(--radix-popover-content-available-height)] overflow-y-auto p-0"
            >
                {flow}
            </PopoverContent>
        </Popover>
    );
}
