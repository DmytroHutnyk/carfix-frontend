'use client'

import {useMemo, useState} from "react";
import {addDays, format} from "date-fns";
import {ChevronLeft, ChevronRight, Search} from "lucide-react";
import {OrbitProgress} from "react-loading-indicators";

import {useOwnerBranchBookings} from "@/features/ownerBooking/useOwnerBranchBookings";
import {OwnerBookingSort, filterOwnerBookings, sortOwnerBookings} from "@/features/ownerBooking/ownerBookingList";
import {toDisplayError} from "@/lib/errorHandler";
import {ApiError} from "@/lib/apiTypes";

import {Input} from "@/_components/shadcn/input";
import {Button} from "@/_components/shadcn/button";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/_components/shadcn/select";
import {Card, CardContent} from "@/_components/shadcn/card";
import FormErrorAlert from "@/_components/formErrorAlert";
import BranchTabShell from "@/business/(owner)/branches/[branchId]/_components/branchTabShell";
import OwnerBookingCard from "@/business/(owner)/branches/[branchId]/_components/ownerBookingCard";
import BookingDetailPanel from "@/business/(owner)/branches/[branchId]/_components/bookingDetailPanel";

export default function BranchBookingsContent({branchId}: { branchId: string }) {
    const [day, setDay] = useState<Date>(() => new Date());
    const [query, setQuery] = useState("");
    const [sort, setSort] = useState<OwnerBookingSort>("startAsc");
    const [selectedRef, setSelectedRef] = useState<string | null>(null);

    const isoDate = format(day, "yyyy-MM-dd");
    const {bookings, isLoading, isError, error} = useOwnerBranchBookings(branchId, isoDate);

    const visible = useMemo(
        () => sortOwnerBookings(filterOwnerBookings(bookings, query), sort),
        [bookings, query, sort]
    );

    const selected = visible.find((b) => b.reference === selectedRef) ?? visible[0] ?? null;

    return (
        <BranchTabShell branchId={branchId} active="bookings">
            <div className="grid gap-4 lg:grid-cols-[minmax(0,380px)_1fr] lg:gap-6">
                <div className="flex flex-col gap-3">
                    <h2 className="text-lg font-semibold tracking-tight">Bookings Browser</h2>

                    <div className="relative">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/>
                        <Input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search customer, plate, service"
                            className="pl-9"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <Button type="button" variant="outline" size="icon" onClick={() => setDay((d) => addDays(d, -1))} aria-label="Previous day">
                            <ChevronLeft/>
                        </Button>
                        <span className="flex-1 text-center text-sm font-medium tabular-nums">{format(day, "EEE, MMM d")}</span>
                        <Button type="button" variant="outline" size="icon" onClick={() => setDay((d) => addDays(d, 1))} aria-label="Next day">
                            <ChevronRight/>
                        </Button>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                        <Select value={sort} onValueChange={(value) => setSort(value as OwnerBookingSort)}>
                            <SelectTrigger className="w-[170px]">
                                <SelectValue/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="startAsc">Earliest first</SelectItem>
                                <SelectItem value="startDesc">Latest first</SelectItem>
                            </SelectContent>
                        </Select>
                        <span className="text-xs text-muted-foreground">
                            Result: {visible.length} {visible.length === 1 ? "entry" : "entries"}
                        </span>
                    </div>

                    {isError && <FormErrorAlert message={toDisplayError(error as ApiError).message}/>}

                    {isLoading ? (
                        <div className="flex min-h-[30vh] items-center justify-center">
                            <OrbitProgress color="var(--primary)" size="medium" text="" textColor="" dense/>
                        </div>
                    ) : visible.length === 0 ? (
                        <p className="py-8 text-center text-sm text-muted-foreground">No bookings for this day.</p>
                    ) : (
                        <div className="flex flex-col gap-2">
                            {visible.map((booking) => (
                                <OwnerBookingCard
                                    key={booking.reference}
                                    booking={booking}
                                    selected={selected?.reference === booking.reference}
                                    onSelect={() => setSelectedRef(booking.reference)}
                                />
                            ))}
                        </div>
                    )}
                </div>

                <div>
                    {selected ? (
                        <BookingDetailPanel booking={selected} dateLabel={format(day, "EEEE, MMMM d, yyyy")}/>
                    ) : (
                        <Card>
                            <CardContent className="flex min-h-[30vh] items-center justify-center p-6 text-sm text-muted-foreground">
                                Select a booking to see its details.
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </BranchTabShell>
    );
}
