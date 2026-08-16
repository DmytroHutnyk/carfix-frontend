"use client"

import {Button} from "@/_components/shadcn/button";
import {WorkshopService} from "@/features/workshop/workshopTypes";
import {formatPrice} from "@/features/booking/bookingList";
import {MAX_SERVICES_PER_VISIT} from "@/features/slots/slotList";
import StepHeader from "./stepHeader";

export default function SuggestionsStep({suggestions, selectedIds, onToggle, stepIndex, stepCount, onContinue}: {
    suggestions: WorkshopService[];
    selectedIds: number[];
    onToggle: (serviceId: number) => void;
    stepIndex: number;
    stepCount: number;
    onContinue: () => void;
}) {
    const canAddMore = selectedIds.length < MAX_SERVICES_PER_VISIT;

    return (
        <div className="flex flex-col gap-4 p-4">
            <StepHeader title="Do you need something else?" stepIndex={stepIndex} stepCount={stepCount}/>
            <ul className="flex flex-col gap-2">
                {suggestions.map((service) => {
                    const selected = selectedIds.includes(service.serviceId);
                    return (
                        <li key={service.serviceId} className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                            <span className="min-w-0 flex-1">
                                <span className="block font-medium wrap-anywhere">{service.name}</span>
                                <span className="block text-sm text-muted-foreground">
                                    {service.durationMinutes} min · {formatPrice(service.price)}
                                </span>
                            </span>
                            <Button
                                variant={selected ? "secondary" : "default"}
                                size="sm"
                                disabled={!selected && !canAddMore}
                                onClick={() => onToggle(service.serviceId)}
                            >
                                {selected ? "Added" : "Add"}
                            </Button>
                        </li>
                    );
                })}
            </ul>
            {!canAddMore && (
                <p className="text-xs text-muted-foreground">
                    A visit can include up to {MAX_SERVICES_PER_VISIT} services.
                </p>
            )}
            <Button onClick={onContinue}>Continue</Button>
        </div>
    );
}
