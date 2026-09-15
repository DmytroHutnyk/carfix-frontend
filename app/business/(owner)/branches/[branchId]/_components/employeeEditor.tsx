'use client'

import {ReactNode, useState} from "react";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {ChevronDown, X} from "lucide-react";

import {
    EmployeeForm,
    OwnerEmployee,
    PHONE_PREFIX,
    employeeFormSchema,
    toEmployeeForm,
} from "@/features/ownerEmployee/ownerEmployeeTypes";
import {toDisplayError} from "@/lib/errorHandler";
import {ApiError} from "@/lib/apiTypes";
import {cn} from "@/lib/utils";

import {Card, CardContent} from "@/_components/shadcn/card";
import {Input} from "@/_components/shadcn/input";
import {Button} from "@/_components/shadcn/button";
import {Label} from "@/_components/shadcn/label";
import {Badge} from "@/_components/shadcn/badge";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/_components/shadcn/collapsible";
import {Separator} from "@/_components/shadcn/separator";
import FormErrorAlert from "@/_components/formErrorAlert";

export default function EmployeeEditor({employee, submitLabel, onSubmit}: {
    employee: OwnerEmployee | null;
    submitLabel: string;
    onSubmit: (form: EmployeeForm) => Promise<void>;
}) {
    const [error, setError] = useState<string | null>(null);
    const [roleDraft, setRoleDraft] = useState("");

    const {register, control, handleSubmit, formState: {errors, isSubmitting, isDirty}} = useForm<EmployeeForm>({
        resolver: zodResolver(employeeFormSchema),
        mode: "onSubmit",
        values: toEmployeeForm(employee),
    });

    const submit = async (form: EmployeeForm) => {
        setError(null);
        try {
            await onSubmit(form);
        } catch (err) {
            setError(toDisplayError(err as ApiError).message);
        }
    };

    return (
        <Card>
            <CardContent className="p-4 lg:p-6">
                <form onSubmit={handleSubmit(submit)} noValidate className="flex flex-col gap-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <Field label="Name" error={errors.name?.message}>
                            <Input {...register("name")} className={cn(errors.name && "border-destructive focus-visible:ring-destructive")}/>
                        </Field>
                        <Field label="Surname" error={errors.surname?.message}>
                            <Input {...register("surname")} className={cn(errors.surname && "border-destructive focus-visible:ring-destructive")}/>
                        </Field>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <Field label="Phone" error={errors.phone?.message}>
                            <div className="flex items-center gap-2">
                                <span className="inline-flex h-9 items-center rounded-md border border-input bg-muted px-3 text-sm text-muted-foreground">
                                    {PHONE_PREFIX}
                                </span>
                                <Input
                                    {...register("phone")}
                                    inputMode="numeric"
                                    className={cn("flex-1", errors.phone && "border-destructive focus-visible:ring-destructive")}
                                />
                            </div>
                        </Field>
                        <Field label="Email" error={errors.email?.message}>
                            <Input type="email" {...register("email")} className={cn(errors.email && "border-destructive focus-visible:ring-destructive")}/>
                        </Field>
                    </div>

                    <Field label="Salary (PLN)" error={errors.salary?.message}>
                        <Input
                            type="number"
                            step="0.01"
                            {...register("salary", {valueAsNumber: true})}
                            className={cn("max-w-[220px]", errors.salary && "border-destructive focus-visible:ring-destructive")}
                        />
                    </Field>

                    <Controller
                        name="roles"
                        control={control}
                        render={({field}) => {
                            const addRole = () => {
                                const value = roleDraft.trim();
                                if (!value || field.value.includes(value)) {
                                    setRoleDraft("");
                                    return;
                                }
                                field.onChange([...field.value, value]);
                                setRoleDraft("");
                            };
                            return (
                                <div className="flex flex-col gap-1.5">
                                    <Label>Roles</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            value={roleDraft}
                                            onChange={(e) => setRoleDraft(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    e.preventDefault();
                                                    addRole();
                                                }
                                            }}
                                            placeholder="Add a role"
                                        />
                                        <Button type="button" variant="secondary" onClick={addRole}>Add</Button>
                                    </div>
                                    {field.value.length > 0 && (
                                        <div className="flex flex-wrap gap-1 pt-1">
                                            {field.value.map((role) => (
                                                <Badge key={role} variant="secondary" className="gap-1">
                                                    {role}
                                                    <button
                                                        type="button"
                                                        aria-label={`Remove ${role}`}
                                                        onClick={() => field.onChange(field.value.filter((r) => r !== role))}
                                                    >
                                                        <X className="h-3 w-3"/>
                                                    </button>
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                    {errors.roles && (
                                        <p className="text-xs text-destructive lg:text-sm">{errors.roles.message}</p>
                                    )}
                                </div>
                            );
                        }}
                    />

                    <Separator/>

                    <Collapsible defaultOpen>
                        <CollapsibleTrigger type="button" className="flex w-full items-center justify-between text-sm font-semibold">
                            Address
                            <ChevronDown className="h-4 w-4"/>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="pt-3">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <Field label="Street" error={errors.address?.street?.message}>
                                    <Input {...register("address.street")}/>
                                </Field>
                                <Field label="Apartment" error={errors.address?.apartment?.message}>
                                    <Input {...register("address.apartment")}/>
                                </Field>
                                <Field label="Region" error={errors.address?.region?.message}>
                                    <Input {...register("address.region")}/>
                                </Field>
                                <Field label="Country" error={errors.address?.country?.message}>
                                    <Input {...register("address.country")}/>
                                </Field>
                                <Field label="Postal code" error={errors.address?.postalCode?.message}>
                                    <Input {...register("address.postalCode")}/>
                                </Field>
                            </div>
                        </CollapsibleContent>
                    </Collapsible>

                    <Separator/>

                    <Collapsible>
                        <CollapsibleTrigger type="button" className="flex w-full items-center justify-between text-sm font-semibold">
                            Working Schedule
                            <ChevronDown className="h-4 w-4"/>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="pt-3">
                            <p className="text-sm text-muted-foreground">Working schedule editing is coming soon.</p>
                        </CollapsibleContent>
                    </Collapsible>

                    <div className="flex justify-end pt-2">
                        <Button type="submit" disabled={isSubmitting || (employee !== null && !isDirty)}>
                            {isSubmitting ? "Saving..." : submitLabel}
                        </Button>
                    </div>

                    <FormErrorAlert message={error}/>
                </form>
            </CardContent>
        </Card>
    );
}

function Field({label, error, children}: { label: string; error?: string; children: ReactNode }) {
    return (
        <div className="flex flex-col gap-1.5">
            <Label>{label}</Label>
            {children}
            {error && <p className="text-xs text-destructive lg:text-sm">{error}</p>}
        </div>
    );
}
