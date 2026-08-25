"use client"

import {ToggleGroup, ToggleGroupItem} from "@/_components/shadcn/toggle-group";
import {Slot} from "@/features/slots/slotTypes";
import {groupSlotsByPeriod} from "@/features/slots/slotList";

export default function SlotGrid({slots, selectedStartTime, onSelect}: {
    slots: Slot[];
    selectedStartTime: string | null;
    onSelect: (slot: Slot) => void;
}) {
    return (
        <ToggleGroup
            type="single"
            variant="outline"
            value={selectedStartTime ?? ""}
            onValueChange={(startTime) => {
                const slot = slots.find((s) => s.startTime === startTime);
                if (slot) onSelect(slot);
            }}
            className="flex-col items-stretch gap-3"
        >
            {groupSlotsByPeriod(slots).map((group) => (
                <div key={group.period} className="flex flex-col gap-2">
                    <p className="text-xs font-medium text-muted-foreground">{group.label}</p>
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                        {group.slots.map((slot) => (
                            <ToggleGroupItem
                                key={slot.startTime}
                                value={slot.startTime}
                                title={`${slot.startTime} – ${slot.endTime}`}
                                className="tabular-nums"
                            >
                                {slot.startTime}
                            </ToggleGroupItem>
                        ))}
                    </div>
                </div>
            ))}
        </ToggleGroup>
    );
}
