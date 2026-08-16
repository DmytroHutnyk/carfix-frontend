"use client"

import {ReactNode, useState} from "react";
import {Plus, Trash2} from "lucide-react";
import {Button} from "@/_components/shadcn/button";
import {Input} from "@/_components/shadcn/input";
import CreatableSelect from "@/_components/creatableSelect";
import WizardCard from "@/business/(owner)/service-points/new/_components/wizardCard";
import FieldError from "@/business/(owner)/service-points/new/_components/fieldError";
import {ResourceRow} from "@/features/branchRegistration/branchRegistrationTypes";
import {cn} from "@/lib/utils";

interface ResourceListStepProps {
    title: string;
    subtitle: string;
    hint: ReactNode;
    addLabel: string;
    namePlaceholder: string;
    typePlaceholder: string;
    createTypeLabel: string;
    initialTypes: string[];
    initialRows: ResourceRow[];
    onBack: (types: string[], rows: ResourceRow[]) => void;
    onContinue: (types: string[], rows: ResourceRow[]) => void;
}

function newRow(): ResourceRow {
    return {id: crypto.randomUUID(), name: "", type: ""};
}

export default function ResourceListStep({
                                             title, subtitle, hint, addLabel, namePlaceholder, typePlaceholder, createTypeLabel,
                                             initialTypes, initialRows, onBack, onContinue,
                                         }: ResourceListStepProps) {
    const [types, setTypes] = useState<string[]>(initialTypes);
    const [rows, setRows] = useState<ResourceRow[]>(initialRows);
    const [showErrors, setShowErrors] = useState(false);

    const update = (id: string, patch: Partial<ResourceRow>) =>
        setRows(rows.map((row) => (row.id === id ? {...row, ...patch} : row)));

    const rowInvalid = (row: ResourceRow) => row.name.trim() === "" || row.type === "";

    const submit = () => {
        if (rows.some(rowInvalid)) {
            setShowErrors(true);
            return;
        }
        onContinue(types, rows);
    };

    return (
        <WizardCard
            title={title}
            subtitle={subtitle}
            hint={hint}
            wide
            back={{label: "Back", onClick: () => onBack(types, rows)}}
            next={{label: "Continue", onClick: submit}}
        >
            <Button type="button" onClick={() => { setRows([...rows, newRow()]); setShowErrors(false); }}>
                <Plus/> {addLabel}
            </Button>

            {rows.length === 0 && (
                <p className="text-sm text-muted-foreground">Nothing added yet — you can also add these later.</p>
            )}

            <div className="space-y-3">
                {rows.map((row) => {
                    const nameMissing = showErrors && row.name.trim() === "";
                    const typeMissing = showErrors && row.type === "";
                    return (
                        <div key={row.id} className="rounded-xl border border-border p-4">
                            <div className="grid grid-cols-[1fr_1fr_auto] items-start gap-3">
                                <div className="space-y-1">
                                    <Input
                                        value={row.name}
                                        onChange={(e) => update(row.id, {name: e.target.value})}
                                        placeholder={namePlaceholder}
                                        maxLength={100}
                                        aria-label={namePlaceholder}
                                        aria-invalid={nameMissing || undefined}
                                        className={cn(nameMissing && "border-destructive focus-visible:ring-destructive")}
                                    />
                                    <FieldError message={nameMissing ? "Name is required" : undefined}/>
                                </div>
                                <div className="space-y-1">
                                    <CreatableSelect
                                        value={row.type}
                                        options={types}
                                        onChange={(type) => update(row.id, {type})}
                                        onCreate={(name) => setTypes([...types, name])}
                                        placeholder={typePlaceholder}
                                        maxNameLength={40}
                                        ariaLabel={typePlaceholder}
                                        createLabel={createTypeLabel}
                                        invalid={typeMissing}
                                    />
                                    <FieldError message={typeMissing ? "Pick or add a type" : undefined}/>
                                </div>
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    aria-label="Remove"
                                    onClick={() => setRows(rows.filter((r) => r.id !== row.id))}
                                >
                                    <Trash2/>
                                </Button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </WizardCard>
    );
}
