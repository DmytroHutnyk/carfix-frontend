"use client"

import {ToggleGroup, ToggleGroupItem} from "@/_components/shadcn/toggle-group";
import {cn} from "@/lib/utils";
import {DaySlots} from "@/features/slots/slotTypes";
import {availabilityLevel, AvailabilityLevel, formatDayMonth, formatDayOfWeek} from "@/features/slots/slotList";

const LEVEL_LINE: Record<AvailabilityLevel, string> = {
    high: "bg-availability-high",
    medium: "bg-availability-medium",
    low: "bg-availability-low",
};

export default function DayStrip({days, selectedDate, onSelect}: {
    days: DaySlots[];
    selectedDate: string | null;
    onSelect: (date: string) => void;
}) {
    return (
        <ToggleGroup
            type="single"
            variant="outline"
            value={selectedDate ?? ""}
            onValueChange={(date) => {
                if (date) onSelect(date);
            }}
            className="w-full"
        >
            {days.map((day) => {
                const count = day.slots.length;
                return (
                    <ToggleGroupItem
                        key={day.date}
                        value={day.date}
                        aria-label={`${formatDayOfWeek(day.date)} ${formatDayMonth(day.date)}, ${count} free ${count === 1 ? "slot" : "slots"}`}
                        className="flex h-auto min-w-0 flex-1 flex-col gap-1 px-1 py-2 data-[state=on]:border-primary data-[state=on]:bg-background data-[state=on]:text-foreground data-[state=on]:ring-1 data-[state=on]:ring-primary data-[state=on]:focus-visible:ring-2 data-[state=on]:focus-visible:ring-ring"
                    >
                        <span className="text-xs text-muted-foreground">
                            {formatDayOfWeek(day.date)}
                        </span>
                        <span className="text-sm font-medium tabular-nums">{formatDayMonth(day.date)}</span>
                        <span className={cn("h-0.5 w-6 rounded-full", LEVEL_LINE[availabilityLevel(count)])}/>
                    </ToggleGroupItem>
                );
            })}
        </ToggleGroup>
    );
}
