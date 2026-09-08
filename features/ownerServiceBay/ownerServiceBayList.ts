import {OwnerServiceBay, ServiceBayStatus} from "@/features/ownerServiceBay/ownerServiceBayTypes";

export type OwnerServiceBaySort = "nameAsc" | "nameDesc";

export type OwnerServiceBayBadgeVariant =
    "default" | "secondary" | "destructive" | "destructiveSoft" | "success" | "outline";

const STATUS_LABELS: Record<ServiceBayStatus, string> = {
    ACTIVE: "Active",
    SUSPENDED: "Suspended",
};

const STATUS_VARIANT: Record<ServiceBayStatus, OwnerServiceBayBadgeVariant> = {
    ACTIVE: "success",
    SUSPENDED: "destructiveSoft",
};

export function serviceBayStatusLabel(status: ServiceBayStatus): string {
    return STATUS_LABELS[status] ?? status;
}

export function serviceBayStatusVariant(status: ServiceBayStatus): OwnerServiceBayBadgeVariant {
    return STATUS_VARIANT[status] ?? "secondary";
}

export function filterServiceBays(list: OwnerServiceBay[], query: string): OwnerServiceBay[] {
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter((bay) => bay.name.toLowerCase().includes(q));
}

export function sortServiceBays(list: OwnerServiceBay[], sort: OwnerServiceBaySort): OwnerServiceBay[] {
    const factor = sort === "nameDesc" ? -1 : 1;
    return [...list].sort((a, b) => a.name.localeCompare(b.name) * factor);
}
