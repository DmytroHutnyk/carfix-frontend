'use client'

import {useMemo, useState} from "react";
import {useRouter} from "next/navigation";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {OrbitProgress} from "react-loading-indicators";

import {useAuth} from "@/features/auth/useAuth";
import {useUpdateCore} from "@/features/user/useUpdateCore";
import {UpdateUserCore, updateUserCoreSchema} from "@/features/user/profileManagementTypes";
import {toDisplayError} from "@/lib/errorHandler";
import {today, yearsFromToday} from "@/lib/dateBounds";
import {ApiError} from "@/lib/apiTypes";

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/_components/shadcn/card";
import {Input} from "@/_components/shadcn/input";
import {Button} from "@/_components/shadcn/button";
import FormErrorAlert from "@/_components/formErrorAlert";
import DatePicker from "@/_components/datePicker";
import RegionCard from "@/(main)/(withFooter)/(myAccount)/profile/_components/regionCard";
import ContactSecurityCard from "@/(main)/(withFooter)/(myAccount)/profile/_components/contactSecurityCard";
import AddressCard from "@/(main)/(withFooter)/(myAccount)/profile/_components/addressCard";
import PreferredLocationField from "@/(main)/(withFooter)/(myAccount)/profile/_components/preferredLocationField";

const OLDEST_BIRTH_YEARS_BACK = -120;

export default function Page() {
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const { updateCore } = useUpdateCore();
    const { account, logout } = useAuth();
    const user = account?.user ?? null;

    const birthBounds = useMemo(() => ({
        min: yearsFromToday(OLDEST_BIRTH_YEARS_BACK),
        max: today(),
    }), []);

    const {
        register,
        handleSubmit,
        control,
        formState: {errors, isSubmitting, isDirty},
        reset
    } = useForm<UpdateUserCore>({
        resolver: zodResolver(updateUserCoreSchema),
        mode: "onSubmit",
        values: {
            name: user?.name ?? "",
            surname: user?.surname ?? "",
            dateOfBirth: user?.dateOfBirth ?? "",
            preferredLocation: user?.preferredLocation ?? null,
        },
    })

    const onSubmit = async (updateData: UpdateUserCore) => {
        setError(null);

        try {
            await updateCore(updateData)
        } catch (err) {
            reset();
            setError(toDisplayError(err as ApiError).message);
        }
    }

    return(
        <div className="py-3">
            {/*-==-==-=-=-=-=--==-=-=-=-header-==-==-=-=-=-=-=-=-=---==*/}
            <section className="space-y-3">
                <h1 className="text-3xl font-bold tracking-tight">
                    Profile
                </h1>
            </section>


            {/*-==-==-=-=-=-=--==-=-=-=-Cards-==-==-=-=-=-=-=-=-=---==*/}
            <section className="flex flex-col gap-y-2 pt-5">
                <Card className="relative">
                    {isSubmitting && (
                        <div className="absolute inset-0 z-20 flex items-center justify-center rounded-xl bg-card/75 ">
                            <OrbitProgress
                                color="var(--primary)"
                                size="large"
                                text=""
                                textColor=""
                                dense
                            />
                        </div>
                    )}
                    <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                        <CardDescription>Your personal details and preferences</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="flex space-y-1 space-x-4">
                                    <Input
                                        {...register("name")}
                                        id="name"
                                        type="text"
                                        placeholder="Name"
                                        className={errors.name ? "border-destructive focus-visible:ring-destructive" : ""}
                                    />
                                    {errors.name && (
                                        <p id="name-error" className="text-sm text-destructive">
                                            {errors.name.message}
                                        </p>
                                    )}

                                    <Input
                                        {...register("surname")}
                                        id="surname"
                                        type="text"
                                        placeholder="Surname"
                                        className={errors.surname ? "border-destructive focus-visible:ring-destructive" : ""}
                                    />
                                    {errors.surname && (
                                        <p id="surname-error" className="text-sm text-destructive">
                                            {errors.surname.message}
                                        </p>
                                    )}
                            </div>

                            <div className="flex flex-row justify-start space-y-1">
                                <Controller
                                    name="dateOfBirth"
                                    control={control}
                                    render={({field}) => (
                                        <DatePicker
                                            id="dateOfBirth"
                                            label="Date of birth"
                                            value={field.value}
                                            onChange={field.onChange}
                                            error={!!errors.dateOfBirth}
                                            minDate={birthBounds.min}
                                            maxDate={birthBounds.max}
                                        />
                                    )}
                                />
                                {errors.dateOfBirth && (
                                    <p id="surname-error" className="text-sm text-destructive">
                                        {errors.dateOfBirth.message}
                                    </p>
                                )}
                            </div>

                        <Controller
                            name="preferredLocation"
                            control={control}
                            render={({field}) => (
                                <PreferredLocationField
                                    value={field.value ?? null}
                                    onChange={field.onChange}
                                    error={errors.preferredLocation?.message
                                        ?? errors.preferredLocation?.city?.message
                                        ?? errors.preferredLocation?.region?.message}
                                />
                            )}
                        />

                        <div className="flex w-full justify-end gap-2 pt-2">
                            <Button
                                type="button"
                                variant="white"
                                className="w-35"
                                onClick={() => reset()}
                                disabled={!isDirty || isSubmitting}
                            >
                                Reset
                            </Button>
                            <Button type="submit" className="w-35" disabled={!isDirty || isSubmitting}>
                                {isSubmitting ? "Saving..." : "Save Changes"}
                            </Button>
                        </div>
                    </form>

                    <FormErrorAlert message={error} className="mt-4" />
                    </CardContent>
                </Card>

                <RegionCard/>
                <ContactSecurityCard user={user}/>
                <AddressCard address={user?.address ?? null}/>
            </section>

            <div className="flex justify-end pt-2">
                <Button
                    variant="destructive"
                    onClick={() => logout().then(() => router.replace("/login"))}
                >
                    Log out
                </Button>
            </div>
        </div>


    )
}
