import {OwnerEquipment} from "@/features/ownerEquipment/ownerEquipmentTypes";

export type OwnerEquipmentSort = "nameAsc" | "nameDesc";

export type OwnerEquipmentBadgeVariant =
    "default" | "secondary" | "destructive" | "destructiveSoft" | "success" | "outline";

const STATUS_LABELS: Record<string, string> = {
    AVAILABLE: "Available",
    BUSY: "Busy",
    SUSPENDED: "Suspended",
};

const STATUS_VARIANT: Record<string, OwnerEquipmentBadgeVariant> = {
    AVAILABLE: "success",
    BUSY: "default",
    SUSPENDED: "destructiveSoft",
};

export function equipmentStatusLabel(status: string): string {
    return STATUS_LABELS[status] ?? status;
}

export function equipmentStatusVariant(status: string): OwnerEquipmentBadgeVariant {
    return STATUS_VARIANT[status] ?? "secondary";
}

export function filterEquipment(list: OwnerEquipment[], query: string): OwnerEquipment[] {
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter((e) => [e.name, e.type].join(" ").toLowerCase().includes(q));
}

export function sortEquipment(list: OwnerEquipment[], sort: OwnerEquipmentSort): OwnerEquipment[] {
    const factor = sort === "nameDesc" ? -1 : 1;
    return [...list].sort((a, b) => a.name.localeCompare(b.name) * factor);
}
