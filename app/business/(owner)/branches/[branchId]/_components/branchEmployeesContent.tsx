'use client'

import {useMemo, useState} from "react";
import {Plus, Search} from "lucide-react";
import {OrbitProgress} from "react-loading-indicators";

import {useOwnerEmployees} from "@/features/ownerEmployee/useOwnerEmployees";
import {EmployeeForm, toEmployeeRequest} from "@/features/ownerEmployee/ownerEmployeeTypes";
import {OwnerEmployeeSort, filterEmployees, sortEmployees} from "@/features/ownerEmployee/ownerEmployeeList";
import {toDisplayError} from "@/lib/errorHandler";
import {ApiError} from "@/lib/apiTypes";

import {Input} from "@/_components/shadcn/input";
import {Button} from "@/_components/shadcn/button";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/_components/shadcn/select";
import {Card, CardContent} from "@/_components/shadcn/card";
import FormErrorAlert from "@/_components/formErrorAlert";
import BranchTabShell from "@/business/(owner)/branches/[branchId]/_components/branchTabShell";
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
                    <h2 className="text-lg font-semibold tracking-tight">Employees Browser</h2>

                    <div className="relative">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/>
                        <Input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search name, role, phone"
                            className="pl-9"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <Select value={sort} onValueChange={(value) => setSort(value as OwnerEmployeeSort)}>
                            <SelectTrigger className="w-[150px]">
                                <SelectValue/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="nameAsc">Name A–Z</SelectItem>
                                <SelectItem value="nameDesc">Name Z–A</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button
                            type="button"
                            className="ml-auto"
                            onClick={() => {
                                setIsAdding(true);
                                setSelectedId(null);
                            }}
                        >
                            <Plus/>
                            Add employee
                        </Button>
                    </div>

                    <span className="text-xs text-muted-foreground">
                        Result: {visible.length} {visible.length === 1 ? "entry" : "entries"}
                    </span>

                    {isError && <FormErrorAlert message={toDisplayError(error as ApiError).message}/>}

                    {isLoading ? (
                        <div className="flex min-h-[30vh] items-center justify-center">
                            <OrbitProgress color="var(--primary)" size="medium" text="" textColor="" dense/>
                        </div>
                    ) : visible.length === 0 ? (
                        <p className="py-8 text-center text-sm text-muted-foreground">No employees yet.</p>
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
