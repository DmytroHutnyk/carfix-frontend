'use client'

import {useMemo, useState} from "react";
import {Plus, Search} from "lucide-react";
import {OrbitProgress} from "react-loading-indicators";

import {useOwnerServices} from "@/features/ownerService/useOwnerServices";
import {useServiceFormOptions} from "@/features/ownerService/useServiceFormOptions";
import {toServiceRequest} from "@/features/ownerService/ownerServiceApi";
import {EMPTY_SERVICE_FORM, OwnerService, ServiceForm, toServiceForm} from "@/features/ownerService/ownerServiceTypes";
import {
    categoryCounts,
    filterServices,
    groupByCategory,
    OwnerServiceSort,
    sortServices,
} from "@/features/ownerService/ownerServiceList";
import {isApiError} from "@/lib/apiTypes";
import {toDisplayError} from "@/lib/errorHandler";
import {ApiError} from "@/lib/apiTypes";

import {Input} from "@/_components/shadcn/input";
import {Button} from "@/_components/shadcn/button";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/_components/shadcn/select";
import FormErrorAlert from "@/_components/formErrorAlert";
import BranchTabShell from "@/business/(owner)/branches/[branchId]/_components/branchTabShell";
import ServiceCategorySidebar from "@/business/(owner)/branches/[branchId]/_components/serviceCategorySidebar";
import ServiceCategoryCard from "@/business/(owner)/branches/[branchId]/_components/serviceCategoryCard";
import ServiceRow from "@/business/(owner)/branches/[branchId]/_components/serviceRow";
import ServiceFormDialog from "@/business/(owner)/branches/[branchId]/_components/serviceFormDialog";

type DialogState =
    | { mode: "create"; initial: ServiceForm }
    | { mode: "edit"; serviceId: number; initial: ServiceForm };

export default function BranchServicesContent({branchId}: { branchId: string }) {
    const {services, isLoading, isError, error, createService, updateService, activateService, suspendService, deleteService} =
        useOwnerServices(branchId);

    const [query, setQuery] = useState("");
    const [categoryQuery, setCategoryQuery] = useState("");
    const [sort, setSort] = useState<OwnerServiceSort>("nameAsc");
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const [categoriesCollapsed, setCategoriesCollapsed] = useState(false);
    const [collapsedIds, setCollapsedIds] = useState<Set<number>>(new Set());
    const [dialog, setDialog] = useState<DialogState | null>(null);
    const [actionError, setActionError] = useState<string | null>(null);

    const options = useServiceFormOptions(branchId, {enabled: dialog !== null});

    const filtered = useMemo(() => filterServices(services, query), [services, query]);
    const counts = useMemo(() => categoryCounts(filtered), [filtered]);
    const groups = useMemo(() => groupByCategory(sortServices(filtered, sort)), [filtered, sort]);
    const visibleGroups = selectedCategoryId === null ? groups : groups.filter((g) => g.categoryId === selectedCategoryId);

    const runAction = async (fn: () => Promise<unknown>) => {
        setActionError(null);
        try {
            await fn();
        } catch (err) {
            setActionError(isApiError(err) ? toDisplayError(err).message : "Something went wrong. Please try again.");
        }
    };

    const handleDialogSubmit = async (form: ServiceForm) => {
        const body = toServiceRequest(form);
        if (dialog?.mode === "edit") {
            await updateService(dialog.serviceId, body);
        } else {
            await createService(body);
        }
    };

    const toggleStatus = (service: OwnerService) =>
        runAction(() => (service.status === "ACTIVE" ? suspendService(service.id) : activateService(service.id)));

    const expandAll = () => setCollapsedIds(new Set());
    const collapseAll = () => setCollapsedIds(new Set(groups.map((g) => g.categoryId)));
    const setCategoryOpen = (categoryId: number, open: boolean) =>
        setCollapsedIds((prev) => {
            const next = new Set(prev);
            if (open) next.delete(categoryId); else next.add(categoryId);
            return next;
        });

    return (
        <BranchTabShell branchId={branchId} active="services">
            <div className="grid gap-4 lg:grid-cols-[auto_1fr] lg:gap-6">
                <ServiceCategorySidebar
                    counts={counts}
                    totalCount={filtered.length}
                    selectedCategoryId={selectedCategoryId}
                    onSelectCategory={setSelectedCategoryId}
                    query={categoryQuery}
                    onQueryChange={setCategoryQuery}
                    onExpandAll={expandAll}
                    onCollapseAll={collapseAll}
                    collapsed={categoriesCollapsed}
                    onToggleCollapsed={() => setCategoriesCollapsed((v) => !v)}
                />

                <div className="flex flex-col gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                        <div className="relative min-w-[12rem] flex-1">
                            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/>
                            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search services" className="pl-9"/>
                        </div>
                        <Select value={sort} onValueChange={(value) => setSort(value as OwnerServiceSort)}>
                            <SelectTrigger className="w-[170px]">
                                <SelectValue/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="nameAsc">Name A–Z</SelectItem>
                                <SelectItem value="nameDesc">Name Z–A</SelectItem>
                                <SelectItem value="priceAsc">Price low–high</SelectItem>
                                <SelectItem value="priceDesc">Price high–low</SelectItem>
                                <SelectItem value="durationAsc">Duration short–long</SelectItem>
                                <SelectItem value="durationDesc">Duration long–short</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button type="button" onClick={() => setDialog({mode: "create", initial: EMPTY_SERVICE_FORM})}>
                            <Plus/> New service
                        </Button>
                    </div>

                    {actionError && <FormErrorAlert message={actionError}/>}
                    {isError && <FormErrorAlert message={toDisplayError(error as ApiError).message}/>}

                    {isLoading ? (
                        <div className="flex min-h-[30vh] items-center justify-center">
                            <OrbitProgress color="var(--primary)" size="medium" text="" textColor="" dense/>
                        </div>
                    ) : services.length === 0 ? (
                        <p className="py-8 text-center text-sm text-muted-foreground">No services yet.</p>
                    ) : visibleGroups.length === 0 ? (
                        <p className="py-8 text-center text-sm text-muted-foreground">No services match your search.</p>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {visibleGroups.map((group) => (
                                <ServiceCategoryCard
                                    key={group.categoryId}
                                    categoryName={group.categoryName}
                                    count={group.services.length}
                                    open={!collapsedIds.has(group.categoryId)}
                                    onOpenChange={(open) => setCategoryOpen(group.categoryId, open)}
                                >
                                    {group.services.map((service) => (
                                        <ServiceRow
                                            key={service.id}
                                            service={service}
                                            onEdit={() => setDialog({mode: "edit", serviceId: service.id, initial: toServiceForm(service)})}
                                            onToggleStatus={() => toggleStatus(service)}
                                            onDelete={() => runAction(() => deleteService(service.id))}
                                        />
                                    ))}
                                </ServiceCategoryCard>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {dialog && (
                <ServiceFormDialog
                    key={dialog.mode === "edit" ? `edit-${dialog.serviceId}` : "create"}
                    open
                    onOpenChange={(open) => { if (!open) setDialog(null); }}
                    mode={dialog.mode}
                    initial={dialog.initial}
                    bayTypeOptions={options.bayTypeOptions}
                    roleOptions={options.roleOptions}
                    equipmentTypeOptions={options.equipmentTypeOptions}
                    optionsLoading={options.isLoading}
                    onSubmit={handleDialogSubmit}
                />
            )}
        </BranchTabShell>
    );
}
