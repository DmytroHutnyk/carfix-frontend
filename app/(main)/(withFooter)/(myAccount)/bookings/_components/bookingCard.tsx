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

const STATUS_BADGE_VARIANTS: Record<BookingStatus, "default" | "success" | "secondary" | "destructiveSoft" | "destructive"> = {
    SCHEDULED: "success",
    IN_PROGRESS: "default",
    COMPLETED: "secondary",
    CANCELLED: "destructiveSoft",
    NO_SHOW: "destructive",
};

export default function BookingCard({booking, onCancel, onReview, isReviewed}: {
    booking: Booking;
    onCancel: () => void;
    onReview: () => void;
    isReviewed: boolean;
}) {
    const {branch, vehicle} = booking;

    return (
        <Card>
            <CardContent className="flex flex-col gap-3 p-3 lg:gap-4 lg:p-6">
                {/*-==-==-=-=-=-=--==-=-=-=-Status / date / reference-==-==-=-=-=-=-=-=-=---==*/}
                <div className="flex flex-wrap items-center gap-2 lg:gap-3">
                    <Badge variant={STATUS_BADGE_VARIANTS[booking.status]}>
                        {STATUS_LABELS[booking.status]}
                    </Badge>
                    <p className="flex items-center gap-1.5 text-xs text-muted-foreground lg:gap-2 lg:text-base">
                        <CalendarDays className="h-3.5 w-3.5 lg:h-4 lg:w-4"/>
                        {formatBookingDate(booking.date)} · {formatTime(booking.startTime)}–{formatTime(booking.endTime)}
                    </p>
                    <p className="ml-auto text-xs tabular-nums text-muted-foreground lg:text-base">#{booking.reference}</p>
                </div>

                <Separator/>

                {/*-==-==-=-=-=-=--==-=-=-=-Branch + vehicle-==-==-=-=-=-=-=-=-=---==*/}
                <div className="flex flex-col gap-2 lg:flex-row lg:flex-wrap lg:items-start lg:justify-between lg:gap-6">
                    <div className="space-y-0.5">
                        <h2 className="text-sm font-semibold tracking-tight lg:text-xl lg:font-bold">{branch.name}</h2>
                        <p className="flex items-center gap-1 text-xs text-muted-foreground lg:text-base">
                            <MapPin className="h-3.5 w-3.5 shrink-0 lg:h-4 lg:w-4"/>
                            ul. {branch.streetName} {branch.buildingNumber}, {branch.city}
                        </p>
                    </div>
                    <div className="lg:text-right">
                        <p className="flex flex-wrap items-center gap-1.5 text-xs lg:justify-end lg:gap-2 lg:text-base">
                            <span className="font-semibold">Vehicle:</span>
                            <Car className="h-3.5 w-3.5 text-muted-foreground lg:h-4 lg:w-4"/>
                            {vehicle.name} – {vehicle.brandName} {vehicle.modelName}
                        </p>
                        {vehicle.plates && (
                            <p className="text-xs text-muted-foreground lg:text-base">{vehicle.plates}</p>
                        )}
                    </div>
                </div>

                {/*-==-==-=-=-=-=--==-=-=-=-Services-==-==-=-=-=-=-=-=-=---==*/}
                <div>
                    <h3 className="pb-2 text-xs font-medium text-muted-foreground lg:text-base lg:font-semibold lg:text-foreground">
                        Selected services
                    </h3>

                    <ul className="divide-y text-xs lg:hidden">
                        {booking.services.map((s, i) => (
                            <li key={`${s.name}-${i}`} className="flex items-center justify-between gap-3 py-1.5">
                                <span className="min-w-0">{s.name}</span>
                                <span className="shrink-0 tabular-nums text-muted-foreground">{formatPrice(s.price)}</span>
                            </li>
                        ))}
                        <li className="flex items-center justify-between gap-3 py-1.5 font-semibold">
                            <span>Total</span>
                            <span className="tabular-nums">{formatPrice(booking.totalPrice)}</span>
                        </li>
                    </ul>

                    <div className="hidden lg:block">
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
                </div>

                {/*-==-==-=-=-=-=--==-=-=-=-Actions-==-==-=-=-=-=-=-=-=---==*/}
                <div className="flex items-center justify-end gap-2 pt-1 lg:justify-between">
                    <ContactBranchPopover branch={branch}/>
                    {booking.status === "SCHEDULED" && (
                        <Button
                            variant="destructive"
                            size="sm"
                            className="lg:h-9 lg:px-4 lg:py-2 lg:text-sm"
                            onClick={onCancel}
                        >
                            Cancel
                        </Button>
                    )}
                    {booking.status === "COMPLETED" && (
                        <Button
                            variant={isReviewed ? "secondary" : "default"}
                            size="sm"
                            className="lg:h-9 lg:px-4 lg:py-2 lg:text-sm"
                            onClick={onReview}
                            disabled={isReviewed}
                        >
                            {isReviewed ? "Reviewed" : "Leave a review"}
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
