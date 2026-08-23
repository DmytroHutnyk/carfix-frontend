'use client'

import {useState} from "react";
import {format} from "date-fns";
import {CalendarDays} from "lucide-react";
import {DateRange} from "react-day-picker";

import {Popover, PopoverContent, PopoverTrigger} from "@/_components/shadcn/popover";
import {Button} from "@/_components/shadcn/button";
import {Calendar} from "@/_components/shadcn/calendar";
import {cn} from "@/lib/utils";
import {DateRangeValue} from "@/lib/appTypes";

function toDate(value: string | null): Date | undefined {
    return value ? new Date(value + "T00:00:00") : undefined;
}

function toIso(date: Date | undefined): string | null {
    return date ? format(date, "yyyy-MM-dd") : null;
}

function label(value: DateRangeValue, placeholder: string): string {
    const from = toDate(value.from);
    const to = toDate(value.to);
    if (from && to) return `${format(from, "MMM d, yyyy")} – ${format(to, "MMM d, yyyy")}`;
    if (from) return `From ${format(from, "MMM d, yyyy")}`;
    if (to) return `Until ${format(to, "MMM d, yyyy")}`;
    return placeholder;
}

export default function DateRangePicker({
    value, onChange, placeholder = "Any date", className, numberOfMonths = 2, minDate, maxDays,
}: {
    value: DateRangeValue;
    onChange: (value: DateRangeValue) => void;
    placeholder?: string;
    className?: string;
    numberOfMonths?: number;
    minDate?: Date;
    maxDays?: number;
}) {
    const [open, setOpen] = useState(false);

    const selected: DateRange | undefined = value.from || value.to
        ? {from: toDate(value.from), to: toDate(value.to)}
        : undefined;

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={cn("justify-start gap-x-2 font-normal", className)}
                >
                    <CalendarDays className="h-4 w-4 shrink-0 text-muted-foreground"/>
                    <span className="truncate">{label(value, placeholder)}</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="range"
                    selected={selected}
                    defaultMonth={selected?.from}
                    numberOfMonths={numberOfMonths}
                    startMonth={minDate}
                    disabled={minDate ? {before: minDate} : undefined}
                    /* react-day-picker's `max` bounds the gap (to − from) in days, not the day count, so an inclusive N-day window is N − 1 */
                    max={maxDays ? maxDays - 1 : undefined}
                    onSelect={(range) => onChange({from: toIso(range?.from), to: toIso(range?.to)})}
                />
            </PopoverContent>
        </Popover>
    )
}
