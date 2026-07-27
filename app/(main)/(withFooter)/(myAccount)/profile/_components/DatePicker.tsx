"use client"

import {Field, FieldLabel} from "@/_components/shadcn/field";
import {Popover, PopoverContent, PopoverTrigger} from "@/_components/shadcn/popover";
import {Button} from "@/_components/shadcn/button";
import {Calendar} from "@/_components/shadcn/calendar";
import {useState} from "react";

interface DatePickerProps {
    value?: string | null
    onChange?: (value: string | null) => void
    error?: boolean
}

export function DatePicker({ value, onChange, error }: DatePickerProps) {
    const [open, setOpen] = useState(false)

    const selectedDate = value ? new Date(value + "T00:00:00") : undefined

    return (
        <Field className="w-44">
            <FieldLabel htmlFor="date">Date of birth</FieldLabel>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="white"
                        id="date"
                        className={`justify-start font-normal ${error ? "border-destructive focus-visible:ring-destructive" : ""}`}
                    >
                        {selectedDate ? selectedDate.toLocaleDateString() : "Select date"}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={selectedDate}
                        defaultMonth={selectedDate}
                        captionLayout="dropdown"
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
