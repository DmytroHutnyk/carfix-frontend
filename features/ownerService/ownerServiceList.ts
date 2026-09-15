import {OwnerService, ServiceStatus} from "@/features/ownerService/ownerServiceTypes";

export type OwnerServiceSort =
    "nameAsc" | "nameDesc" | "priceAsc" | "priceDesc" | "durationAsc" | "durationDesc";

export type OwnerServiceBadgeVariant =
    "default" | "secondary" | "destructive" | "destructiveSoft" | "success" | "outline";

const STATUS_LABELS: Record<ServiceStatus, string> = {
    ACTIVE: "Allowed for booking",
    SUSPENDED: "Suspended",
};

const STATUS_VARIANT: Record<ServiceStatus, OwnerServiceBadgeVariant> = {
    ACTIVE: "success",
    SUSPENDED: "destructiveSoft",
};

export function serviceStatusLabel(status: ServiceStatus): string {
    return STATUS_LABELS[status] ?? status;
}

export function serviceStatusVariant(status: ServiceStatus): OwnerServiceBadgeVariant {
    return STATUS_VARIANT[status] ?? "secondary";
}

export function filterServices(list: OwnerService[], query: string): OwnerService[] {
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter((service) =>
        service.name.toLowerCase().includes(q) ||
        service.categoryName.toLowerCase().includes(q) ||
        (service.description?.toLowerCase().includes(q) ?? false)
    );
}

export function sortServices(list: OwnerService[], sort: OwnerServiceSort): OwnerService[] {
    const byName = (a: OwnerService, b: OwnerService) => a.name.localeCompare(b.name);
    const sorted = [...list];
    switch (sort) {
        case "nameDesc":
            return sorted.sort((a, b) => b.name.localeCompare(a.name));
        case "priceAsc":
            return sorted.sort((a, b) => a.price - b.price || byName(a, b));
        case "priceDesc":
            return sorted.sort((a, b) => b.price - a.price || byName(a, b));
        case "durationAsc":
            return sorted.sort((a, b) => a.durationMinutes - b.durationMinutes || byName(a, b));
        case "durationDesc":
            return sorted.sort((a, b) => b.durationMinutes - a.durationMinutes || byName(a, b));
        default:
            return sorted.sort(byName);
    }
}

export interface ServiceCategoryGroup {
    categoryId: number;
    categoryName: string;
    services: OwnerService[];
}

export function groupByCategory(list: OwnerService[]): ServiceCategoryGroup[] {
    const groups = new Map<number, ServiceCategoryGroup>();
    for (const service of list) {
        const existing = groups.get(service.categoryId);
        if (existing) {
            existing.services.push(service);
        } else {
            groups.set(service.categoryId, {
                categoryId: service.categoryId,
                categoryName: service.categoryName,
                services: [service],
            });
        }
    }
    return [...groups.values()].sort((a, b) => a.categoryName.localeCompare(b.categoryName));
}

export interface ServiceCategoryCount {
    categoryId: number;
    categoryName: string;
    count: number;
}

export function categoryCounts(list: OwnerService[]): ServiceCategoryCount[] {
    return groupByCategory(list).map((group) => ({
        categoryId: group.categoryId,
        categoryName: group.categoryName,
        count: group.services.length,
    }));
}

export function formatPln(price: number): string {
    return `${price.toFixed(2)} zł`;
}

export function formatDuration(minutes: number): string {
    if (minutes < 60) return `${minutes}min`;
    const hours = Math.floor(minutes / 60);
    const rest = minutes % 60;
    return rest === 0 ? `${hours}h` : `${hours}h ${rest}min`;
}
