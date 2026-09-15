"use client"

import {ReactNode, useState} from "react";

import {Field, FieldLabel} from "@/_components/shadcn/field";
import {Popover, PopoverContent, PopoverTrigger} from "@/_components/shadcn/popover";
import {Button} from "@/_components/shadcn/button";
import {Calendar} from "@/_components/shadcn/calendar";
import {cn} from "@/lib/utils";

interface DatePickerProps {
    id?: string
    label?: string
    value?: string | null
    onChange?: (value: string | null) => void
    error?: boolean
    placeholder?: string
    className?: string
    minDate: Date
    maxDate: Date
    trigger?: ReactNode
}

export default function DatePicker({id, label, value, onChange, error, placeholder = "Pick a date", className, minDate, maxDate, trigger}: DatePickerProps) {
    const [open, setOpen] = useState(false)

    const selectedDate = value ? new Date(value + "T00:00:00") : undefined

    const calendar = (
        <PopoverContent
            className="w-auto p-0"
            align="start"
            collisionPadding={8}
            updatePositionStrategy="always"
            onEscapeKeyDown={(event) => {
                event.preventDefault()
                setOpen(false)
            }}
        >
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
    )

    if (trigger) {
        return (
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>{trigger}</PopoverTrigger>
                {calendar}
            </Popover>
        )
    }

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
                {calendar}
            </Popover>
        </Field>
    )
}
