'use client'

import {Controller, UseFormReturn, useWatch} from "react-hook-form";
import {Copy} from "lucide-react";

import {BranchOverviewForm} from "@/features/ownerBranch/branchOverviewForm";
import {
    DAY_STATUS,
    DAY_STATUS_LABEL,
    DayStatus,
    WEEKDAY_LABEL,
    WEEKDAYS,
    Weekday,
    WORKING_DAYS,
} from "@/features/branchRegistration/branchRegistrationTypes";

import {Button} from "@/_components/shadcn/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/_components/shadcn/card";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/_components/shadcn/select";
import FieldError from "@/business/(owner)/branches/new/_components/fieldError";
import TimeSelect from "@/business/(owner)/branches/[branchId]/_components/timeSelect";
import ExceptionsSection from "@/business/(owner)/branches/[branchId]/_components/exceptionsSection";

const STATUSES: DayStatus[] = [DAY_STATUS.OPEN, DAY_STATUS.BY_APPOINTMENT, DAY_STATUS.CLOSED];

export default function OpeningHoursCard({form}: { form: UseFormReturn<BranchOverviewForm> }) {
    const {control, setValue, getValues, trigger, formState: {errors}} = form;
    const days = useWatch({control, name: "days"});

    const revalidateDay = (day: Weekday) => {
        trigger(`days.${day}`);
    };

    const copyMondayToWeekdays = () => {
        const monday = getValues("days.MONDAY");
        WORKING_DAYS.filter((d) => d !== "MONDAY")
            .forEach((d) => setValue(`days.${d}`, {...monday}, {shouldDirty: true, shouldValidate: true}));
    };

    const onStatusChange = (day: Weekday, status: DayStatus) => {
        setValue(`days.${day}.status`, status, {shouldDirty: true, shouldValidate: true});
        if (status === DAY_STATUS.CLOSED) {
            setValue(`days.${day}.opensAt`, "", {shouldDirty: true});
            setValue(`days.${day}.closesAt`, "", {shouldDirty: true});
        }
        revalidateDay(day);
    };

    return (
        <Card>
            <CardHeader><CardTitle>Opening Hours</CardTitle></CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-3">
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
                                            <TimeSelect value={field.value}
                                                        onChange={(v) => { field.onChange(v); revalidateDay(day); }}
                                                        placeholder="Opens at" ariaLabel={`${WEEKDAY_LABEL[day]} opens at`}
                                                        disabled={closed} invalid={Boolean(dayErrors?.closesAt)}/>
                                        )}
                                    />
                                    <Controller
                                        control={control}
                                        name={`days.${day}.closesAt`}
                                        render={({field}) => (
                                            <TimeSelect value={field.value}
                                                        onChange={(v) => { field.onChange(v); revalidateDay(day); }}
                                                        placeholder="Closes at" ariaLabel={`${WEEKDAY_LABEL[day]} closes at`}
                                                        disabled={closed} invalid={Boolean(dayErrors?.closesAt)}/>
                                        )}
                                    />
                                    <Controller
                                        control={control}
                                        name={`days.${day}.status`}
                                        render={({field}) => (
                                            <Select value={field.value} onValueChange={(v) => onStatusChange(day, v as DayStatus)}>
                                                <SelectTrigger aria-label={`${WEEKDAY_LABEL[day]} status`}><SelectValue/></SelectTrigger>
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
                </div>

                <Button type="button" onClick={copyMondayToWeekdays}>
                    <Copy/> Copy Mon to weekdays
                </Button>

                <ExceptionsSection form={form}/>
            </CardContent>
        </Card>
    );
}
