"use client"

import {ReactNode} from "react";

import {Button} from "@/_components/shadcn/button";
import {Sheet, SheetContent, SheetTitle} from "@/_components/shadcn/sheet";

export default function FilterSheet({open, onOpenChange, title = "Filters", children, onClear, onApply, clearDisabled = false}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title?: string;
    children: ReactNode;
    onClear?: () => void;
    onApply?: () => void;
    clearDisabled?: boolean;
}) {
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent
                side="bottom"
                aria-describedby={undefined}
                className="flex max-h-[85vh] flex-col gap-0 rounded-t-xl p-0 lg:p-0"
            >
                <SheetTitle className="shrink-0 border-b px-4 py-3 pr-10 text-base font-semibold">
                    {title}
                </SheetTitle>

                <div className="flex-1 overflow-y-auto px-4 py-4">{children}</div>

                <div className="shrink-0 border-t bg-background px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
                    <div className="flex items-center justify-between gap-2">
                        <Button variant="ghost" size="sm" onClick={onClear} disabled={clearDisabled}>
                            Clear
                        </Button>
                        <Button size="sm" onClick={onApply ?? (() => onOpenChange(false))}>
                            Apply
                        </Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
