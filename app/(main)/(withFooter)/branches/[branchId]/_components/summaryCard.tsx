"use client"

import {Button} from "@/_components/shadcn/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/_components/shadcn/card";
import {Workshop, WorkshopService} from "@/features/workshop/workshopTypes";
import {VisitRange} from "@/features/slots/slotTypes";
import {formatPrice} from "@/features/booking/bookingList";
import {MAX_SERVICES_PER_VISIT} from "@/features/slots/slotList";
import BookingFlowPopover from "./booking/bookingFlowPopover";

export default function SummaryCard({workshop, selectedServices, onToggle, initialRange}: {
    workshop: Workshop;
    selectedServices: WorkshopService[];
    onToggle: (serviceId: number) => void;
    initialRange: VisitRange | null;
}) {
    const total = selectedServices.reduce((sum, service) => sum + service.price, 0);

    return (
        <Card>
            <CardHeader><CardTitle>Summary</CardTitle></CardHeader>
            <CardContent className="flex flex-col gap-3">
                {selectedServices.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                        No services selected yet. Pick up to {MAX_SERVICES_PER_VISIT} for one visit.
                    </p>
                ) : (
                    <>
                        <ul className="flex flex-col gap-2">
                            {selectedServices.map((service) => (
                                <li key={service.serviceId}
                                    className="flex flex-col gap-2 rounded-lg bg-muted/50 p-3">
                                    {/* Full width, wrapping: a truncated service name is unreadable in a 360px rail */}
                                    <span className="font-medium wrap-anywhere">{service.name}</span>
                                    <div className="flex items-center justify-between gap-3">
                                        <span className="text-sm font-semibold tabular-nums">
                                            {formatPrice(service.price)}
                                        </span>
                                        <Button size="sm" onClick={() => onToggle(service.serviceId)}>
                                            Remove
                                        </Button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        {/* Addition over the mock: a basket without a total forces mental math */}
                        <div className="flex items-center justify-between border-t pt-3 text-sm">
                            <span className="font-semibold">Total</span>
                            <span className="font-semibold tabular-nums">{formatPrice(total)}</span>
                        </div>
                    </>
                )}
                <BookingFlowPopover
                    workshop={workshop}
                    selectedServices={selectedServices}
                    onToggleService={onToggle}
                    initialRange={initialRange}
                />
            </CardContent>
        </Card>
    );
}
