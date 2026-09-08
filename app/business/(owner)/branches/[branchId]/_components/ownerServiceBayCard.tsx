import {OwnerServiceBay} from "@/features/ownerServiceBay/ownerServiceBayTypes";
import {serviceBayStatusLabel, serviceBayStatusVariant} from "@/features/ownerServiceBay/ownerServiceBayList";
import {cn} from "@/lib/utils";
import {Badge} from "@/_components/shadcn/badge";

export default function OwnerServiceBayCard({bay, selected, onSelect}: {
    bay: OwnerServiceBay;
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
                <span className="min-w-0 truncate text-sm font-semibold">{bay.name}</span>
                <span className="shrink-0 text-xs tabular-nums text-muted-foreground">#{bay.id}</span>
            </div>

            {bay.type && <Badge variant="outline" className="self-start">{bay.type}</Badge>}

            <Badge variant={serviceBayStatusVariant(bay.status)} className="self-start">
                {serviceBayStatusLabel(bay.status)}
            </Badge>
        </button>
    );
}
