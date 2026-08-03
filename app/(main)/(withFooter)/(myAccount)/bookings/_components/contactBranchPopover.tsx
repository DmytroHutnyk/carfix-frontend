'use client'

import Link from "next/link";
import {Mail, Phone, SquareArrowOutUpRight} from "lucide-react";

import {BookingBranch} from "@/util/types/bookingTypes";
import {Popover, PopoverContent, PopoverTrigger} from "@/_components/shadcn/popover";
import {Button} from "@/_components/shadcn/button";
import {Separator} from "@/_components/shadcn/separator";

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

                    <Separator/>

                    {/* TODO: /service-points/[id] page not implemented yet — link 404s until it exists */}
                    <Link
                        href={`/service-points/${branch.branchId}`}
                        className="flex items-center gap-2 hover:underline"
                    >
                        <SquareArrowOutUpRight className="h-4 w-4 text-muted-foreground"/>
                        View service point
                    </Link>
                </div>
            </PopoverContent>
        </Popover>
    )
}
