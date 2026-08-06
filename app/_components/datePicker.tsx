"use client"

import {Field, FieldLabel} from "@/_components/shadcn/field";
import {Popover, PopoverContent, PopoverTrigger} from "@/_components/shadcn/popover";
import {Button} from "@/_components/shadcn/button";
import {Calendar} from "@/_components/shadcn/calendar";
import {cn} from "@/lib/utils";
import {useState} from "react";

interface DatePickerProps {
    id: string
    label: string
    value?: string | null
    onChange?: (value: string | null) => void
    error?: boolean
    placeholder?: string
    className?: string
    minDate: Date
    maxDate: Date
}

export default function DatePicker({id, label, value, onChange, error, placeholder = "Pick a date", className, minDate, maxDate}: DatePickerProps) {
    const [open, setOpen] = useState(false)

    const selectedDate = value ? new Date(value + "T00:00:00") : undefined

    return (
        <Field className={cn("w-44", className)}>
            <FieldLabel htmlFor={id}>{label}</FieldLabel>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="white"
                        id={id}
                        className={cn("justify-start font-normal", error && "border-destructive focus-visible:ring-destructive")}
                    >
                        {selectedDate ? selectedDate.toLocaleDateString() : placeholder}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={selectedDate}
                        defaultMonth={selectedDate}
                        captionLayout="dropdown"
                        startMonth={minDate}
                        endMonth={maxDate}
                        disabled={[{before: minDate}, {after: maxDate}]}
                        onSelect={(date) => {
                            onChange?.(date ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}` : null)
                            setOpen(false)
                        }}
                    />
                </PopoverContent>
            </Popover>
        </Field>
    )
}
