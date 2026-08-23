"use client"

import {useMemo, useState} from "react";
import {ArrowUpDown, Pencil, Plus, Trash2} from "lucide-react";
import {Badge} from "@/_components/shadcn/badge";
import {Button} from "@/_components/shadcn/button";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/_components/shadcn/select";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/_components/shadcn/table";
import WizardCard from "@/business/(owner)/branches/new/_components/wizardCard";
import ServiceFormDialog from "@/business/(owner)/branches/new/_components/serviceFormDialog";
import {SERVICE_STATUS, SERVICE_STATUS_LABEL, ServiceDraft, ServiceForm} from "@/features/branchRegistration/branchRegistrationTypes";
import {useBranchRegistrationDraft} from "@/features/branchRegistration/useBranchRegistrationDraft";
import {useServiceCategories} from "@/features/branchRegistration/useServiceCategories";
import {useRegisterBranch} from "@/features/branchRegistration/useRegisterBranch";
import {toDisplayError} from "@/lib/errorHandler";
import {ApiError} from "@/lib/apiTypes";

type SortKey = "name" | "durationMinutes" | "price";
const SORT_LABEL: Record<SortKey, string> = {name: "Name", durationMinutes: "Duration", price: "Price"};

export default function ServicesStep() {
    const draft = useBranchRegistrationDraft();
    const {services, serviceBayTypes, roles, equipmentTypes, setServices, setServiceBays, setEmployees, setEquipment, setResult, back} = draft;
    const {categories} = useServiceCategories();
    const {registerBranch, isPending} = useRegisterBranch();

    const [dialog, setDialog] = useState<{ open: boolean; editing: ServiceDraft | null }>({open: false, editing: null});
    const [sortKey, setSortKey] = useState<SortKey>("name");
    const [error, setError] = useState<string | null>(null);

    const categoryName = (id: number) => categories.find((c) => c.id === id)?.name ?? "—";

    const sorted = useMemo(() => [...services].sort((a, b) =>
        sortKey === "name" ? a.name.localeCompare(b.name) : a[sortKey] - b[sortKey]), [services, sortKey]);

    const save = (form: ServiceForm) => {
        const editing = dialog.editing;
        setServices(editing
            ? services.map((s) => (s.id === editing.id ? {...form, id: editing.id} : s))
            : [...services, {...form, id: crypto.randomUUID()}]);
    };

    const submit = async () => {
        setError(null);
        try {
            const created = await registerBranch(useBranchRegistrationDraft.getState());
            setResult(created);
        } catch (err) {
            setError(toDisplayError(err as ApiError).message);
        }
    };

    return (
        <WizardCard
            title="Enter services you provide"
            wide
            busy={isPending}
            error={error}
            back={{label: "Back", onClick: back}}
            next={{label: "Done", onClick: submit}}
        >
            <div className="flex items-center gap-2 sm:justify-between sm:gap-0">
                <Button type="button" className="flex-1 sm:w-auto sm:flex-initial" onClick={() => setDialog({open: true, editing: null})}>
                    <Plus/> Add Service
                </Button>
                <Select value={sortKey} onValueChange={(v) => setSortKey(v as SortKey)}>
                    <SelectTrigger className="flex-1 sm:w-[160px] sm:flex-initial">
                        <ArrowUpDown className="h-4 w-4"/>
                        <SelectValue/>
                    </SelectTrigger>
                    <SelectContent>
                        {(Object.keys(SORT_LABEL) as SortKey[]).map((k) => <SelectItem key={k} value={k}>Sort by {SORT_LABEL[k]}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>

            {services.length === 0 ? (
                <p className="text-sm text-muted-foreground">No services yet — add at least one so customers can book, or finish now and add them later.</p>
            ) : (
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Duration</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Required roles</TableHead>
                                <TableHead>Required tools</TableHead>
                                <TableHead>Bay type</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sorted.map((service) => (
                                <TableRow key={service.id}>
                                    <TableCell className="font-medium">{service.name}</TableCell>
                                    <TableCell className="tabular-nums">{service.durationMinutes} min</TableCell>
                                    <TableCell className="tabular-nums">{service.price} PLN</TableCell>
                                    <TableCell>{categoryName(service.categoryId)}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-1">
                                            {service.employeeRequirements.map((r, i) => (
                                                <Badge key={i} variant="secondary" className="w-fit font-normal">{r.roles.join(" / ")}</Badge>
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-1">
                                            {service.equipmentRequirements.length === 0 && <span className="text-muted-foreground">—</span>}
                                            {service.equipmentRequirements.map((r, i) => (
                                                <Badge key={i} variant="secondary" className="w-fit font-normal">{r.types.join(" / ")}</Badge>
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {service.bayTypes.map((t) => <Badge key={t} variant="outline">{t}</Badge>)}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={service.status === SERVICE_STATUS.ACTIVE ? "success" : "destructiveSoft"}>
                                            {SERVICE_STATUS_LABEL[service.status]}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button type="button" variant="accent" size="icon" aria-label="Edit"
                                                    onClick={() => setDialog({open: true, editing: service})}>
                                                <Pencil/>
                                            </Button>
                                            <Button type="button" variant="destructive" size="icon" aria-label="Delete"
                                                    onClick={() => setServices(services.filter((s) => s.id !== service.id))}>
                                                <Trash2/>
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}

            {dialog.open && (
                <ServiceFormDialog
                    key={dialog.editing?.id ?? "new"}
                    open={dialog.open}
                    onOpenChange={(open) => setDialog((d) => ({...d, open}))}
                    initial={dialog.editing ?? undefined}
                    bayTypes={serviceBayTypes}
                    roles={roles}
                    equipmentTypes={equipmentTypes}
                    onCreateBayType={(name) => setServiceBays([...serviceBayTypes, name], draft.serviceBays)}
                    onCreateRole={(name) => setEmployees([...roles, name], draft.employees)}
                    onCreateEquipmentType={(name) => setEquipment([...equipmentTypes, name], draft.equipment)}
                    onSave={save}
                />
            )}
        </WizardCard>
    );
}
