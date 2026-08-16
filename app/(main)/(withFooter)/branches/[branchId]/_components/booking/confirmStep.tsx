"use client"

import {useState} from "react";
import Link from "next/link";
import {CalendarDays, Car, MapPin} from "lucide-react";
import {Button} from "@/_components/shadcn/button";
import {Separator} from "@/_components/shadcn/separator";
import FormErrorAlert from "@/_components/formErrorAlert";
import {Workshop, WorkshopService} from "@/features/workshop/workshopTypes";
import {fullAddress} from "@/features/workshop/workshopList";
import {Booking} from "@/features/booking/bookingTypes";
import {formatBookingDate, formatPrice, isStaleSlotError} from "@/features/booking/bookingList";
import {useBookings} from "@/features/booking/useBookings";
import {SlotPick} from "@/features/slots/slotTypes";
import {useAuth} from "@/features/auth/useAuth";
import {useSelectedCarProfile} from "@/features/carProfile/useSelectedCarProfile";
import {toDisplayError} from "@/lib/errorHandler";
import {ApiError, DisplayError} from "@/lib/apiTypes";
import StepHeader from "./stepHeader";

export default function ConfirmStep({workshop, services, pick, stepIndex, stepCount, onBack, onBooked, onRepick}: {
    workshop: Workshop;
    services: WorkshopService[];
    pick: SlotPick;
    stepIndex: number;
    stepCount: number;
    onBack: () => void;
    onBooked: (booking: Booking) => void;
    onRepick: (reason: string) => void;
}) {
    const {isAuthenticated, isLoading: isSessionLoading} = useAuth();
    const {carProfiles, selectedCarProfile, isLoading: areCarsLoading} = useSelectedCarProfile({enabled: isAuthenticated});
    const {createBooking} = useBookings({enabled: false});
    const [error, setError] = useState<DisplayError | null>(null);
    const [isBooking, setIsBooking] = useState(false);

    const total = services.reduce((sum, service) => sum + service.price, 0);
    const needsLogin = (!isSessionLoading && !isAuthenticated) || error?.status === 401;
    const hasNoCars = !needsLogin && !areCarsLoading && carProfiles.length === 0;
    const noCarSelected = !needsLogin && !hasNoCars && !areCarsLoading && !selectedCarProfile;

    const submitBooking = async () => {
        if (!selectedCarProfile) return;
        setError(null);
        setIsBooking(true);
        try {
            const booking = await createBooking({
                branchId: workshop.branchId,
                carProfileId: selectedCarProfile.id,
                serviceIds: services.map((service) => service.serviceId),
                date: pick.date,
                startTime: pick.startTime,
            });
            onBooked(booking);
        } catch (err) {
            const apiError = err as ApiError;
            if (isStaleSlotError(apiError)) onRepick(toDisplayError(apiError).message);
            else setError(toDisplayError(apiError));
        } finally {
            setIsBooking(false);
        }
    };

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

            <div className="flex flex-col gap-3">
                {needsLogin && <p className="text-sm text-muted-foreground">Log in to book this visit.</p>}
                {hasNoCars && <p className="text-sm text-muted-foreground">Add your car first to book.</p>}
                {noCarSelected && <p className="text-sm text-muted-foreground">Select your car in the header first.</p>}

                <FormErrorAlert message={error?.message ?? null}/>

                <div className="flex justify-end gap-2">
                    <Button variant="secondary" onClick={onBack} disabled={isBooking}>Back</Button>
                    {needsLogin ? (
                        /* The login page returns the visitor here with router.back() — the app carries no return-to param */
                        <Button asChild><Link href="/login">Log in</Link></Button>
                    ) : hasNoCars ? (
                        <Button asChild><Link href="/cars">Add a car</Link></Button>
                    ) : (
                        <Button
                            onClick={submitBooking}
                            disabled={isBooking || isSessionLoading || areCarsLoading || !selectedCarProfile}
                        >
                            {isBooking ? "Booking..." : "Confirm booking"}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
