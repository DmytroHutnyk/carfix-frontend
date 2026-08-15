"use client"

import {usePathname, useRouter, useSearchParams} from "next/navigation";

import DateRangePicker from "@/_components/dateRangePicker";
import {Label} from "@/_components/shadcn/label";
import {WorkshopSearchParams} from "@/features/search/searchTypes";
import {AVAILABILITY_PARAMS, hasAvailabilityFilter, TIME_WINDOW_OPTIONS} from "@/features/search/searchList";
import {MAX_RANGE_DAYS} from "@/features/slots/slotList";
import {today} from "@/lib/dateBounds";
import TimeWindowSelect from "@/(main)/(withFooter)/search/_components/timeWindowSelect";

export default function AvailabilityFilter({params}: { params: WorkshopSearchParams }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const hasRange = hasAvailabilityFilter(params);

    const push = (mutate: (next: URLSearchParams) => void) => {
        const next = new URLSearchParams(searchParams);
        mutate(next);
        next.delete("page");
        router.push(`${pathname}?${next.toString()}`);
    };

    const setTime = (key: "timeFrom" | "timeTo") => (value: string | null) =>
        push((next) => {
            if (value == null) next.delete(key); else next.set(key, value);
        });

    /* "HH:mm" compares correctly as text, so trimming each list keeps From strictly before To —
       the pair the backend rejects with INVALID_SEARCH_FILTER is never offered */
    const fromOptions = TIME_WINDOW_OPTIONS.filter((time) => !params.timeTo || time < params.timeTo);
    const toOptions = TIME_WINDOW_OPTIONS.filter((time) => !params.timeFrom || time > params.timeFrom);

    return (
        <div className="flex flex-col gap-2">
            <Label>Availability</Label>
            <DateRangePicker
                value={{from: params.from, to: params.to}}
                onChange={(next) => {
                    /* Clicking the selected day again emits an empty range — that is this control's own clear */
                    if (!next.from) {
                        push((p) => AVAILABILITY_PARAMS.forEach((key) => p.delete(key)));
                        return;
                    }
                    /* One click = one day, like the booking popover; the second click widens it */
                    const from = next.from;
                    push((p) => {
                        p.set("from", from);
                        p.set("to", next.to ?? from);
                    });
                }}
                placeholder="Any date"
                numberOfMonths={1}
                minDate={today()}
                maxDays={MAX_RANGE_DAYS}
            />
            <div className="grid grid-cols-2 gap-2">
                <TimeWindowSelect label="From" value={params.timeFrom} options={fromOptions} disabled={!hasRange} onChange={setTime("timeFrom")}/>
                <TimeWindowSelect label="To" value={params.timeTo} options={toOptions} disabled={!hasRange} onChange={setTime("timeTo")}/>
            </div>
            {!hasRange && (
                <p className="text-xs text-muted-foreground">Pick dates to see only workshops with a free slot.</p>
            )}
        </div>
    );
}
