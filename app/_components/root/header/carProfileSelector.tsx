'use client'
import {KeyboardEvent, PointerEvent, useRef} from "react";
import {Car} from "lucide-react";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/_components/shadcn/select";
import {useSelectedCarProfile} from "@/features/carProfile/useSelectedCarProfile";
import {useReassertCarFilter} from "@/features/search/useReassertCarFilter";
import {cn} from "@/lib/utils";

export default function CarProfileSelector({className}: {className?: string}){
    const {carProfiles, selectedCarProfile, selectCarProfile} = useSelectedCarProfile();
    const reassertCarFilter = useReassertCarFilter();

    const pointerTypeRef = useRef("touch");
    const reselectProps = {
        onPointerDown: (e: PointerEvent) => {pointerTypeRef.current = e.pointerType},
        onPointerUp: (e: PointerEvent) => {if (e.pointerType === "mouse") reassertCarFilter()},
        onClick: () => {if (pointerTypeRef.current !== "mouse") reassertCarFilter()},
        onKeyDown: (e: KeyboardEvent) => {if (e.key === "Enter" || e.key === " ") reassertCarFilter()},
    };

    return(
        <Select
            value={selectedCarProfile?.id ?? ""}
            onValueChange={(id) => {
                selectCarProfile(id);
                reassertCarFilter();
            }}
        >
            <SelectTrigger className={cn("w-50 justify-start gap-x-1.5 [&>span]:min-w-0 [&>svg:last-of-type]:ml-auto [&>svg:last-of-type]:transition-transform [&>svg:last-of-type]:duration-300 data-[state=open]:[&>svg:last-of-type]:rotate-180", className)}>
                <Car className="h-4 w-4 shrink-0"/>
                <SelectValue placeholder="Select car"/>
            </SelectTrigger>
            <SelectContent align="start">
                {carProfiles.length === 0 ? (
                    <p className="px-2 py-1.5 text-sm text-muted-foreground">No car profiles yet</p>
                ) : (
                    carProfiles.map((c) => (
                        <SelectItem
                            key={c.id}
                            value={c.id}
                            {...(c.id === selectedCarProfile?.id ? reselectProps : {})}
                        >
                            {c.name}
                        </SelectItem>
                    ))
                )}
            </SelectContent>
        </Select>
    )
}
