import {OwnerBooking} from "@/features/ownerBooking/ownerBookingTypes";
import {formatClock, initialsOf, ownerBookingStatusLabel, ownerBookingStatusVariant} from "@/features/ownerBooking/ownerBookingList";
import {cn} from "@/lib/utils";
import {Badge} from "@/_components/shadcn/badge";

export default function OwnerBookingCard({booking, selected, onSelect}: {
    booking: OwnerBooking;
    selected: boolean;
    onSelect: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onSelect}
            className={cn(
                "flex w-full flex-col gap-2 rounded-xl border bg-card p-4 text-left text-card-foreground shadow-sm transition-colors",
                selected ? "border-primary bg-accent/40" : "hover:bg-accent/30"
            )}
        >
            <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-semibold tabular-nums">
                    {formatClock(booking.start)}–{formatClock(booking.end)}
                </span>
                <Badge variant={ownerBookingStatusVariant(booking.status)}>
                    {ownerBookingStatusLabel(booking.status)}
                </Badge>
            </div>

            <div>
                <p className="text-sm font-medium">{booking.customer.name}</p>
                <p className="text-xs text-muted-foreground">
                    {booking.car.brand} {booking.car.model} · {booking.car.plate}
                </p>
            </div>

            {booking.services.length > 0 && (
                <div className="flex flex-wrap gap-1">
                    {booking.services.map((service, i) => (
                        <Badge key={`${service.name}-${i}`} variant="outline">{service.name}</Badge>
                    ))}
                </div>
            )}

            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                {booking.employees.length > 0 && (
                    <span className="flex items-center gap-1">
                        {booking.employees.map((employee, i) => (
                            <span
                                key={`${employee.name}-${i}`}
                                className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-muted text-xs font-medium text-foreground"
                            >
                                {initialsOf(employee.name)}
                            </span>
                        ))}
                    </span>
                )}
                {booking.bay && <Badge variant="secondary">{booking.bay}</Badge>}
                <span className="ml-auto tabular-nums">#{booking.reference}</span>
            </div>
        </button>
    );
}
