import {OwnerEmployee} from "@/features/ownerEmployee/ownerEmployeeTypes";
import {employeeStatusLabel, employeeStatusVariant, fullName} from "@/features/ownerEmployee/ownerEmployeeList";
import {cn} from "@/lib/utils";
import {Badge} from "@/_components/shadcn/badge";

export default function OwnerEmployeeCard({employee, selected, onSelect}: {
    employee: OwnerEmployee;
    selected: boolean;
    onSelect: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onSelect}
            className={cn(
                "flex w-full flex-col gap-2 rounded-xl border bg-card p-4 text-left text-card-foreground shadow-sm transition-colors",
                selected ? "border-primary bg-accent/40" : "hover:bg-accent/30"
            )}
        >
            <div className="flex items-center justify-between gap-2">
                <span className="min-w-0 truncate text-sm font-semibold">{fullName(employee)}</span>
                <span className="max-w-[8rem] shrink-0 truncate text-xs tabular-nums text-muted-foreground">#{employee.id}</span>
            </div>

            {employee.roles.length > 0 && (
                <div className="flex flex-wrap gap-1">
                    {employee.roles.map((role, i) => (
                        <Badge key={`${role}-${i}`} variant="outline">{role}</Badge>
                    ))}
                </div>
            )}

            <div className="flex flex-col gap-0.5 text-xs text-muted-foreground">
                <span className="tabular-nums">{employee.phone}</span>
                <span className="break-all">{employee.email}</span>
            </div>

            {employee.status && (
                <Badge variant={employeeStatusVariant(employee.status)} className="self-start">
                    {employeeStatusLabel(employee.status)}
                </Badge>
            )}
        </button>
    );
}
