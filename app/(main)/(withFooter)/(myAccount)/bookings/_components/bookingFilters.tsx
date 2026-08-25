'use client'

import {useState} from "react";
import {Filter, Search} from "lucide-react";

import {BOOKING_STATUSES, BookingStatus} from "@/features/booking/bookingTypes";
import {BookingFilterState, EMPTY_FILTERS, STATUS_LABELS} from "@/features/booking/bookingList";

import FilterSheet from "@/_components/filterSheet";
import FilterButton from "@/_components/filterButton";
import DateRangePicker from "@/_components/dateRangePicker";
import {Input} from "@/_components/shadcn/input";
import {Button} from "@/_components/shadcn/button";
import {Label} from "@/_components/shadcn/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/_components/shadcn/select";

type Vehicle = { value: string; label: string };

function activeCount(filters: BookingFilterState): number {
    return [
        filters.carProfileId !== "all",
        filters.status !== "all",
        filters.dateRange.from !== null || filters.dateRange.to !== null,
    ].filter(Boolean).length;
}

export default function BookingFilters({filters, onChange, vehicles}: {
    filters: BookingFilterState;
    onChange: (next: BookingFilterState) => void;
    vehicles: Vehicle[];
}) {
    const [open, setOpen] = useState(false);
    const [draft, setDraft] = useState<BookingFilterState>(filters);
    const active = activeCount(filters);

    return (
        <>
            <div className="flex items-center gap-2 lg:hidden">
                <div className="relative min-w-0 flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/>
                    <Input
                        type="search"
                        value={filters.query}
                        onChange={(e) => onChange({...filters, query: e.target.value})}
                        placeholder="Search bookings"
                        aria-label="Search bookings"
                        className="pl-9"
                    />
                </div>

                <FilterButton
                    activeCount={active}
                    onClick={() => {
                        setDraft(filters);
                        setOpen(true);
                    }}
                />
            </div>

            <FilterSheet
                open={open}
                onOpenChange={setOpen}
                clearDisabled={activeCount(draft) === 0}
                onClear={() => setDraft({...EMPTY_FILTERS, query: draft.query})}
                onApply={() => {
                    onChange(draft);
                    setOpen(false);
                }}
            >
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="booking-filter-vehicle">Vehicle</Label>
                        <Select
                            value={draft.carProfileId}
                            onValueChange={(v) => setDraft({...draft, carProfileId: v})}
                        >
                            <SelectTrigger id="booking-filter-vehicle" className="w-full"><SelectValue/></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All vehicles</SelectItem>
                                {vehicles.map((v) => (
                                    <SelectItem key={v.value} value={v.value}>{v.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Label>Dates</Label>
                        <DateRangePicker
                            className="w-full"
                            value={draft.dateRange}
                            onChange={(dateRange) => setDraft({...draft, dateRange})}
                            numberOfMonths={1}
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="booking-filter-status">Status</Label>
                        <Select
                            value={draft.status}
                            onValueChange={(v) => setDraft({...draft, status: v as BookingStatus | "all"})}
                        >
                            <SelectTrigger id="booking-filter-status" className="w-full"><SelectValue/></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All statuses</SelectItem>
                                {BOOKING_STATUSES.map((s) => (
                                    <SelectItem key={s} value={s}>{STATUS_LABELS[s]}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </FilterSheet>

            <div className="hidden flex-wrap items-center gap-3 rounded-xl border p-3 lg:flex">
                <p className="flex items-center gap-2 text-base font-semibold">
                    <Filter className="h-4 w-4"/> Filters:
                </p>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/>
                    <Input
                        type="text"
                        value={filters.query}
                        onChange={(e) => onChange({...filters, query: e.target.value})}
                        placeholder="Search service point or service"
                        className="w-72 pl-9"
                    />
                </div>

                <Select
                    value={filters.carProfileId}
                    onValueChange={(v) => onChange({...filters, carProfileId: v})}
                >
                    <SelectTrigger className="w-44"><SelectValue/></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All vehicles</SelectItem>
                        {vehicles.map((v) => (
                            <SelectItem key={v.value} value={v.value}>{v.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <DateRangePicker
                    className="w-64"
                    value={filters.dateRange}
                    onChange={(dateRange) => onChange({...filters, dateRange})}
                />

                <Select
                    value={filters.status}
                    onValueChange={(v) => onChange({...filters, status: v as BookingStatus | "all"})}
                >
                    <SelectTrigger className="w-40"><SelectValue/></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All statuses</SelectItem>
                        {BOOKING_STATUSES.map((s) => (
                            <SelectItem key={s} value={s}>{STATUS_LABELS[s]}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Button className="ml-auto" onClick={() => onChange(EMPTY_FILTERS)}>
                    Clear filters
                </Button>
            </div>
        </>
    );
}
