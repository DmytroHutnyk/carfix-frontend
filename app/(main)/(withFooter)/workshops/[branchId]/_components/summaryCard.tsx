"use client"

import {useState} from "react";
import {Button} from "@/_components/shadcn/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/_components/shadcn/card";
import {Popover, PopoverContent, PopoverTrigger} from "@/_components/shadcn/popover";
import {WorkshopService} from "@/features/workshop/workshopTypes";
import {formatPrice} from "@/features/booking/bookingList";

const VISIBLE_COUNT = 3;

export default function SummaryCard({selectedServices, onRemove}: {
    selectedServices: WorkshopService[];
    onRemove: (serviceId: number) => void;
}) {
    const [showAll, setShowAll] = useState(false);
    const total = selectedServices.reduce((sum, service) => sum + service.price, 0);
    const visible = showAll ? selectedServices : selectedServices.slice(0, VISIBLE_COUNT);

    return (
        <Card>
            <CardHeader><CardTitle>Summary</CardTitle></CardHeader>
            <CardContent className="flex flex-col gap-3">
                {selectedServices.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No services selected yet.</p>
                ) : (
                    <>
                        <ul className="flex flex-col gap-2">
                            {visible.map((service) => (
                                <li key={service.serviceId}
                                    className="flex flex-col gap-2 rounded-lg bg-muted/50 p-3">
                                    {/* Full width, wrapping: a truncated service name is unreadable in a 360px rail */}
                                    <span className="font-medium wrap-anywhere">{service.name}</span>
                                    <div className="flex items-center justify-between gap-3">
                                        <span className="text-sm font-semibold tabular-nums">
                                            {formatPrice(service.price)}
                                        </span>
                                        <Button size="sm" onClick={() => onRemove(service.serviceId)}>
                                            Remove
                                        </Button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        {selectedServices.length > VISIBLE_COUNT && (
                            <Button
                                variant="secondary"
                                size="sm"
                                className="self-center"
                                onClick={() => setShowAll((value) => !value)}
                            >
                                {showAll ? "Show less" : `Show all ${selectedServices.length}`}
                            </Button>
                        )}
                        {/* Addition over the mock: a basket without a total forces mental math */}
                        <div className="flex items-center justify-between border-t pt-3 text-sm">
                            <span className="font-semibold">Total</span>
                            <span className="font-semibold tabular-nums">{formatPrice(total)}</span>
                        </div>
                    </>
                )}
                <Popover>
                    <PopoverTrigger asChild>
                        <Button className="w-full" disabled={selectedServices.length === 0}>
                            Book now
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-72 text-sm">
                        Time selection is coming soon — the booking form will open here.
                    </PopoverContent>
                </Popover>
            </CardContent>
        </Card>
    );
}
