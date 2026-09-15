'use client'

import {useMemo, useState} from "react";
import {Filter, Plus, Search, Wrench} from "lucide-react";
import {OrbitProgress} from "react-loading-indicators";

import {useOwnerEquipment} from "@/features/ownerEquipment/useOwnerEquipment";
import {EquipmentForm, toEquipmentRequest} from "@/features/ownerEquipment/ownerEquipmentTypes";
import {OwnerEquipmentSort, filterEquipment, sortEquipment} from "@/features/ownerEquipment/ownerEquipmentList";
import {toDisplayError} from "@/lib/errorHandler";
import {ApiError} from "@/lib/apiTypes";

import {Input} from "@/_components/shadcn/input";
import {Button} from "@/_components/shadcn/button";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/_components/shadcn/select";
import {Card, CardContent} from "@/_components/shadcn/card";
import {Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle} from "@/_components/shadcn/empty";
import FormErrorAlert from "@/_components/formErrorAlert";
import BranchTabShell from "@/business/(owner)/branches/[branchId]/_components/branchTabShell";
import ResultCount from "@/business/(owner)/branches/[branchId]/_components/resultCount";
import OwnerEquipmentCard from "@/business/(owner)/branches/[branchId]/_components/ownerEquipmentCard";
import EquipmentEditor from "@/business/(owner)/branches/[branchId]/_components/equipmentEditor";

export default function BranchEquipmentContent({branchId}: { branchId: string }) {
    const {equipment, isLoading, isError, error, createEquipment, updateEquipment} = useOwnerEquipment(branchId);
    const [query, setQuery] = useState("");
    const [sort, setSort] = useState<OwnerEquipmentSort>("nameAsc");
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [isAdding, setIsAdding] = useState(false);

    const visible = useMemo(
        () => sortEquipment(filterEquipment(equipment, query), sort),
        [equipment, query, sort]
    );

    const typeOptions = useMemo(
        () => [...new Set(equipment.map((e) => e.type).filter(Boolean))].sort((a, b) => a.localeCompare(b)),
        [equipment]
    );

    const selected = isAdding ? null : (visible.find((e) => e.id === selectedId) ?? visible[0] ?? null);
    const showEditor = isAdding || selected !== null;

    const onSubmit = async (form: EquipmentForm) => {
        const body = toEquipmentRequest(form);
        if (isAdding || !selected) {
            const created = await createEquipment(body);
            setIsAdding(false);
            if (created?.id) setSelectedId(created.id);
        } else {
            await updateEquipment(selected.id, body);
            setSelectedId(selected.id);
        }
    };

    return (
        <BranchTabShell branchId={branchId} active="equipment">
            <div className="grid gap-4 lg:grid-cols-[minmax(0,380px)_1fr] lg:gap-6">
                <div className="flex flex-col gap-3">
                    <section className="flex flex-wrap items-center gap-3">
                        <h2 className="text-lg font-semibold tracking-tight">Equipment</h2>
                        <Button
                            type="button"
                            className="ml-auto"
                            onClick={() => {
                                setIsAdding(true);
                                setSelectedId(null);
                            }}
                        >
                            <Plus/> Add equipment
                        </Button>
                    </section>

                    <div className="flex flex-wrap items-center gap-3 rounded-xl border p-3">
                        <p className="flex items-center gap-2 text-base font-semibold">
                            <Filter className="h-4 w-4"/> Filters:
                        </p>

                        <div className="relative min-w-0 flex-1">
                            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/>
                            <Input
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search by name"
                                className="pl-9"
                            />
                        </div>

                        <div className="flex w-full items-center gap-2">
                            <Select value={sort} onValueChange={(value) => setSort(value as OwnerEquipmentSort)}>
                                <SelectTrigger className="w-40"><SelectValue/></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="nameAsc">Name A–Z</SelectItem>
                                    <SelectItem value="nameDesc">Name Z–A</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button variant="outline" className="ml-auto" onClick={() => { setQuery(""); setSort("nameAsc"); }}>
                                Clear filters
                            </Button>
                        </div>
                    </div>

                    <ResultCount count={visible.length}/>

                    {isError && <FormErrorAlert message={toDisplayError(error as ApiError).message}/>}

                    {isLoading ? (
                        <div className="flex min-h-[30vh] items-center justify-center">
                            <OrbitProgress color="var(--primary)" size="medium" text="" textColor="" dense/>
                        </div>
                    ) : equipment.length === 0 ? (
                        <Empty>
                            <EmptyHeader>
                                <EmptyMedia variant="icon">
                                    <Wrench/>
                                </EmptyMedia>
                                <EmptyTitle>No equipment yet</EmptyTitle>
                                <EmptyDescription>Add equipment to manage it here.</EmptyDescription>
                            </EmptyHeader>
                        </Empty>
                    ) : visible.length === 0 ? (
                        <p className="pt-6 text-center text-sm text-muted-foreground">No equipment match your filters.</p>
                    ) : (
                        <div className="flex flex-col gap-2">
                            {visible.map((item) => (
                                <OwnerEquipmentCard
                                    key={item.id}
                                    equipment={item}
                                    selected={!isAdding && selected?.id === item.id}
                                    onSelect={() => {
                                        setIsAdding(false);
                                        setSelectedId(item.id);
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>

                <div>
                    {showEditor ? (
                        <EquipmentEditor
                            equipment={selected}
                            typeOptions={typeOptions}
                            isNew={isAdding}
                            submitLabel={isAdding || !selected ? "Add equipment" : "Save changes"}
                            onSubmit={onSubmit}
                        />
                    ) : (
                        <Card>
                            <CardContent className="flex min-h-[30vh] items-center justify-center p-4 text-sm text-muted-foreground lg:p-6">
                                Select an item or add new equipment.
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </BranchTabShell>
    );
}
