"use client"

import {Fragment} from "react";
import {ChevronRight, Clock} from "lucide-react";
import {Card, CardContent, CardHeader, CardTitle} from "@/_components/shadcn/card";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/_components/shadcn/collapsible";
import {cn} from "@/lib/utils";
import {WorkshopOpeningHours} from "@/features/workshop/workshopTypes";
import {DAY_ORDER, formatDay, formatHoursRange, hoursForDay, todayInTz} from "@/features/workshop/workshopList";

export default function OpeningHoursCard({openingHours, tz}: {
    openingHours: WorkshopOpeningHours[];
    tz: string;
}) {
    const today = todayInTz(tz);
    const todayRows = hoursForDay(openingHours, today);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Clock className="h-4 w-4"/> Opening hours
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Today</span>
                    <span className="tabular-nums">
                        {todayRows.length === 0 ? "Closed" : todayRows.map(formatHoursRange).join(", ")}
                    </span>
                </div>
                <Collapsible>
                    <CollapsibleTrigger className="group mt-2 flex items-center gap-1 text-xs text-muted-foreground lg:text-sm">
                        Expand
                        <ChevronRight className="h-4 w-4 transition-transform group-data-[state=open]:rotate-90"/>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <dl className="mt-3 grid grid-cols-[max-content_auto] gap-x-6 gap-y-1 text-xs lg:text-sm">
                            {DAY_ORDER.map((day) => {
                                const rows = hoursForDay(openingHours, day);
                                return (
                                    <Fragment key={day}>
                                        <dt className={cn(
                                            "text-muted-foreground",
                                            day === today && "font-medium text-foreground",
                                        )}>
                                            {formatDay(day)}
                                        </dt>
                                        <dd className="justify-self-end tabular-nums">
                                            {rows.length === 0 ? "Closed" : rows.map(formatHoursRange).join(", ")}
                                        </dd>
                                    </Fragment>
                                );
                            })}
                        </dl>
                    </CollapsibleContent>
                </Collapsible>
            </CardContent>
        </Card>
    );
}
