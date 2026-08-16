"use client"

import {useState} from "react";
import {Button} from "@/_components/shadcn/button";
import {Popover, PopoverContent, PopoverTrigger} from "@/_components/shadcn/popover";
import {Workshop, WorkshopService} from "@/features/workshop/workshopTypes";
import {VisitRange} from "@/features/slots/slotTypes";
import BookingFlow from "./bookingFlow";

export default function BookingFlowPopover({workshop, selectedServices, onToggleService, initialRange}: {
    workshop: Workshop;
    selectedServices: WorkshopService[];
    onToggleService: (serviceId: number) => void;
    initialRange: VisitRange | null;
}) {
    const [open, setOpen] = useState(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
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
                    workshop={workshop}
                    selectedServices={selectedServices}
                    onToggleService={onToggleService}
                    initialRange={initialRange}
                    onClose={() => setOpen(false)}
                />
            </PopoverContent>
        </Popover>
    );
}
