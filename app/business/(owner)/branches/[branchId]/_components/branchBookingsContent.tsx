'use client'

import {useMemo, useState} from "react";
import {addDays, differenceInCalendarDays, format, subYears} from "date-fns";
import {CalendarX2, ChevronLeft, ChevronRight} from "lucide-react";
import {OrbitProgress} from "react-loading-indicators";

import {useOwnerBranchBookings} from "@/features/ownerBooking/useOwnerBranchBookings";
import {OwnerBookingSort, filterOwnerBookings, sortOwnerBookings} from "@/features/ownerBooking/ownerBookingList";
import {toDisplayError} from "@/lib/errorHandler";
import {ApiError} from "@/lib/apiTypes";

import {Button} from "@/_components/shadcn/button";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/_components/shadcn/select";
import {Card, CardContent} from "@/_components/shadcn/card";
import {Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle} from "@/_components/shadcn/empty";
import DateRangePicker from "@/_components/dateRangePicker";
import FormErrorAlert from "@/_components/formErrorAlert";
import BranchTabShell from "@/business/(owner)/branches/[branchId]/_components/branchTabShell";
import BranchFilterBar from "@/business/(owner)/branches/[branchId]/_components/branchFilterBar";
import ResultCount from "@/business/(owner)/branches/[branchId]/_components/resultCount";
import OwnerBookingCard from "@/business/(owner)/branches/[branchId]/_components/ownerBookingCard";
import BookingDetailPanel from "@/business/(owner)/branches/[branchId]/_components/bookingDetailPanel";

export default function BranchBookingsContent({branchId}: { branchId: string }) {
    const [range, setRange] = useState<{from: Date; to: Date}>(() => {
        const t = new Date();
        return {from: t, to: t};
    });
    const [query, setQuery] = useState("");
    const [sort, setSort] = useState<OwnerBookingSort>("startAsc");
    const [selectedIdx, setSelectedIdx] = useState(0);

    const isoFrom = format(range.from, "yyyy-MM-dd");
    const isoTo = format(range.to, "yyyy-MM-dd");
    const {bookings, isLoading, isError, error} = useOwnerBranchBookings(branchId, isoFrom, isoTo);

    const spanDays = differenceInCalendarDays(range.to, range.from) + 1;
    const singleDay = spanDays === 1;
    const today = useMemo(() => new Date(), []);
    const minDate = useMemo(() => subYears(today, 5), [today]);

    const shiftRange = (dir: number) =>
        setRange((r) => ({from: addDays(r.from, dir * spanDays), to: addDays(r.to, dir * spanDays)}));

    const rangeLabel = singleDay
        ? format(range.from, "EEE, MMM d")
        : `${format(range.from, "MMM d")} – ${format(range.to, "MMM d")}`;

    const visible = useMemo(
        () => sortOwnerBookings(filterOwnerBookings(bookings, query), sort),
        [bookings, query, sort]
    );

    const activeIdx = selectedIdx < visible.length ? selectedIdx : 0;
    const selected = visible[activeIdx] ?? null;

    return (
        <BranchTabShell branchId={branchId} active="bookings">
            <div className="grid gap-4 lg:grid-cols-[minmax(0,380px)_1fr] lg:gap-6">
                <div className="flex flex-col gap-3">
                    <section className="flex flex-wrap items-center gap-3">
                        <h2 className="text-lg font-semibold tracking-tight">Bookings</h2>
                    </section>

                    <BranchFilterBar
                        query={query}
                        onQueryChange={setQuery}
                        searchPlaceholder="Search customer, plate, service"
                        onClear={() => { setQuery(""); setSort("startAsc"); }}
                    >
                        <Select value={sort} onValueChange={(value) => setSort(value as OwnerBookingSort)}>
                            <SelectTrigger className="w-full"><SelectValue/></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="startAsc">Earliest first</SelectItem>
                                <SelectItem value="startDesc">Latest first</SelectItem>
                            </SelectContent>
                        </Select>
                    </BranchFilterBar>

                    <div className="flex items-center gap-2">
                        <Button type="button" variant="outline" size="icon" onClick={() => shiftRange(-1)} aria-label="Previous range">
                            <ChevronLeft/>
                        </Button>
                        <DateRangePicker
                            value={{from: isoFrom, to: isoTo}}
                            onChange={(next) => {
                                if (!next.from) return;
                                const from = new Date(next.from + "T00:00:00");
                                const to = next.to ? new Date(next.to + "T00:00:00") : from;
                                setRange({from, to});
                            }}
                            minDate={minDate}
                            maxDays={92}
                            trigger={
                                <Button type="button" variant="outline" className="min-w-0 flex-1 justify-center text-sm font-medium tabular-nums">
                                    <span className="truncate">{rangeLabel}</span>
                                </Button>
                            }
                        />
                        <Button type="button" variant="outline" size="icon" onClick={() => shiftRange(1)} aria-label="Next range">
                            <ChevronRight/>
                        </Button>
                    </div>

                    <ResultCount count={visible.length}/>

                    {isError && <FormErrorAlert message={toDisplayError(error as ApiError).message}/>}

                    {isLoading ? (
                        <div className="flex min-h-[30vh] items-center justify-center">
                            <OrbitProgress color="var(--primary)" size="medium" text="" textColor="" dense/>
                        </div>
                    ) : bookings.length === 0 ? (
                        <Empty>
                            <EmptyHeader>
                                <EmptyMedia variant="icon">
                                    <CalendarX2/>
                                </EmptyMedia>
                                <EmptyTitle>{singleDay ? "No bookings for this day" : "No bookings in this range"}</EmptyTitle>
                                <EmptyDescription>
                                    {singleDay ? "Pick another day to see its bookings." : "Pick another range to see its bookings."}
                                </EmptyDescription>
                            </EmptyHeader>
                        </Empty>
                    ) : visible.length === 0 ? (
                        <p className="pt-6 text-center text-sm text-muted-foreground">No bookings match your filters.</p>
                    ) : (
                        <div className="flex flex-col gap-2">
                            {visible.map((booking, i) => (
                                <OwnerBookingCard
                                    key={`${booking.reference}-${i}`}
                                    booking={booking}
                                    selected={i === activeIdx}
                                    showDate={!singleDay}
                                    onSelect={() => setSelectedIdx(i)}
                                />
                            ))}
                        </div>
                    )}
                </div>

                <div>
                    {selected ? (
                        <BookingDetailPanel
                            booking={selected}
                            dateLabel={format(new Date(selected.date + "T00:00:00"), "EEEE, MMMM d, yyyy")}
                        />
                    ) : (
                        <Card>
                            <CardContent className="flex min-h-[30vh] items-center justify-center p-4 text-sm text-muted-foreground lg:p-6">
                                Select a booking to see its details.
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </BranchTabShell>
    );
}
