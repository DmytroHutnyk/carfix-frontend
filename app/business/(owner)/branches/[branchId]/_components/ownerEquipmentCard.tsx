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
                "flex w-full flex-col gap-2 rounded-xl border bg-card p-4 text-left text-card-foreground shadow transition-colors",
                selected ? "border-primary bg-accent/10" : "hover:bg-accent/10"
            )}
        >
            <span className="truncate text-sm font-semibold">{equipment.name}</span>

            {equipment.type && <Badge variant="outline" className="self-start">{equipment.type}</Badge>}

            {equipment.status && (
                <Badge variant={equipmentStatusVariant(equipment.status)} className="self-start">
                    {equipmentStatusLabel(equipment.status)}
                </Badge>
            )}
        </button>
    );
}
