'use client'

import {useState} from "react";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {ChevronDown} from "lucide-react";

import {
    OwnerServiceBay,
    OwnerServiceBayType,
    ServiceBayForm,
    serviceBayFormSchema,
    toServiceBayForm,
} from "@/features/ownerServiceBay/ownerServiceBayTypes";
import {toDisplayError} from "@/lib/errorHandler";
import {ApiError} from "@/lib/apiTypes";
import {cn} from "@/lib/utils";

import {Card, CardContent} from "@/_components/shadcn/card";
import {Input} from "@/_components/shadcn/input";
import {Textarea} from "@/_components/shadcn/textarea";
import {Button} from "@/_components/shadcn/button";
import {Label} from "@/_components/shadcn/label";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/_components/shadcn/collapsible";
import {Separator} from "@/_components/shadcn/separator";
import FormErrorAlert from "@/_components/formErrorAlert";
import CreatableSelect from "@/_components/creatableSelect";

export default function ServiceBayEditor({bay, types, isNew, submitLabel, onSubmit}: {
    bay: OwnerServiceBay | null;
    types: OwnerServiceBayType[];
    isNew: boolean;
    submitLabel: string;
    onSubmit: (form: ServiceBayForm) => Promise<void>;
}) {
    const [error, setError] = useState<string | null>(null);

    const {register, control, handleSubmit, formState: {errors, isSubmitting, isDirty}} = useForm<ServiceBayForm>({
        resolver: zodResolver(serviceBayFormSchema),
        mode: "onSubmit",
        values: toServiceBayForm(bay),
    });

    const submit = async (form: ServiceBayForm) => {
        setError(null);
        try {
            await onSubmit(form);
        } catch (err) {
            setError(toDisplayError(err as ApiError).message);
        }
    };

    return (
        <Card className={cn(isNew && "border-success-badge-foreground ring-2 ring-success-badge-foreground/40")}>
            <CardContent className="p-4 lg:p-6">
                <form onSubmit={handleSubmit(submit)} noValidate className="flex flex-col gap-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="flex flex-col gap-1.5">
                            <Label>Name</Label>
                            <Input {...register("name")} className={cn(errors.name && "border-destructive focus-visible:ring-destructive")}/>
                            {errors.name && <p className="text-xs text-destructive lg:text-sm">{errors.name.message}</p>}
                        </div>
                        <Controller
                            name="serviceBayType"
                            control={control}
                            render={({field}) => (
                                <div className="flex flex-col gap-1.5">
                                    <Label>Type</Label>
                                    <CreatableSelect
                                        value={field.value}
                                        options={types.map((type) => type.name)}
                                        onChange={field.onChange}
                                        onCreate={() => {}}
                                        placeholder="Select or add a type"
                                        maxNameLength={40}
                                        ariaLabel="Type"
                                        createLabel="Add type"
                                        invalid={!!errors.serviceBayType}
                                    />
                                    {errors.serviceBayType && (
                                        <p className="text-xs text-destructive lg:text-sm">{errors.serviceBayType.message}</p>
                                    )}
                                </div>
                            )}
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Label>Notes</Label>
                        <Textarea
                            {...register("notes")}
                            rows={4}
                            placeholder="Anything worth remembering about this bay"
                            className={cn("resize-none", errors.notes && "border-destructive focus-visible:ring-destructive")}
                        />
                        {errors.notes && <p className="text-xs text-destructive lg:text-sm">{errors.notes.message}</p>}
                    </div>

                    <Separator/>

                    <Collapsible>
                        <CollapsibleTrigger type="button" className="flex w-full items-center justify-between text-sm font-semibold">
                            Availability Schedule
                            <ChevronDown className="h-4 w-4"/>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="pt-3">
                            <p className="text-sm text-muted-foreground">Availability schedule editing is coming soon.</p>
                        </CollapsibleContent>
                    </Collapsible>

                    <div className="flex justify-end pt-2">
                        <Button type="submit" disabled={isSubmitting || (bay !== null && !isDirty)}>
                            {isSubmitting ? "Saving..." : submitLabel}
                        </Button>
                    </div>

                    <FormErrorAlert message={error}/>
                </form>
            </CardContent>
        </Card>
    );
}
