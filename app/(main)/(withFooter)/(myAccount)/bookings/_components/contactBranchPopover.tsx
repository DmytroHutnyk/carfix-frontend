'use client'

import {Mail, Phone} from "lucide-react";

import {BookingBranch} from "@/util/types/bookingTypes";
import {Popover, PopoverContent, PopoverTrigger} from "@/_components/shadcn/popover";
import {Button} from "@/_components/shadcn/button";

export default function ContactBranchPopover({branch}: { branch: BookingBranch }) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button>Contact Service Point</Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-72">
                <div className="flex flex-col gap-3">
                    <p className="font-semibold">{branch.name}</p>
                    <a href={`tel:${branch.phoneNumber}`} className="flex items-center gap-2 hover:underline">
                        <Phone className="h-4 w-4 text-muted-foreground"/>
                        {branch.phoneNumber}
                    </a>
                    <a href={`mailto:${branch.email}`} className="flex items-center gap-2 hover:underline">
                        <Mail className="h-4 w-4 text-muted-foreground"/>
                        {branch.email}
                    </a>
                </div>
            </PopoverContent>
        </Popover>
    )
}
