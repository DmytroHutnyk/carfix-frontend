"use client"

import {ChevronDown} from "lucide-react";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/_components/shadcn/card";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/_components/shadcn/collapsible";
import {Button} from "@/_components/shadcn/button";
import {WorkshopServiceCategory} from "@/features/workshop/workshopTypes";
import {formatPrice} from "@/features/booking/bookingList";
import {MAX_SERVICES_PER_VISIT} from "@/features/slots/slotList";

export default function ServicesSection({categories, selectedIds, onToggle}: {
    categories: WorkshopServiceCategory[];
    selectedIds: number[];
    onToggle: (serviceId: number) => void;
}) {
    const basketFull = selectedIds.length >= MAX_SERVICES_PER_VISIT;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Services we provide</CardTitle>
                <CardDescription>Select up to {MAX_SERVICES_PER_VISIT} services for one visit.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
                {categories.length === 0 && (
                    <p className="text-sm text-muted-foreground">No services listed yet.</p>
                )}
                {categories.map((category) => (
                    <Collapsible key={category.categoryId} defaultOpen>
                        <CollapsibleTrigger className="group flex w-full items-center justify-between border-b py-2">
                            <span className="text-sm font-semibold lg:text-base">{category.name}</span>
                            <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180"/>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            <ul className="flex flex-col divide-y">
                                {category.services.map((service) => {
                                    const selected = selectedIds.includes(service.serviceId);
                                    return (
                                        <li key={service.serviceId} className="flex items-center gap-2 py-2 lg:gap-4 lg:py-3">
                                            <span className="min-w-0 flex-1">
                                                <span className="block truncate text-sm font-medium lg:text-base">{service.name}</span>
                                                <span className="block text-xs text-muted-foreground lg:text-sm">
                                                    Duration: {service.durationMinutes} minutes
                                                </span>
                                            </span>
                                            <span className="shrink-0 text-sm font-semibold tabular-nums lg:text-base">
                                                {formatPrice(service.price)}
                                            </span>
                                            <Button
                                                className="shrink-0"
                                                variant={selected ? "secondary" : "default"}
                                                size="sm"
                                                disabled={!selected && basketFull}
                                                onClick={() => onToggle(service.serviceId)}
                                            >
                                                {selected ? "Selected" : "Select"}
                                            </Button>
                                        </li>
                                    );
                                })}
                            </ul>
                        </CollapsibleContent>
                    </Collapsible>
                ))}
            </CardContent>
        </Card>
    );
}
