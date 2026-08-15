"use client"

import {CalendarDays, Car, MapPin} from "lucide-react";
import {Button} from "@/_components/shadcn/button";
import {Separator} from "@/_components/shadcn/separator";
import {Workshop, WorkshopService} from "@/features/workshop/workshopTypes";
import {fullAddress} from "@/features/workshop/workshopList";
import {formatBookingDate, formatPrice} from "@/features/booking/bookingList";
import {SlotPick} from "@/features/slots/slotTypes";
import {useAuth} from "@/features/auth/useAuth";
import {useSelectedCarProfile} from "@/features/carProfile/useSelectedCarProfile";
import StepHeader from "./stepHeader";

export default function ConfirmStep({workshop, services, pick, stepIndex, stepCount, onBack, onConfirm}: {
    workshop: Workshop;
    services: WorkshopService[];
    pick: SlotPick;
    stepIndex: number;
    stepCount: number;
    onBack: () => void;
    onConfirm: () => void;
}) {
    const {isAuthenticated} = useAuth();
    const {selectedCarProfile} = useSelectedCarProfile({enabled: isAuthenticated});
    const total = services.reduce((sum, service) => sum + service.price, 0);

    return (
        <div className="flex flex-col gap-4 p-4">
            <StepHeader title="Confirm your booking" stepIndex={stepIndex} stepCount={stepCount}/>

            <div className="flex flex-col gap-2 text-sm">
                <p className="flex items-start gap-2">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground"/>
                    <span>
                        <span className="block font-medium">{workshop.name}</span>
                        <span className="block text-muted-foreground">{fullAddress(workshop)}</span>
                    </span>
                </p>
                <p className="flex items-start gap-2">
                    <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground"/>
                    <span>
                        <span className="block font-medium tabular-nums">
                            {formatBookingDate(pick.date)} · {pick.startTime} – {pick.endTime}
                        </span>
                        <span className="block text-muted-foreground">Workshop local time ({workshop.tz})</span>
                    </span>
                </p>
                {selectedCarProfile && (
                    <p className="flex items-center gap-2">
                        <Car className="h-4 w-4 shrink-0 text-muted-foreground"/>
                        <span className="min-w-0 wrap-anywhere">
                            {selectedCarProfile.name} · {selectedCarProfile.brandName} {selectedCarProfile.modelName}
                        </span>
                    </p>
                )}
            </div>

            <Separator/>

            <ul className="flex flex-col gap-1 text-sm">
                {services.map((service) => (
                    <li key={service.serviceId} className="flex items-center justify-between gap-3">
                        <span className="min-w-0 wrap-anywhere">{service.name}</span>
                        <span className="shrink-0 tabular-nums">{formatPrice(service.price)}</span>
                    </li>
                ))}
            </ul>
            <div className="flex items-center justify-between border-t pt-3 text-sm font-semibold">
                <span>Total</span>
                <span className="tabular-nums">{formatPrice(total)}</span>
            </div>

            <div className="flex justify-end gap-2">
                <Button variant="secondary" onClick={onBack}>Back</Button>
                {/* TODO(M5): POST /api/customer/bookings {branchId, carProfileId, serviceIds, date, startTime}; until then confirming only closes the flow */}
                <Button onClick={onConfirm}>Confirm booking</Button>
            </div>
        </div>
    );
}
