"use client"

import {X} from "lucide-react";
import {usePathname, useRouter, useSearchParams} from "next/navigation";

import {useAuth} from "@/features/auth/useAuth";
import {useSelectedCarProfile} from "@/features/carProfile/useSelectedCarProfile";
import {AVAILABILITY_PARAMS, formatAvailabilityLabel, hasAvailabilityFilter} from "@/features/search/searchList";
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
    const {selectedCarProfile} = useSelectedCarProfile({enabled: isAuthenticated});

    const setParam = (key: string, value: string | null) => {
        const next = new URLSearchParams(searchParams);
        if (value == null) next.delete(key); else next.set(key, value);
        next.delete("page");
        router.push(`${pathname}?${next.toString()}`);
    };

    const removeParams = (keys: readonly string[]) => {
        const next = new URLSearchParams(searchParams);
        keys.forEach((key) => next.delete(key));
        next.delete("page");
        router.push(`${pathname}?${next.toString()}`);
    };

    const chips: { key: string; label: string; onRemove: () => void }[] = [];
    if (params.radiusKm != null) {
        chips.push({key: "radiusKm", label: `Within ${params.radiusKm} km`, onRemove: () => setParam("radiusKm", null)});
    }
    if (hasAvailabilityFilter(params)) {
        chips.push({
            key: "availability",
            label: formatAvailabilityLabel({from: params.from, to: params.to, timeFrom: params.timeFrom, timeTo: params.timeTo}),
            onRemove: () => removeParams(AVAILABILITY_PARAMS),
        });
    }
    /* Removing the car chip must SET allBrands — absence of the param means "default = my car". */
    if (!params.allBrands && selectedCarProfile) {
        chips.push({
            key: "carBrand",
            label: `Fits ${selectedCarProfile.name}`,
            onRemove: () => setParam("allBrands", "1"),
        });
    }

    if (chips.length === 0) {
        return null;
    }

    return (
        <div className="no-scrollbar -mx-4 flex items-center gap-2 overflow-x-auto px-4 pb-1 lg:mx-0 lg:flex-wrap lg:overflow-x-visible lg:px-0 lg:pb-0">
            {chips.map((chip) => (
                <Badge key={chip.key} variant="secondary" className="shrink-0 gap-1 py-1 pr-1 pl-2.5">
                    {chip.label}
                    <button
                        type="button"
                        aria-label={`Remove filter: ${chip.label}`}
                        onClick={chip.onRemove}
                        className="rounded-full p-1 hover:bg-background lg:p-0.5"
                    >
                        <X className="h-3 w-3"/>
                    </button>
                </Badge>
            ))}
        </div>
    );
}
