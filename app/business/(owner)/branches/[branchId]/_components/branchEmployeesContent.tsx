'use client'

import {useMemo, useState} from "react";
import {Plus, Users} from "lucide-react";
import {OrbitProgress} from "react-loading-indicators";

import {useOwnerEmployees} from "@/features/ownerEmployee/useOwnerEmployees";
import {EmployeeForm, toEmployeeRequest} from "@/features/ownerEmployee/ownerEmployeeTypes";
import {OwnerEmployeeSort, filterEmployees, sortEmployees} from "@/features/ownerEmployee/ownerEmployeeList";
import {toDisplayError} from "@/lib/errorHandler";
import {ApiError} from "@/lib/apiTypes";

import {Button} from "@/_components/shadcn/button";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/_components/shadcn/select";
import {Card, CardContent} from "@/_components/shadcn/card";
import {Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle} from "@/_components/shadcn/empty";
import FormErrorAlert from "@/_components/formErrorAlert";
import BranchTabShell from "@/business/(owner)/branches/[branchId]/_components/branchTabShell";
import BranchFilterBar from "@/business/(owner)/branches/[branchId]/_components/branchFilterBar";
import ResultCount from "@/business/(owner)/branches/[branchId]/_components/resultCount";
import OwnerEmployeeCard from "@/business/(owner)/branches/[branchId]/_components/ownerEmployeeCard";
import EmployeeEditor from "@/business/(owner)/branches/[branchId]/_components/employeeEditor";

export default function BranchEmployeesContent({branchId}: { branchId: string }) {
    const {employees, isLoading, isError, error, createEmployee, updateEmployee} = useOwnerEmployees(branchId);
    const [query, setQuery] = useState("");
    const [sort, setSort] = useState<OwnerEmployeeSort>("nameAsc");
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [isAdding, setIsAdding] = useState(false);

    const visible = useMemo(
        () => sortEmployees(filterEmployees(employees, query), sort),
        [employees, query, sort]
    );

    const roleOptions = useMemo(
        () => [...new Set(employees.flatMap((e) => e.roles))].sort((a, b) => a.localeCompare(b)),
        [employees]
    );

    const selected = isAdding ? null : (visible.find((e) => e.id === selectedId) ?? visible[0] ?? null);
    const showEditor = isAdding || selected !== null;

    const onSubmit = async (form: EmployeeForm) => {
        const body = toEmployeeRequest(form);
        if (isAdding || !selected) {
            const created = await createEmployee(body);
            setIsAdding(false);
            if (created?.id) setSelectedId(created.id);
        } else {
            await updateEmployee(selected.id, body);
            setSelectedId(selected.id);
        }
    };

    return (
        <BranchTabShell branchId={branchId} active="employees">
            <div className="grid gap-4 lg:grid-cols-[minmax(0,380px)_1fr] lg:gap-6">
                <div className="flex flex-col gap-3">
                    <section className="flex flex-wrap items-center gap-3">
                        <h2 className="text-lg font-semibold tracking-tight">Employees</h2>
                        <Button
                            type="button"
                            className="ml-auto"
                            onClick={() => {
                                setIsAdding(true);
                                setSelectedId(null);
                            }}
                        >
                            <Plus/> Add employee
                        </Button>
                    </section>

                    <BranchFilterBar
                        query={query}
                        onQueryChange={setQuery}
                        searchPlaceholder="Search name, role, phone"
                        onClear={() => { setQuery(""); setSort("nameAsc"); }}
                    >
                        <Select value={sort} onValueChange={(value) => setSort(value as OwnerEmployeeSort)}>
                            <SelectTrigger className="w-full"><SelectValue/></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="nameAsc">Name A–Z</SelectItem>
                                <SelectItem value="nameDesc">Name Z–A</SelectItem>
                            </SelectContent>
                        </Select>
                    </BranchFilterBar>

                    <ResultCount count={visible.length}/>

                    {isError && <FormErrorAlert message={toDisplayError(error as ApiError).message}/>}

                    {isLoading ? (
                        <div className="flex min-h-[30vh] items-center justify-center">
                            <OrbitProgress color="var(--primary)" size="medium" text="" textColor="" dense/>
                        </div>
                    ) : employees.length === 0 ? (
                        <Empty>
                            <EmptyHeader>
                                <EmptyMedia variant="icon">
                                    <Users/>
                                </EmptyMedia>
                                <EmptyTitle>No employees yet</EmptyTitle>
                                <EmptyDescription>Add employees to manage them here.</EmptyDescription>
                            </EmptyHeader>
                        </Empty>
                    ) : visible.length === 0 ? (
                        <p className="pt-6 text-center text-sm text-muted-foreground">No employees match your filters.</p>
                    ) : (
                        <div className="flex flex-col gap-2">
                            {visible.map((employee) => (
                                <OwnerEmployeeCard
                                    key={employee.id}
                                    employee={employee}
                                    selected={!isAdding && selected?.id === employee.id}
                                    onSelect={() => {
                                        setIsAdding(false);
                                        setSelectedId(employee.id);
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>

                <div>
                    {showEditor ? (
                        <EmployeeEditor
                            employee={selected}
                            roleOptions={roleOptions}
                            isNew={isAdding}
                            submitLabel={isAdding || !selected ? "Add employee" : "Save changes"}
                            onSubmit={onSubmit}
                        />
                    ) : (
                        <Card>
                            <CardContent className="flex min-h-[30vh] items-center justify-center p-4 text-sm text-muted-foreground lg:p-6">
                                Select an employee or add a new one.
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </BranchTabShell>
    );
}
