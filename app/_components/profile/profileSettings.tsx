'use client'

import {useMemo, useState} from "react";
import {useRouter} from "next/navigation";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {OrbitProgress} from "react-loading-indicators";

import {useAuth} from "@/features/auth/useAuth";
import {isOwner} from "@/features/user/userTypes";
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
import RegionCard from "@/_components/profile/regionCard";
import ContactSecurityCard from "@/_components/profile/contactSecurityCard";
import AddressCard from "@/_components/profile/addressCard";
import PreferredLocationField from "@/_components/profile/preferredLocationField";

const OLDEST_BIRTH_YEARS_BACK = -120;

export default function ProfileSettings() {
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
                <h1 className="text-lg font-semibold tracking-tight lg:text-3xl lg:font-bold">
                    Profile
                </h1>
            </section>


            {/*-==-==-=-=-=-=--==-=-=-=-Cards-==-==-=-=-=-=-=-=-=---==*/}
            <section className="flex flex-col gap-3 pt-4 lg:gap-y-2 lg:pt-5">
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
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 lg:space-y-4">
                            <div className="flex flex-col space-y-3 lg:flex-row lg:space-y-1 lg:space-x-4">
                                    <Input
                                        {...register("name")}
                                        id="name"
                                        type="text"
                                        placeholder="Name"
                                        className={errors.name ? "border-destructive focus-visible:ring-destructive" : ""}
                                    />
                                    {errors.name && (
                                        <p id="name-error" className="text-xs text-destructive lg:text-sm">
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
                                        <p id="surname-error" className="text-xs text-destructive lg:text-sm">
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
                                    <p id="surname-error" className="text-xs text-destructive lg:text-sm">
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
                                size="sm"
                                className="lg:h-9 lg:w-35 lg:px-4 lg:py-2 lg:text-sm"
                                onClick={() => reset()}
                                disabled={!isDirty || isSubmitting}
                            >
                                Reset
                            </Button>
                            <Button type="submit" size="sm" className="lg:h-9 lg:w-35 lg:px-4 lg:py-2 lg:text-sm" disabled={!isDirty || isSubmitting}>
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
                    size="sm"
                    className="lg:h-9 lg:px-4 lg:py-2 lg:text-sm"
                    onClick={() => logout().then(() => router.replace(account && isOwner(account) ? "/business/login" : "/login"))}
                >
                    Log out
                </Button>
            </div>
        </div>


    )
}
