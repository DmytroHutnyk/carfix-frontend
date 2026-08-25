'use client'

import {SlidersHorizontal} from "lucide-react";

import {Button} from "@/_components/shadcn/button";

export default function FilterButton({activeCount, onClick, label = "Filters"}: {
    activeCount: number;
    onClick: () => void;
    label?: string;
}) {
    return (
        <Button
            type="button"
            variant="outline"
            size="icon"
            className="relative shrink-0"
            aria-label={activeCount > 0 ? `${label}, ${activeCount} active` : label}
            onClick={onClick}
        >
            <SlidersHorizontal className="h-4 w-4"/>
            {activeCount > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
                    {activeCount}
                </span>
            )}
        </Button>
    );
}
