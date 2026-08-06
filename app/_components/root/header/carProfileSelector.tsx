'use client'
import {Car} from "lucide-react";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/_components/shadcn/select";
import {useSelectedCarProfile} from "@/features/carProfile/useSelectedCarProfile";

export default function CarProfileSelector(){
    const {carProfiles, selectedCarProfile, selectCarProfile} = useSelectedCarProfile();

    return(
        <Select
            value={selectedCarProfile?.id ?? ""}
            onValueChange={selectCarProfile}
        >
            <SelectTrigger className="w-50 justify-start gap-x-1.5 [&>span]:min-w-0 [&>svg:last-of-type]:ml-auto [&>svg:last-of-type]:transition-transform [&>svg:last-of-type]:duration-300 data-[state=open]:[&>svg:last-of-type]:rotate-180">
                <Car className="h-4 w-4 shrink-0"/>
                <SelectValue placeholder="Select car"/>
            </SelectTrigger>
            <SelectContent align="start">
                {carProfiles.length === 0 ? (
                    <p className="px-2 py-1.5 text-sm text-muted-foreground">No car profiles yet</p>
                ) : (
                    carProfiles.map((c) => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))
                )}
            </SelectContent>
        </Select>
    )
}
