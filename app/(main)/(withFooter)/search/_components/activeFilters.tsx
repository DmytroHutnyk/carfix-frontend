"use client"

import {X} from "lucide-react";
import {usePathname, useRouter, useSearchParams} from "next/navigation";

import {useAuth} from "@/features/auth/useAuth";
import {useCarProfiles} from "@/features/carProfile/useCarProfiles";
import {WorkshopSearchParams} from "@/features/search/searchTypes";
import {Badge} from "@/_components/shadcn/badge";

/**
 * The filters currently narrowing the search, each removable in one click.
 *
 * The Filters popover hides its own state behind a click, which is why a committed radius
 * looked like nothing had happened. A chip is the standing answer: it is visible without
 * opening anything, and removing it is the same one action as applying it.
 */
export default function ActiveFilters({params}: { params: WorkshopSearchParams }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const {isAuthenticated} = useAuth();
    const {carProfiles} = useCarProfiles({enabled: isAuthenticated});

    const removeParam = (key: string) => {
        const next = new URLSearchParams(searchParams);
        next.delete(key);
        next.delete("page");
        router.push(`${pathname}?${next.toString()}`);
    };

    const chips: { key: string; label: string }[] = [];
    if (params.radiusKm != null) {
        chips.push({key: "radiusKm", label: `Within ${params.radiusKm} km`});
    }
    if (params.carProfileId) {
        const car = carProfiles.find((profile) => profile.id === params.carProfileId);
        chips.push({key: "carProfileId", label: `Fits ${car?.name ?? "my car"}`});
    }

    if (chips.length === 0) {
        return null;
    }

    return (
        <div className="flex flex-wrap items-center gap-2">
            {chips.map((chip) => (
                <Badge key={chip.key} variant="secondary" className="gap-1 py-1 pr-1 pl-2.5">
                    {chip.label}
                    <button
                        type="button"
                        aria-label={`Remove filter: ${chip.label}`}
                        onClick={() => removeParam(chip.key)}
                        className="rounded-full p-0.5 hover:bg-background"
                    >
                        <X className="h-3 w-3"/>
                    </button>
                </Badge>
            ))}
        </div>
    );
}
