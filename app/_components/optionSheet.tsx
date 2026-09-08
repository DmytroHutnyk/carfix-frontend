"use client"

import {Check} from "lucide-react";

import MobileSheet from "@/_components/mobileSheet";
import {cn} from "@/lib/utils";

export type SheetOption = {
    value: string;
    label: string;
    disabled?: boolean;
};

export default function OptionSheet({open, onOpenChange, title, value, options, onSelect}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    value: string;
    options: SheetOption[];
    onSelect: (value: string) => void;
}) {
    return (
        <MobileSheet
            open={open}
            onOpenChange={onOpenChange}
            title={title}
            bodyClassName="pb-[max(0.5rem,env(safe-area-inset-bottom))]"
        >
            <div role="radiogroup" aria-label={title} className="flex flex-col divide-y">
                {options.map((option) => {
                    const selected = option.value === value;
                    return (
                        <button
                            key={option.value}
                            type="button"
                            role="radio"
                            aria-checked={selected}
                            disabled={option.disabled}
                            onClick={() => {
                                onSelect(option.value);
                                onOpenChange(false);
                            }}
                            className={cn(
                                "flex h-11 shrink-0 items-center justify-between gap-3 px-4 text-left text-sm outline-none transition-colors",
                                "focus-visible:bg-accent/50 disabled:pointer-events-none disabled:opacity-50",
                                selected && "font-medium"
                            )}
                        >
                            <span className="min-w-0 truncate">{option.label}</span>
                            {selected && <Check className="h-4 w-4 shrink-0"/>}
                        </button>
                    );
                })}
            </div>
        </MobileSheet>
    );
}
