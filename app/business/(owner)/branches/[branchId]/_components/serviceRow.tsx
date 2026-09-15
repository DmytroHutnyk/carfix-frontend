'use client'

import {useState} from "react";
import {ChevronDown, Eye, EyeOff, Pencil, Trash2} from "lucide-react";

import {OwnerService} from "@/features/ownerService/ownerServiceTypes";
import {formatDuration, formatPln, serviceStatusLabel, serviceStatusVariant} from "@/features/ownerService/ownerServiceList";
import {Badge} from "@/_components/shadcn/badge";
import {Button} from "@/_components/shadcn/button";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/_components/shadcn/collapsible";
import {Separator} from "@/_components/shadcn/separator";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/_components/shadcn/alert-dialog";
import {cn} from "@/lib/utils";

interface ServiceRowProps {
    service: OwnerService;
    onEdit: () => void;
    onToggleStatus: () => void;
    onDelete: () => void;
}

export default function ServiceRow({service, onEdit, onToggleStatus, onDelete}: ServiceRowProps) {
    const [open, setOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const isActive = service.status === "ACTIVE";

    return (
        <Collapsible open={open} onOpenChange={setOpen} className="col-span-full grid grid-cols-subgrid rounded-lg border bg-card px-3 text-card-foreground">
            <CollapsibleTrigger className="col-span-full grid grid-cols-subgrid items-center justify-items-start gap-x-4 py-3 text-left [&[data-state=open]>svg]:rotate-180">
                <span className="min-w-0 break-words text-sm font-semibold">{service.name}</span>
                <Badge variant={serviceStatusVariant(service.status)}>{serviceStatusLabel(service.status)}</Badge>
                <span className="text-xs tabular-nums text-muted-foreground">{formatDuration(service.durationMinutes)}</span>
                <span className="text-xs font-medium tabular-nums">{formatPln(service.price)}</span>
                <span className="flex items-center gap-1">
                    {service.bayTypes.slice(0, 2).map((type) => <Badge key={type} variant="outline">{type}</Badge>)}
                    {service.bayTypes.length > 2 && <Badge variant="outline">+{service.bayTypes.length - 2}</Badge>}
                </span>
                <span className="whitespace-nowrap text-xs text-muted-foreground">Roles ({service.employeeRequirements.length})</span>
                <span className="whitespace-nowrap text-xs text-muted-foreground">Equipment ({service.equipmentRequirements.length})</span>
                <ChevronDown className="h-4 w-4 shrink-0 justify-self-end text-muted-foreground transition-transform duration-200"/>
            </CollapsibleTrigger>

            <div className="col-span-full flex items-center justify-end gap-1 pb-3">
                <Button type="button" variant="ghost" size="icon" aria-label="Edit service" onClick={onEdit}>
                    <Pencil/>
                </Button>
                <Button type="button" variant="ghost" size="icon" aria-label={isActive ? "Suspend service" : "Activate service"} onClick={onToggleStatus}>
                    {isActive ? <Eye/> : <EyeOff/>}
                </Button>
                <Button type="button" variant="ghost" size="icon" aria-label="Delete service" onClick={() => setDeleteOpen(true)}>
                    <Trash2/>
                </Button>
            </div>

            <CollapsibleContent className="col-span-full overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                <Separator/>
                <div className="space-y-4 py-3">
                    {service.description && <p className="text-sm text-muted-foreground">{service.description}</p>}

                    <dl className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <dt className="text-xs font-medium text-muted-foreground">Required roles</dt>
                            <dd className="mt-1 flex flex-wrap gap-1">
                                {service.employeeRequirements.length === 0
                                    ? <span className="text-sm text-muted-foreground">—</span>
                                    : service.employeeRequirements.map((requirement, index) => (
                                        <Badge key={index} variant="secondary" className="font-normal">{requirement.roles.join(" / ")}</Badge>
                                    ))}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-xs font-medium text-muted-foreground">Required equipment</dt>
                            <dd className="mt-1 flex flex-wrap gap-1">
                                {service.equipmentRequirements.length === 0
                                    ? <span className="text-sm text-muted-foreground">—</span>
                                    : service.equipmentRequirements.map((requirement, index) => (
                                        <Badge key={index} variant="secondary" className="font-normal">{requirement.types.join(" / ")}</Badge>
                                    ))}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-xs font-medium text-muted-foreground">Car bay types</dt>
                            <dd className="mt-1 flex flex-wrap gap-1">
                                {service.bayTypes.length === 0
                                    ? <span className="text-sm text-muted-foreground">—</span>
                                    : service.bayTypes.map((type) => <Badge key={type} variant="outline">{type}</Badge>)}
                            </dd>
                        </div>
                    </dl>
                </div>
            </CollapsibleContent>

            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete {service.name}?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This permanently removes the service from this branch and cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={onDelete}
                                           className={cn("bg-destructive text-destructive-foreground hover:bg-destructive/90")}>
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Collapsible>
    );
}
