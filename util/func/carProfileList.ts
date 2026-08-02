import {CarProfile} from "@/util/types/carProfileTypes";

export type CarSortKey = "nameAsc" | "nameDesc";

export const CAR_SORT_OPTIONS: { value: CarSortKey; label: string }[] = [
    {value: "nameAsc", label: "Name A–Z"},
    {value: "nameDesc", label: "Name Z–A"},
];

export function filterCarProfiles(list: CarProfile[], query: string): CarProfile[] {
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter((c) =>
        c.name.toLowerCase().includes(q) ||
        (c.vin?.toLowerCase().includes(q) ?? false) ||
        (c.plates?.toLowerCase().includes(q) ?? false)
    );
}

export function sortCarProfiles(list: CarProfile[], sortKey: CarSortKey): CarProfile[] {
    const sorted = [...list];
    switch (sortKey) {
        case "nameAsc":
            return sorted.sort((a, b) => a.name.localeCompare(b.name));
        case "nameDesc":
            return sorted.sort((a, b) => b.name.localeCompare(a.name));
    }
}
