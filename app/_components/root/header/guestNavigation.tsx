'use client'
import * as React from "react"
import {useState} from "react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItemWithCheck,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/_components/shadcn/dropdown-menu";
import {ChevronDown, Globe} from "lucide-react";
import {cn} from "../../../../util/lib/utils";
import {Button} from "@/_components/shadcn/button";
import {FLAG_PLACEHOLDERS, Language, Region, RegionCode, REGIONS} from "@/util/types/appTypes";
import {useLanguage, useRegion} from "@/util/state/store";
import Link from "next/link";

const regionsByContinent = REGIONS.reduce<Record<string, Region[]>>((acc, region) => {
    (acc[region.continent] ??= []).push(region);
    return acc;
}, {});

export default function GuestNavigation() {

    const language = useLanguage((s) => s.language);
    const setLanguage = useLanguage((s) => s.setLanguage);

    const region = useRegion((s) => s.region);
    const setRegion = useRegion((s) => s.setRegion);

    const [open, setOpen] = useState(false);

    return (
        <>
            <DropdownMenu open={open} onOpenChange={setOpen}>
                <DropdownMenuTrigger asChild>
                    <button className="group inline-flex h-9 w-25 items-center justify-start">
                        <span className="inline-flex w-16 items-center justify-start gap-x-1">
                            <span className="text-base leading-none">{FLAG_PLACEHOLDERS[region]}</span>
                            <span className="text-sm font-medium">{language}</span>
                        </span>
                        <ChevronDown className="h-3 w-3 text-muted-foreground transition duration-300 group-data-[state=open]:rotate-180" aria-hidden="true" />
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-background w-72 p-3">

                    {/* Language section */}
                    <DropdownMenuLabel className="flex items-center gap-2 px-0 pb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        <Globe className="h-3.5 w-3.5" />
                        Language
                    </DropdownMenuLabel>
                    <DropdownMenuRadioGroup
                        value={language}
                        onValueChange={(v) => setLanguage(v as Language)}
                    >
                        <div className="flex gap-1">
                            {(["EN", "PL", "UKR"] as Language[]).map((lang) => (
                                <DropdownMenuRadioItemWithCheck
                                    key={lang}
                                    value={lang}
                                    hideCheck
                                    className={cn(
                                        "flex-1 justify-center rounded-md px-2 py-1.5 text-sm font-medium",
                                        language === lang && "bg-primary text-primary-foreground"
                                    )}
                                >
                                    {lang}
                                </DropdownMenuRadioItemWithCheck>
                            ))}
                        </div>
                    </DropdownMenuRadioGroup>

                    {/* Region separator with centered label */}
                    <div className="relative my-4">
                        <DropdownMenuSeparator className="my-0" />
                        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Region
                        </span>
                    </div>
                    {Object.entries(regionsByContinent).map(([continent, regions]) => (
                        <div key={continent} className="mb-3 last:mb-0">
                            <DropdownMenuLabel className="px-0 pb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                {continent}
                            </DropdownMenuLabel>
                            <div className="grid grid-cols-3 gap-1">
                                {regions.map((r) => (
                                    <button
                                        key={r.code}
                                        onClick={() => {
                                            setRegion(r.code);
                                            setOpen(false);
                                        }}
                                        className={cn(
                                            "flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm transition-colors",
                                            "hover:bg-accent hover:text-accent-foreground",
                                            region === r.code && "bg-primary text-primary-foreground"
                                        )}
                                    >
                                        <span className="text-base leading-none">{FLAG_PLACEHOLDERS[r.code]}</span>
                                        <span className="truncate">{r.code}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>

            <div className="inline-flex items-center justify-center gap-3">
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
