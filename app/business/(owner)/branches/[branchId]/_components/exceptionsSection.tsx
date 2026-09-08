'use client'

import {Controller, UseFormReturn, useFieldArray, useWatch} from "react-hook-form";
import {Plus, Trash2} from "lucide-react";

import {BranchOverviewForm, EMPTY_EXCEPTION} from "@/features/ownerBranch/branchOverviewForm";

import {Button} from "@/_components/shadcn/button";
import {Input} from "@/_components/shadcn/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/_components/shadcn/select";
import FieldError from "@/business/(owner)/branches/new/_components/fieldError";
import TimeSelect from "@/business/(owner)/branches/[branchId]/_components/timeSelect";

const OPEN_VALUE = "OPEN";
const CLOSED_VALUE = "CLOSED";

export default function ExceptionsSection({form}: { form: UseFormReturn<BranchOverviewForm> }) {
    const {control, register, setValue, trigger, formState: {errors}} = form;
    const {fields, append, remove} = useFieldArray({control, name: "exceptions"});
    const exceptions = useWatch({control, name: "exceptions"});

    const revalidate = (index: number) => {
        trigger(`exceptions.${index}`);
    };

    const onStatusChange = (index: number, open: boolean) => {
        setValue(`exceptions.${index}.isOpen`, open, {shouldDirty: true});
        if (!open) {
            setValue(`exceptions.${index}.opensAt`, "", {shouldDirty: true});
            setValue(`exceptions.${index}.closesAt`, "", {shouldDirty: true});
        }
        revalidate(index);
    };

    return (
        <section className="space-y-3">
            <h3 className="text-base font-semibold">Exceptions</h3>

            {fields.length === 0 && (
                <p className="text-sm text-muted-foreground">
                    No exceptions yet — add one for a holiday or a one-off change.
                </p>
            )}

            {fields.map((field, index) => {
                const open = exceptions?.[index]?.isOpen === true;
                const rowErrors = errors.exceptions?.[index];
                return (
                    <div key={field.id} className="space-y-2 rounded-xl border border-border p-4">
                        <div className="flex flex-wrap items-center gap-3">
                            <Input
                                type="date"
                                aria-label="Exception date"
                                className="w-[170px]"
                                {...register(`exceptions.${index}.date`)}
                            />
                            <Controller
                                control={control}
                                name={`exceptions.${index}.isOpen`}
                                render={({field: statusField}) => (
                                    <Select
                                        value={statusField.value ? OPEN_VALUE : CLOSED_VALUE}
                                        onValueChange={(v) => onStatusChange(index, v === OPEN_VALUE)}
                                    >
                                        <SelectTrigger aria-label="Exception status" className="w-[140px]"><SelectValue/></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value={OPEN_VALUE}>Open</SelectItem>
                                            <SelectItem value={CLOSED_VALUE}>Closed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            <Controller
                                control={control}
                                name={`exceptions.${index}.opensAt`}
                                render={({field: timeField}) => (
                                    <TimeSelect value={timeField.value}
                                                onChange={(v) => { timeField.onChange(v); revalidate(index); }}
                                                placeholder="Opens at" ariaLabel="Exception opens at"
                                                disabled={!open} invalid={Boolean(rowErrors?.closesAt)}/>
                                )}
                            />
                            <Controller
                                control={control}
                                name={`exceptions.${index}.closesAt`}
                                render={({field: timeField}) => (
                                    <TimeSelect value={timeField.value}
                                                onChange={(v) => { timeField.onChange(v); revalidate(index); }}
                                                placeholder="Closes at" ariaLabel="Exception closes at"
                                                disabled={!open} invalid={Boolean(rowErrors?.closesAt)}/>
                                )}
                            />
                            <Input
                                aria-label="Exception reason"
                                placeholder="Reason (e.g. Christmas Day)"
                                className="min-w-[200px] flex-1"
                                {...register(`exceptions.${index}.reason`)}
                            />
                            <Button type="button" variant="ghost" size="icon" aria-label="Remove exception"
                                    onClick={() => remove(index)}>
                                <Trash2/>
                            </Button>
                        </div>
                        <FieldError message={rowErrors?.date?.message ?? rowErrors?.closesAt?.message ?? rowErrors?.reason?.message}/>
                    </div>
                );
            })}

            <Button type="button" variant="outline" onClick={() => append({...EMPTY_EXCEPTION})}>
                <Plus/> Add exception
            </Button>
        </section>
    );
}
