import {OwnerEquipment} from "@/features/ownerEquipment/ownerEquipmentTypes";
import {equipmentStatusLabel, equipmentStatusVariant} from "@/features/ownerEquipment/ownerEquipmentList";
import {cn} from "@/lib/utils";
import {Badge} from "@/_components/shadcn/badge";

export default function OwnerEquipmentCard({equipment, selected, onSelect}: {
    equipment: OwnerEquipment;
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
                <span className="min-w-0 truncate text-sm font-semibold">{equipment.name}</span>
                <span className="max-w-[8rem] shrink-0 truncate text-xs tabular-nums text-muted-foreground">#{equipment.id}</span>
            </div>

            {equipment.type && <Badge variant="outline" className="self-start">{equipment.type}</Badge>}

            {equipment.status && (
                <Badge variant={equipmentStatusVariant(equipment.status)} className="self-start">
                    {equipmentStatusLabel(equipment.status)}
                </Badge>
            )}
        </button>
    );
}
