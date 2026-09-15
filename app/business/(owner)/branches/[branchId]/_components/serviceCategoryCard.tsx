'use client'

import {ReactNode} from "react";
import {ChevronDown} from "lucide-react";

import {Card} from "@/_components/shadcn/card";
import {Badge} from "@/_components/shadcn/badge";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/_components/shadcn/collapsible";

interface ServiceCategoryCardProps {
    categoryName: string;
    count: number;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children: ReactNode;
}

export default function ServiceCategoryCard({categoryName, count, open, onOpenChange, children}: ServiceCategoryCardProps) {
    return (
        <Card>
            <Collapsible open={open} onOpenChange={onOpenChange}>
                <CollapsibleTrigger
                    type="button"
                    className="flex w-full items-center justify-between gap-2 p-4 text-left lg:p-6 [&[data-state=open]>svg]:rotate-180"
                >
                    <span className="flex min-w-0 items-center gap-2">
                        <span className="truncate text-base font-semibold tracking-tight">{categoryName}</span>
                        <Badge variant="secondary">{count}</Badge>
                    </span>
                    <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200"/>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-2 px-4 pb-4 lg:px-6 lg:pb-6">
                    {children}
                </CollapsibleContent>
            </Collapsible>
        </Card>
    );
}
