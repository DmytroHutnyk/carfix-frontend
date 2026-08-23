"use client"

import {useState} from "react";
import {Plus, Trash2} from "lucide-react";
import {Button} from "@/_components/shadcn/button";
import {Input} from "@/_components/shadcn/input";
import CreatableSelect from "@/_components/creatableSelect";
import WizardCard from "@/business/(owner)/branches/new/_components/wizardCard";
import FieldError from "@/business/(owner)/branches/new/_components/fieldError";
import {EmployeeRow} from "@/features/branchRegistration/branchRegistrationTypes";
import {useBranchRegistrationDraft} from "@/features/branchRegistration/useBranchRegistrationDraft";
import {cn} from "@/lib/utils";

function newRow(): EmployeeRow {
    return {id: crypto.randomUUID(), firstName: "", lastName: "", role: ""};
}

export default function EmployeesStep() {
    const savedRoles = useBranchRegistrationDraft((s) => s.roles);
    const savedRows = useBranchRegistrationDraft((s) => s.employees);
    const setEmployees = useBranchRegistrationDraft((s) => s.setEmployees);
    const next = useBranchRegistrationDraft((s) => s.next);
    const back = useBranchRegistrationDraft((s) => s.back);

    const [roles, setRoles] = useState<string[]>(savedRoles);
    const [rows, setRows] = useState<EmployeeRow[]>(savedRows);
    const [showErrors, setShowErrors] = useState(false);

    const update = (id: string, patch: Partial<EmployeeRow>) =>
        setRows(rows.map((row) => (row.id === id ? {...row, ...patch} : row)));

    const rowInvalid = (row: EmployeeRow) =>
        row.firstName.trim() === "" || row.lastName.trim() === "" || row.role === "";

    const submit = () => {
        if (rows.some(rowInvalid)) {
            setShowErrors(true);
            return;
        }
        setEmployees(roles, rows);
        next();
    };

    const invalid = (bad: boolean) => cn(bad && "border-destructive focus-visible:ring-destructive");

    return (
        <WizardCard
            title="Register your employees and assign a role"
            subtitle="You can add more details later."
            hint={<p>Roles are yours to define (Mechanic, Diagnostician, EV high-voltage…). A service later names the roles that can perform it; any employee holding one of them qualifies. Login accounts for staff can be linked later.</p>}
            wide
            back={{label: "Back", onClick: () => { setEmployees(roles, rows); back(); }}}
            next={{label: "Continue", onClick: submit}}
        >
            <Button type="button" className="w-full sm:w-auto" onClick={() => { setRows([...rows, newRow()]); setShowErrors(false); }}>
                <Plus/> Add employee
            </Button>

            {rows.length === 0 && (
                <p className="text-sm text-muted-foreground">Nobody added yet — you can also add employees later.</p>
            )}

            <div className="space-y-3">
                {rows.map((row) => {
                    const firstNameMissing = showErrors && row.firstName.trim() === "";
                    const lastNameMissing = showErrors && row.lastName.trim() === "";
                    const roleMissing = showErrors && row.role === "";
                    return (
                        <div key={row.id} className="space-y-2 rounded-xl border border-border p-4">
                            <div className="grid grid-cols-1 items-start gap-3 md:grid-cols-[1fr_1fr_1fr_auto]">
                                <Input value={row.firstName} onChange={(e) => update(row.id, {firstName: e.target.value})}
                                       placeholder="First name" maxLength={50} aria-label="First name"
                                       aria-invalid={firstNameMissing || undefined} className={invalid(firstNameMissing)}/>
                                <Input value={row.lastName} onChange={(e) => update(row.id, {lastName: e.target.value})}
                                       placeholder="Last name" maxLength={50} aria-label="Last name"
                                       aria-invalid={lastNameMissing || undefined} className={invalid(lastNameMissing)}/>
                                <CreatableSelect
                                    value={row.role}
                                    options={roles}
                                    onChange={(role) => update(row.id, {role})}
                                    onCreate={(name) => setRoles([...roles, name])}
                                    placeholder="Select or add a role"
                                    maxNameLength={50}
                                    ariaLabel="Role"
                                    createLabel="Add role"
                                    invalid={roleMissing}
                                />
                                <Button type="button" variant="destructive" size="icon" aria-label="Remove"
                                        className="justify-self-end md:justify-self-auto"
                                        onClick={() => setRows(rows.filter((r) => r.id !== row.id))}>
                                    <Trash2/>
                                </Button>
                            </div>
                            <FieldError message={firstNameMissing || lastNameMissing || roleMissing ? "First name, last name and a role are required" : undefined}/>
                        </div>
                    );
                })}
            </div>
        </WizardCard>
    );
}
