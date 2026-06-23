'use client'

import {useState} from "react";
import {useRouter} from "next/navigation";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {AlertCircle} from "lucide-react";
import {OrbitProgress} from "react-loading-indicators";

import {useAuth} from "@/util/hooks/useAuth";
import {useUpdateCore} from "@/util/hooks/useUpdateCore";
import {UpdateUserCore, updateUserCoreSchema} from "@/util/types/profileManagementTypes";
import {handleError} from "@/util/func/errorHandler";
import {ApiError} from "@/util/types/apiTypes";
import {cn} from "@/util/lib/utils";

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/_components/shadcn/card";
import {Field, FieldDescription, FieldError, FieldLabel} from "@/_components/shadcn/field";
import {Input} from "@/_components/shadcn/input";
import {Button} from "@/_components/shadcn/button";
import {Alert, AlertDescription} from "@/_components/shadcn/alert";
import {DatePicker} from "@/(main)/(withFooter)/(myAccount)/profile/_components/DatePicker";
import ContactSecurityCard from "@/(main)/(withFooter)/(myAccount)/profile/_components/contactSecurityCard";
import AddressCard from "@/(main)/(withFooter)/(myAccount)/profile/_components/addressCard";

export default function Page() {
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const { updateCore } = useUpdateCore();
    const { account, logout } = useAuth();
    const user = account?.user ?? null;

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
            dateOfBirth: user?.dateOfBirth ?? ""
        },
    })

    const onSubmit = async (updateData: UpdateUserCore) => {
        setError(null);

        try {
            await updateCore(updateData)
        } catch (err) {
            reset();
            handleError(err as ApiError, setError);
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
                                            value={field.value}
                                            onChange={field.onChange}
                                            error={!!errors.dateOfBirth}
                                        />
                                    )}
                                />
                                {errors.dateOfBirth && (
                                    <p id="surname-error" className="text-sm text-destructive">
                                        {errors.dateOfBirth.message}
                                    </p>
                                )}
                            </div>

                        {/* Preferred location */}
                        <Field>
                            <FieldLabel htmlFor="location">Location</FieldLabel>
                            <Input id="location" type="text" placeholder="Coming soon" disabled/>
                            <FieldDescription>Your preferred location will be available soon.</FieldDescription>
                        </Field>

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

                    {error && (
                        <Alert variant="destructive" className="mt-4">
                            <AlertCircle className="h-4 w-4"/>
                            <AlertDescription className="whitespace-pre-line">{error}</AlertDescription>
                        </Alert>
                    )}
                    </CardContent>
                </Card>

                <ContactSecurityCard user={user}/>
                <AddressCard/>
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
