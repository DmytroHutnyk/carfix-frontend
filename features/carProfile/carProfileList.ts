import {CarProfile} from "@/features/carProfile/carProfileTypes";

export type CarSortKey = "nameAsc" | "nameDesc";

export const CAR_SORT_OPTIONS: { value: CarSortKey; label: string }[] = [
    {value: "nameAsc", label: "Name A–Z"},
    {value: "nameDesc", label: "Name Z–A"},
];

export function filterCarProfiles(list: CarProfile[], query: string): CarProfile[] {
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter((c) =>
        [c.name, c.brandName, c.modelName, c.versionName, c.plates]
            .filter((field): field is string => field !== null)
            .some((field) => field.toLowerCase().includes(q))
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
