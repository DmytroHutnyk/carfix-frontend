"use client"

import {ReactNode} from "react";

import {Button} from "@/_components/shadcn/button";
import MobileSheet from "@/_components/mobileSheet";

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
        <MobileSheet
            open={open}
            onOpenChange={onOpenChange}
            title={title}
            bodyClassName="px-4 py-4"
            footer={
                <div className="flex items-center justify-between gap-2">
                    <Button variant="ghost" size="sm" onClick={onClear} disabled={clearDisabled}>
                        Clear
                    </Button>
                    <Button size="sm" onClick={onApply ?? (() => onOpenChange(false))}>
                        Apply
                    </Button>
                </div>
            }
        >
            {children}
        </MobileSheet>
    );
}
