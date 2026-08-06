import {CalendarDays, Car, MapPin} from "lucide-react";

import {Booking, BookingStatus} from "@/features/booking/bookingTypes";
import {STATUS_LABELS, formatBookingDate, formatPrice, formatTime} from "@/features/booking/bookingList";

import {Card, CardContent} from "@/_components/shadcn/card";
import {Badge} from "@/_components/shadcn/badge";
import {Button} from "@/_components/shadcn/button";
import {Separator} from "@/_components/shadcn/separator";
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/_components/shadcn/table";
import ContactBranchPopover from "@/(main)/(withFooter)/(myAccount)/bookings/_components/contactBranchPopover";

const STATUS_BADGE_VARIANTS: Record<BookingStatus, "default" | "success" | "secondary" | "destructiveSoft"> = {
    SCHEDULED: "success",
    IN_PROGRESS: "default",
    COMPLETED: "secondary",
    CANCELLED: "destructiveSoft",
};

export default function BookingCard({booking, onCancel}: {
    booking: Booking;
    onCancel: () => void;
}) {
    const {branch, vehicle} = booking;

    return (
        <Card>
            <CardContent className="flex flex-col gap-4 p-6">
                {/*-==-==-=-=-=-=--==-=-=-=-Status / date / reference-==-==-=-=-=-=-=-=-=---==*/}
                <div className="flex flex-wrap items-center gap-3">
                    <Badge variant={STATUS_BADGE_VARIANTS[booking.status]}>
                        {STATUS_LABELS[booking.status]}
                    </Badge>
                    <p className="flex items-center gap-2 text-muted-foreground">
                        <CalendarDays className="h-4 w-4"/>
                        {formatBookingDate(booking.date)} · {formatTime(booking.startTime)}–{formatTime(booking.endTime)}
                    </p>
                    <p className="ml-auto text-muted-foreground">#{booking.reference}</p>
                </div>

                <Separator/>

                {/*-==-==-=-=-=-=--==-=-=-=-Branch + vehicle-==-==-=-=-=-=-=-=-=---==*/}
                <div className="flex flex-wrap items-start justify-between gap-6">
                    <div>
                        <h2 className="text-xl font-bold tracking-tight">{branch.name}</h2>
                        <p className="flex items-center gap-1 text-muted-foreground">
                            <MapPin className="h-4 w-4"/>
                            ul. {branch.streetName} {branch.buildingNumber}, {branch.city}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="flex items-center justify-end gap-2">
                            <span className="font-semibold">Vehicle:</span>
                            <Car className="h-4 w-4 text-muted-foreground"/>
                            {vehicle.name} – {vehicle.brandName} {vehicle.modelName}
                        </p>
                        {vehicle.plates && (
                            <p className="text-muted-foreground">{vehicle.plates}</p>
                        )}
                    </div>
                </div>

                {/*-==-==-=-=-=-=--==-=-=-=-Services table-==-==-=-=-=-=-=-=-=---==*/}
                <div>
                    <h3 className="pb-2 font-semibold">Selected services</h3>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Service</TableHead>
                                <TableHead className="text-right">Price</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {booking.services.map((s, i) => (
                                <TableRow key={`${s.name}-${i}`}>
                                    <TableCell>{s.name}</TableCell>
                                    <TableCell className="text-right tabular-nums">{formatPrice(s.price)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TableCell>Total</TableCell>
                                <TableCell className="text-right text-base font-bold tabular-nums">
                                    {formatPrice(booking.totalPrice)}
                                </TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </div>

                {/*-==-==-=-=-=-=--==-=-=-=-Actions-==-==-=-=-=-=-=-=-=---==*/}
                <div className="flex items-center justify-between pt-1">
                    <ContactBranchPopover branch={branch}/>
                    {booking.status === "SCHEDULED" && (
                        <Button variant="destructive" onClick={onCancel}>
                            Cancel
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
