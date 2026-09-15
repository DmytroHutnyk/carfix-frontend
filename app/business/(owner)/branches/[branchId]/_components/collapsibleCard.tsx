'use client'

import {ReactNode} from "react";
import {ChevronDown} from "lucide-react";

import {Card} from "@/_components/shadcn/card";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/_components/shadcn/collapsible";

export default function CollapsibleCard({title, defaultOpen = false, children}: {
    title: string;
    defaultOpen?: boolean;
    children: ReactNode;
}) {
    return (
        <Card>
            <Collapsible defaultOpen={defaultOpen}>
                <CollapsibleTrigger
                    type="button"
                    className="flex w-full items-center justify-between p-4 text-base font-semibold tracking-tight lg:p-6 [&[data-state=open]>svg]:rotate-180"
                >
                    {title}
                    <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200"/>
                </CollapsibleTrigger>
                <CollapsibleContent className="px-4 pb-4 lg:px-6 lg:pb-6">
                    {children}
                </CollapsibleContent>
            </Collapsible>
        </Card>
    );
}
