"use client"

import {ChevronDown} from "lucide-react";
import {Card, CardContent, CardHeader, CardTitle} from "@/_components/shadcn/card";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/_components/shadcn/collapsible";
import {Button} from "@/_components/shadcn/button";
import {WorkshopServiceCategory} from "@/features/workshop/workshopTypes";
import {formatPrice} from "@/features/booking/bookingList";

export default function ServicesSection({categories, selectedIds, onToggle}: {
    categories: WorkshopServiceCategory[];
    selectedIds: number[];
    onToggle: (serviceId: number) => void;
}) {
    return (
        <Card>
            <CardHeader><CardTitle>Services we provide</CardTitle></CardHeader>
            <CardContent className="flex flex-col gap-2">
                {categories.length === 0 && (
                    <p className="text-sm text-muted-foreground">No services listed yet.</p>
                )}
                {categories.map((category) => (
                    <Collapsible key={category.categoryId} defaultOpen>
                        <CollapsibleTrigger className="group flex w-full items-center justify-between border-b py-2">
                            <span className="font-semibold">{category.name}</span>
                            <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180"/>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            <ul className="flex flex-col divide-y">
                                {category.services.map((service) => {
                                    const selected = selectedIds.includes(service.serviceId);
                                    return (
                                        <li key={service.serviceId} className="flex items-center gap-4 py-3">
                                            <span className="min-w-0 flex-1">
                                                <span className="block font-medium">{service.name}</span>
                                                <span className="block text-sm text-muted-foreground">
                                                    Duration: {service.durationMinutes} minutes
                                                </span>
                                            </span>
                                            <span className="shrink-0 font-semibold tabular-nums">
                                                {formatPrice(service.price)}
                                            </span>
                                            <Button
                                                variant={selected ? "secondary" : "default"}
                                                size="sm"
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
