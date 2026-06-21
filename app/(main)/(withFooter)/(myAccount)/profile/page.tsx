'use client'

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/_components/shadcn/card";
import {useForm, Controller} from "react-hook-form";
import {UpdateProfile, updateProfileSchema} from "@/util/types/profileTypes";
import {zodResolver} from "@hookform/resolvers/zod";
import {OrbitProgress} from "react-loading-indicators";
import {useState} from "react";
import {useRouter} from "next/navigation";
import {handleError} from "@/util/func/errorHandler";
import {ApiError} from "@/util/types/apiTypes";
import {useProfile} from "@/util/auth/hooks/useProfile";
import {useAuth} from "@/util/auth/hooks/useAuth";
import {Input} from "@/_components/shadcn/input";
import {DatePicker} from "@/(main)/(withFooter)/(myAccount)/profile/_components/DatePicker";
import {Button} from "@/_components/shadcn/button";
import {Alert, AlertDescription} from "@/_components/shadcn/alert";
import {AlertCircle} from "lucide-react";

export default function Page(){
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const profile = useProfile();
    const { user, logout } = useAuth();

    const {
        register,
        handleSubmit,
        control,
        formState: {errors, isSubmitting, isDirty},
        reset
    } = useForm<UpdateProfile>({
        resolver: zodResolver(updateProfileSchema),
        mode: "onSubmit",
        values: {
            name: user?.name ?? "",
            surname: user?.surname ?? "",
            dateOfBirth: user?.dateOfBirth ?? ""
        },
    })

    const onSubmit = async (updateData: UpdateProfile) => {
        setError(null);

        const userId: string = user?.id ?? "1"; /*TODO call login redirect!!!!!!!!!*/

        try {
            await profile.updateProfile({id: userId, data: updateData})
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

                            <div className="flex flex-row justify-end space-x-2 w-full">
                                <Button className="w-35" variant="default" onClick={() => reset()} disabled={!isDirty || isSubmitting}>
                                    Reset
                                </Button>

                                <Button className="w-35" type="submit" variant="default" disabled={!isDirty || isSubmitting}>
                                    {isSubmitting ? "Saving..." : "Save Changes"}
                                </Button>
                            </div>

                        </form>

                        {error && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription className="whitespace-pre-line">{error}</AlertDescription>
                            </Alert>
                        )}
                    </CardContent>
                </Card>
            </section>

            <div className="flex justify-end pt-2">
                <Button variant="destructive" onClick={() => logout().then(() => router.replace('/login'))}>
                    Log out
                </Button>
            </div>
        </div>


    )
}
