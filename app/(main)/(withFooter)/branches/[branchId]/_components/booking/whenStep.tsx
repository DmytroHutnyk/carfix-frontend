"use client"

import {Button} from "@/_components/shadcn/button";
import {Skeleton} from "@/_components/shadcn/skeleton";
import DateRangePicker from "@/_components/dateRangePicker";
import FormErrorAlert from "@/_components/formErrorAlert";
import {cn} from "@/lib/utils";
import {toDisplayError} from "@/lib/errorHandler";
import {formatBookingDate} from "@/features/booking/bookingList";
import {useBranchSlots} from "@/features/slots/useBranchSlots";
import {SlotPick, VisitRange} from "@/features/slots/slotTypes";
import {defaultDate, hasSlot, MAX_RANGE_DAYS, parseIsoDate, todayIsoInTz} from "@/features/slots/slotList";
import StepHeader from "./stepHeader";
import StepFooter from "./stepFooter";
import DayStrip from "./dayStrip";
import SlotGrid from "./slotGrid";

export default function WhenStep({
    branchId, tz, serviceIds, range, onRangeChange, selectedDate, onSelectDate, selectedSlot, onSelectSlot,
    notice, stepIndex, stepCount, onBack, onContinue,
}: {
    branchId: string;
    tz: string;
    serviceIds: number[];
    range: VisitRange;
    onRangeChange: (range: VisitRange) => void;
    selectedDate: string | null;
    onSelectDate: (date: string) => void;
    selectedSlot: SlotPick | null;
    onSelectSlot: (slot: SlotPick | null) => void;
    notice?: string | null;
    stepIndex: number;
    stepCount: number;
    onBack?: () => void;
    onContinue: () => void;
}) {
    const {slots, isLoading, isPlaceholderData, isError, error, refetch} =
        useBranchSlots({branchId, serviceIds, from: range.from, to: range.to});

    const days = slots?.days ?? [];
    const activeDate = selectedDate && days.some((day) => day.date === selectedDate)
        ? selectedDate
        : defaultDate(days);
    const activeDay = days.find((day) => day.date === activeDate);
    const nothingInRange = days.every((day) => day.slots.length === 0);
    const pick = selectedSlot && !isPlaceholderData && hasSlot(days, selectedSlot) ? selectedSlot : null;

    return (
        <div className="flex flex-col gap-4 p-4">
            <StepHeader title="When would you like to come?" stepIndex={stepIndex} stepCount={stepCount}/>

            <FormErrorAlert message={notice ?? null}/>

            <DateRangePicker
                className="w-full"
                value={range}
                onChange={(next) => {
                    if (next.from) onRangeChange({from: next.from, to: next.to ?? next.from});
                }}
                numberOfMonths={1}
                minDate={parseIsoDate(todayIsoInTz(tz))}
                maxDays={MAX_RANGE_DAYS}
            />

            {isLoading && <SlotsSkeleton/>}

            {isError && (
                <div className="flex flex-col gap-2">
                    <FormErrorAlert message={error ? toDisplayError(error).message : null}/>
                    <Button variant="secondary" size="sm" className="self-start" onClick={() => refetch()}>
                        Try again
                    </Button>
                </div>
            )}

            {slots && !slots.chainable && (
                <p className="text-sm text-muted-foreground">
                    These services can&apos;t be done in one visit at this workshop. Remove one and try again.
                </p>
            )}

            {slots && slots.chainable && (
                <div className={cn("flex flex-col gap-4", isPlaceholderData && "opacity-50")} inert={isPlaceholderData}>
                    <DayStrip
                        days={days}
                        selectedDate={activeDate}
                        onSelect={(date) => {
                            onSelectDate(date);
                            onSelectSlot(null);
                        }}
                    />
                    {activeDay && activeDay.slots.length > 0 ? (
                        <SlotGrid
                            slots={activeDay.slots}
                            selectedStartTime={pick?.date === activeDay.date ? pick.startTime : null}
                            onSelect={(slot) => {
                                onSelectDate(activeDay.date);
                                onSelectSlot({date: activeDay.date, ...slot});
                            }}
                        />
                    ) : (
                        <p className="text-sm text-muted-foreground">
                            {nothingInRange
                                ? "No free slots in this date range. Try another one."
                                : `No free slots on ${activeDate ? formatBookingDate(activeDate) : "this day"}.`}
                        </p>
                    )}
                    <p className="text-xs text-muted-foreground">Times are workshop local time ({tz}).</p>
                </div>
            )}

            <StepFooter
                className="border-t pt-3"
                note={
                    <p className="min-w-0 text-sm">
                        {pick
                            ? `${formatBookingDate(pick.date)} · ${pick.startTime} – ${pick.endTime}`
                            : "Pick a time to continue"}
                    </p>
                }
            >
                {onBack && <Button variant="secondary" onClick={onBack}>Back</Button>}
                <Button onClick={onContinue} disabled={!pick}>Continue</Button>
            </StepFooter>
        </div>
    );
}

function SlotsSkeleton() {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex gap-1">
                {Array.from({length: MAX_RANGE_DAYS}, (_, i) => <Skeleton key={i} className="h-16 flex-1"/>)}
            </div>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                {Array.from({length: 8}, (_, i) => <Skeleton key={i} className="h-9"/>)}
            </div>
        </div>
    );
}
