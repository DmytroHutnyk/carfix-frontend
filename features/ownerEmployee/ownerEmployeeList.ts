import {OwnerEmployee} from "@/features/ownerEmployee/ownerEmployeeTypes";

export type OwnerEmployeeSort = "nameAsc" | "nameDesc";

export type OwnerEmployeeBadgeVariant =
    "default" | "secondary" | "destructive" | "destructiveSoft" | "success" | "outline";

const STATUS_LABELS: Record<string, string> = {
    AVAILABLE: "Available",
    BUSY: "Busy",
    OUT_OF_WORKING_HOURS: "Out of working hours",
    SUSPENDED: "Suspended",
};

const STATUS_VARIANT: Record<string, OwnerEmployeeBadgeVariant> = {
    AVAILABLE: "success",
    BUSY: "default",
    OUT_OF_WORKING_HOURS: "secondary",
    SUSPENDED: "destructiveSoft",
};

export function employeeStatusLabel(status: string): string {
    return STATUS_LABELS[status] ?? status;
}

export function employeeStatusVariant(status: string): OwnerEmployeeBadgeVariant {
    return STATUS_VARIANT[status] ?? "secondary";
}

export function fullName(employee: OwnerEmployee): string {
    return `${employee.name} ${employee.surname}`.trim();
}

export function filterEmployees(list: OwnerEmployee[], query: string): OwnerEmployee[] {
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter((e) =>
        [e.name, e.surname, e.phone, e.email, ...e.roles].join(" ").toLowerCase().includes(q)
    );
}

export function sortEmployees(list: OwnerEmployee[], sort: OwnerEmployeeSort): OwnerEmployee[] {
    const factor = sort === "nameDesc" ? -1 : 1;
    return [...list].sort((a, b) => fullName(a).localeCompare(fullName(b)) * factor);
}
