'use client'

import Link from "next/link";
import {Mail, Phone, SquareArrowOutUpRight} from "lucide-react";

import {BookingBranch} from "@/features/booking/bookingTypes";
import {Popover, PopoverContent, PopoverTrigger} from "@/_components/shadcn/popover";
import {Button} from "@/_components/shadcn/button";
import {Separator} from "@/_components/shadcn/separator";

export default function ContactBranchPopover({branch}: { branch: BookingBranch }) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className="lg:h-9 lg:bg-primary lg:px-4 lg:py-2 lg:text-sm lg:text-primary-foreground lg:shadow lg:hover:bg-primary/90"
                >
                    Contact Service Point
                </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-[calc(100vw-3rem)] max-w-72 p-3 text-sm lg:w-72 lg:p-4 lg:text-base">
                <div className="flex flex-col gap-2.5 lg:gap-3">
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

                    <Link
                        href={`/branches/${branch.branchId}`}
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
