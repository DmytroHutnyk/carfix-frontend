import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from "@/_components/shadcn/dropdown-menu";
import {Car, ChevronDown} from "lucide-react";
import * as React from "react";

export default function CarProfileSelector(){
    return(
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="group inline-flex h-9 w-50 items-center justify-start">
                    <span className="inline-flex items-center justify-start gap-x-1 mr-10">
                        <Car className="h-3.5 w-3.5" />
                        <span className="text-sm font-medium">carProfile</span>
                    </span>
                    <ChevronDown className="h-3 w-3 text-muted-foreground transition duration-300 group-data-[state=open]:rotate-180" aria-hidden="true" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-background w-72 p-3">
                <DropdownMenuLabel className="flex items-center gap-2 px-0 pb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Select Car profile
                </DropdownMenuLabel>
            </DropdownMenuContent>
        </DropdownMenu>

    )
}