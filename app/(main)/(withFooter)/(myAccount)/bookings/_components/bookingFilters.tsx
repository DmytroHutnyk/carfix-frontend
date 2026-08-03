'use client'

import {Filter, Search} from "lucide-react";

import {BookingStatus} from "@/util/types/bookingTypes";
import {BookingFilterState, EMPTY_FILTERS, STATUS_LABELS} from "@/util/func/bookingList";

import {Button} from "@/_components/shadcn/button";
import {Input} from "@/_components/shadcn/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/_components/shadcn/select";

export default function BookingFilters({filters, onChange, vehicles, statuses}: {
    filters: BookingFilterState;
    onChange: (next: BookingFilterState) => void;
    vehicles: { value: string; label: string }[];
    statuses: readonly BookingStatus[];
}) {
    return (
        <div className="flex flex-wrap items-center gap-3 rounded-xl border p-3">
            <p className="flex items-center gap-2 font-semibold">
                <Filter className="h-4 w-4"/> Filters:
            </p>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/>
                <Input
                    type="text"
                    value={filters.query}
                    onChange={(e) => onChange({...filters, query: e.target.value})}
                    placeholder="Search service point or address"
                    className="w-72 pl-9"
                />
            </div>

            <Select
                value={filters.carProfileId}
                onValueChange={(v) => onChange({...filters, carProfileId: v})}
            >
                <SelectTrigger className="w-44">
                    <SelectValue/>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All vehicles</SelectItem>
                    {vehicles.map((v) => (
                        <SelectItem key={v.value} value={v.value}>{v.label}</SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select
                value={filters.status}
                onValueChange={(v) => onChange({...filters, status: v as BookingStatus | "all"})}
            >
                <SelectTrigger className="w-40">
                    <SelectValue/>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    {statuses.map((s) => (
                        <SelectItem key={s} value={s}>{STATUS_LABELS[s]}</SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Button className="ml-auto" onClick={() => onChange(EMPTY_FILTERS)}>
                Clear filters
            </Button>
        </div>
    )
}
