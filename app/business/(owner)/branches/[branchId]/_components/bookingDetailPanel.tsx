import {ReactNode} from "react";

import {OwnerBooking} from "@/features/ownerBooking/ownerBookingTypes";
import {
    formatClock,
    formatDateTime,
    formatMoney,
    initialsOf,
    ownerBookingStatusLabel,
    ownerBookingStatusVariant,
} from "@/features/ownerBooking/ownerBookingList";
import {Card, CardContent} from "@/_components/shadcn/card";
import {Badge} from "@/_components/shadcn/badge";
import {Separator} from "@/_components/shadcn/separator";

export default function BookingDetailPanel({booking, dateLabel}: {
    booking: OwnerBooking;
    dateLabel: string;
}) {
    return (
        <Card>
            <CardContent className="flex flex-col gap-5 p-6">
                <div>
                    <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-lg font-semibold tracking-tight">{dateLabel}</h2>
                        <Badge variant={ownerBookingStatusVariant(booking.status)}>
                            {ownerBookingStatusLabel(booking.status)}
                        </Badge>
                        <span className="ml-auto text-sm tabular-nums text-muted-foreground">#{booking.reference}</span>
                    </div>
                    <p className="pt-1 text-sm tabular-nums text-muted-foreground">
                        {formatClock(booking.start)}–{formatClock(booking.end)}
                    </p>
                </div>

                <Separator/>

                <Section title="Customer">
                    <dl className="grid grid-cols-[max-content_1fr] gap-x-3 gap-y-1 text-sm">
                        <dt className="text-muted-foreground">Name</dt>
                        <dd>{booking.customer.name}</dd>
                        <dt className="text-muted-foreground">Phone</dt>
                        <dd className="tabular-nums">{booking.customer.phone}</dd>
                        <dt className="text-muted-foreground">Email</dt>
                        <dd className="break-all">{booking.customer.email}</dd>
                    </dl>
                </Section>

                <Section title="Vehicle">
                    <dl className="grid grid-cols-[max-content_1fr] gap-x-3 gap-y-1 text-sm">
                        <dt className="text-muted-foreground">Model</dt>
                        <dd>{booking.car.brand} {booking.car.model}</dd>
                        <dt className="text-muted-foreground">Plate</dt>
                        <dd className="tabular-nums">{booking.car.plate}</dd>
                    </dl>
                </Section>

                <Section title="Assignments">
                    <div className="flex flex-col gap-2 text-sm">
                        <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">Bay</span>
                            {booking.bay
                                ? <Badge variant="secondary">{booking.bay}</Badge>
                                : <span className="text-muted-foreground">—</span>}
                        </div>
                        {booking.employees.length > 0 && (
                            <ul className="flex flex-col gap-1">
                                {booking.employees.map((employee, i) => (
                                    <li key={`${employee.name}-${i}`} className="flex items-center gap-2">
                                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-medium text-foreground">
                                            {initialsOf(employee.name)}
                                        </span>
                                        <span>{employee.name}</span>
                                        <span className="text-muted-foreground">· {employee.role}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                        {booking.equipment.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                                {booking.equipment.map((item, i) => (
                                    <Badge key={`${item}-${i}`} variant="outline">{item}</Badge>
                                ))}
                            </div>
                        )}
                    </div>
                </Section>

                <Section title="Services">
                    <ul className="divide-y text-sm">
                        {booking.services.map((service, i) => (
                            <li key={`${service.name}-${i}`} className="flex items-center justify-between gap-3 py-1.5">
                                <span className="min-w-0">{service.name}</span>
                                <span className="flex shrink-0 items-center gap-3 tabular-nums">
                                    <span className="text-muted-foreground">{service.durationMinutes} min</span>
                                    <span className="font-medium">{formatMoney(service.price)}</span>
                                </span>
                            </li>
                        ))}
                    </ul>
                </Section>

                <Section title="Timing & Details">
                    <dl className="grid grid-cols-[max-content_1fr] gap-x-3 gap-y-1 text-sm">
                        <dt className="text-muted-foreground">Total duration</dt>
                        <dd className="tabular-nums">{booking.totalDurationMinutes} min</dd>
                        <dt className="text-muted-foreground">Created</dt>
                        <dd className="tabular-nums">{formatDateTime(booking.createdAt)}</dd>
                    </dl>
                </Section>
            </CardContent>
        </Card>
    );
}

function Section({title, children}: { title: string; children: ReactNode }) {
    return (
        <div className="space-y-2">
            <h3 className="text-sm font-semibold">{title}</h3>
            {children}
        </div>
    );
}
