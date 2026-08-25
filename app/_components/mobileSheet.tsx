"use client"

import {ReactNode} from "react";

import {Sheet, SheetContent, SheetTitle} from "@/_components/shadcn/sheet";
import {cn} from "@/lib/utils";

export default function MobileSheet({open, onOpenChange, title, children, bodyClassName, footer}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    children: ReactNode;
    bodyClassName?: string;
    footer?: ReactNode;
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

                <div className={cn("flex-1 overflow-y-auto", bodyClassName)}>{children}</div>

                {footer && (
                    <div className="shrink-0 border-t bg-background px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
                        {footer}
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}
