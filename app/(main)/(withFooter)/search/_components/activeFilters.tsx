"use client"

import {X} from "lucide-react";
import {usePathname, useRouter, useSearchParams} from "next/navigation";

import {useAuth} from "@/features/auth/useAuth";
import {useSelectedCarProfile} from "@/features/carProfile/useSelectedCarProfile";
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

    const chips: { key: string; label: string; onRemove: () => void }[] = [];
    if (params.radiusKm != null) {
        chips.push({key: "radiusKm", label: `Within ${params.radiusKm} km`, onRemove: () => setParam("radiusKm", null)});
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
        <div className="flex flex-wrap items-center gap-2">
            {chips.map((chip) => (
                <Badge key={chip.key} variant="secondary" className="gap-1 py-1 pr-1 pl-2.5">
                    {chip.label}
                    <button
                        type="button"
                        aria-label={`Remove filter: ${chip.label}`}
                        onClick={chip.onRemove}
                        className="rounded-full p-0.5 hover:bg-background"
                    >
                        <X className="h-3 w-3"/>
                    </button>
                </Badge>
            ))}
        </div>
    );
}
