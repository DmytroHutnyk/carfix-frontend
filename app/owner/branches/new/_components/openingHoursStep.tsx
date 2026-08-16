"use client"

import {Controller, useForm, useWatch} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Copy, Trash2} from "lucide-react";
import {Button} from "@/_components/shadcn/button";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/_components/shadcn/select";
import WizardCard from "@/owner/branches/new/_components/wizardCard";
import FieldError from "@/owner/branches/new/_components/fieldError";
import {
    DAY_STATUS,
    DAY_STATUS_LABEL,
    DayStatus,
    OpeningHoursForm,
    openingHoursSchema,
    TIME_OPTIONS,
    WEEKDAY_LABEL,
    WEEKDAYS,
    Weekday,
    WORKING_DAYS,
} from "@/features/branchRegistration/branchRegistrationTypes";
import {useBranchRegistrationDraft} from "@/features/branchRegistration/useBranchRegistrationDraft";
import {cn} from "@/lib/utils";

const FORM_ID = "opening-hours-form";
const STATUSES: DayStatus[] = [DAY_STATUS.OPEN, DAY_STATUS.BY_APPOINTMENT, DAY_STATUS.CLOSED];

function TimeSelect({value, onChange, placeholder, disabled, invalid}: {
    value: string; onChange: (v: string) => void; placeholder: string; disabled: boolean; invalid?: boolean;
}) {
    return (
        <Select value={value} onValueChange={onChange} disabled={disabled}>
            <SelectTrigger aria-invalid={invalid || undefined} className={cn("w-[130px]", invalid && "border-destructive")}>
                <SelectValue placeholder={placeholder}/>
            </SelectTrigger>
            <SelectContent>
                {TIME_OPTIONS.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
        </Select>
    );
}

export default function OpeningHoursStep() {
    const saved = useBranchRegistrationDraft((s) => s.openingHours);
    const setOpeningHours = useBranchRegistrationDraft((s) => s.setOpeningHours);
    const next = useBranchRegistrationDraft((s) => s.next);
    const back = useBranchRegistrationDraft((s) => s.back);

    const {control, handleSubmit, setValue, getValues, formState: {errors}} = useForm<OpeningHoursForm>({
        resolver: zodResolver(openingHoursSchema),
        mode: "onSubmit",
        defaultValues: saved,
    });
    const days = useWatch({control, name: "days"});

    const copyMondayToWeekdays = () => {
        const monday = getValues("days.MONDAY");
        WORKING_DAYS.filter((d) => d !== "MONDAY").forEach((d) => setValue(`days.${d}`, {...monday}, {shouldValidate: true}));
    };

    const clearAll = () =>
        WEEKDAYS.forEach((d) => setValue(`days.${d}`, {status: DAY_STATUS.CLOSED, opensAt: "", closesAt: ""}, {shouldValidate: true}));

    const onStatusChange = (day: Weekday, status: DayStatus) => {
        setValue(`days.${day}.status`, status, {shouldValidate: true});
        if (status === DAY_STATUS.CLOSED) {
            setValue(`days.${day}.opensAt`, "");
            setValue(`days.${day}.closesAt`, "");
        }
    };

    const onSubmit = (data: OpeningHoursForm) => {
        setOpeningHours(data);
        next();
    };

    return (
        <WizardCard
            title="Define opening hours for this service point"
            subtitle='(you don’t need hours if status is "Closed")'
            centeredTitle
            back={{label: "Back", onClick: back}}
            next={{label: "Continue", form: FORM_ID}}
        >
            <form id={FORM_ID} onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-3">
                {WEEKDAYS.map((day) => {
                    const closed = days?.[day]?.status === DAY_STATUS.CLOSED;
                    const dayErrors = errors.days?.[day];
                    return (
                        <div key={day} className="space-y-2 rounded-xl border border-border p-4">
                            <div className="grid grid-cols-[120px_130px_130px_1fr] items-center gap-3">
                                <span className="text-base font-medium">{WEEKDAY_LABEL[day]}</span>
                                <Controller
                                    control={control}
                                    name={`days.${day}.opensAt`}
                                    render={({field}) => (
                                        <TimeSelect value={field.value} onChange={field.onChange} placeholder="Opens at" disabled={closed}
                                                    invalid={Boolean(dayErrors?.closesAt)}/>
                                    )}
                                />
                                <Controller
                                    control={control}
                                    name={`days.${day}.closesAt`}
                                    render={({field}) => (
                                        <TimeSelect value={field.value} onChange={field.onChange} placeholder="Closes at" disabled={closed}
                                                    invalid={Boolean(dayErrors?.closesAt)}/>
                                    )}
                                />
                                <Controller
                                    control={control}
                                    name={`days.${day}.status`}
                                    render={({field}) => (
                                        <Select value={field.value} onValueChange={(v) => onStatusChange(day, v as DayStatus)}>
                                            <SelectTrigger><SelectValue/></SelectTrigger>
                                            <SelectContent>
                                                {STATUSES.map((s) => <SelectItem key={s} value={s}>{DAY_STATUS_LABEL[s]}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </div>
                            <FieldError message={dayErrors?.closesAt?.message}/>
                        </div>
                    );
                })}

                <div className="flex gap-3 pt-1">
                    <Button type="button" variant="default" onClick={copyMondayToWeekdays}>
                        <Copy/> Copy Mon to weekdays
                    </Button>
                    <Button type="button" variant="destructive" onClick={clearAll}>
                        <Trash2/> Clear all
                    </Button>
                </div>
            </form>
        </WizardCard>
    );
}
