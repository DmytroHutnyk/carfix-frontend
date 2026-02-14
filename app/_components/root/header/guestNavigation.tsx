'use client'
import * as React from "react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItemWithCheck,
    DropdownMenuTrigger
} from "@/_components/shadcn/dropdown-menu";
import {ChevronDown} from "lucide-react";
import { cn } from "../../../../util/lib/utils";
import {Button} from "@/_components/shadcn/button";
import {useRouter} from "next/navigation";
import {Language} from "@/util/types/appTypes";
import {useLanguage} from "@/util/state/store";
import Link from "next/link";


export default function GuestNavigation() {
    const router = useRouter();
    const language = useLanguage((state) => (state.language))
    const setLanguage = useLanguage((state) => (state.setLanguage))

        return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button className={cn(
                        "group inline-flex h-9 w-18 items-center justify-center"
                    )}>
                        <span>{language}</span>
                        <ChevronDown className="relative top-[1px] ml-1 h-3 w-3 transition duration-300 group-data-[state=open]:rotate-180" aria-hidden="true" />
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-background w-fit !min-w-0">
                    <DropdownMenuRadioGroup value={language} onValueChange={(value) => setLanguage(value as Language)}>
                        <DropdownMenuRadioItemWithCheck value={"EN"} >EN</DropdownMenuRadioItemWithCheck>
                        <DropdownMenuRadioItemWithCheck value={"PL"}>PL</DropdownMenuRadioItemWithCheck>
                        <DropdownMenuRadioItemWithCheck value={"UKR"}>UKR</DropdownMenuRadioItemWithCheck>
                    </DropdownMenuRadioGroup>
                </DropdownMenuContent>
            </DropdownMenu>

            <div className= "inline-flex items-center justify-center gap-3">
                <Button variant="default" asChild>
                    <Link href="/login">
                        Login/SignUp
                    </Link>
                </Button>
                <Button variant="headerOutline">For Business</Button>
            </div>
        </>
    )
}