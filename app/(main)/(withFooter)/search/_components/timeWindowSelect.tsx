"use client"

import {Label} from "@/_components/shadcn/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/_components/shadcn/select";
import {TIME_WINDOW_OPTIONS} from "@/features/search/searchList";

/* Radix Select items cannot carry an empty value, so "any" is the sentinel for no bound (precedent: ALL_BRANDS) */
const ANY_TIME = "any";

export default function TimeWindowSelect({label, value, disabled, onChange}: {
    label: string;
    value: string | null;
    disabled: boolean;
    onChange: (value: string | null) => void;
}) {
    return (
        <div className="flex flex-col gap-1">
            <Label className="text-xs text-muted-foreground">{label}</Label>
            <Select
                value={value ?? ANY_TIME}
                disabled={disabled}
                onValueChange={(next) => onChange(next === ANY_TIME ? null : next)}
            >
                <SelectTrigger>
                    <SelectValue/>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value={ANY_TIME}>Any</SelectItem>
                    {TIME_WINDOW_OPTIONS.map((time) => (
                        <SelectItem key={time} value={time} className="tabular-nums">{time}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
