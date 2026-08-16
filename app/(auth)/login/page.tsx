'use client'

import {Button} from "@/_components/shadcn/button";
import {Input} from "@/_components/shadcn/input";
import {Eye, EyeOff, X} from 'lucide-react'
import {useState} from "react";
import Image from "next/image";
import Link from "next/link";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/_components/shadcn/card";
import {useRouter} from "next/navigation";
import {OrbitProgress} from "react-loading-indicators";
import FormErrorAlert from "@/_components/formErrorAlert";
import {useAuth} from "@/features/auth/useAuth";
import {isOwner} from "@/features/user/userTypes";
import {useForm} from "react-hook-form";
import {LoginCredentials, loginSchema} from "@/features/auth/authTypes";
import {ApiError} from "@/lib/apiTypes";
import {zodResolver} from "@hookform/resolvers/zod";
import {toDisplayError} from "@/lib/errorHandler";

export default function Login(){
    const [error, setError] = useState<string | null>(null)
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const { login } = useAuth();
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: {isSubmitting, errors}
    } = useForm<LoginCredentials>({
        resolver: zodResolver(loginSchema),
        mode: "onSubmit"
    })

    const onSubmit = async (data: LoginCredentials) => {
        setError(null)
        try{
            const response = await login(data);
            console.log(response)
            if (isOwner(response)) {
                router.replace("/business/service-points");
            } else {
                router.back();
            }
        }catch (err){
            setError(toDisplayError(err as ApiError).message);
        }

    }


    return (
            <Card className={`relative w-full max-w-md transition-opacity ${isSubmitting ? 'opacity-60' : 'opacity-100'}`}>
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
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-3 top-3 z-10"
                    onClick={() => {
                        router.back();
                    }}
                >
                    <X className="h-5 w-5" />
                </Button>

                <CardHeader>
                    <CardTitle className="text-center text-2xl">Log In</CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <Input
                                {...register("email")}
                                id="email"
                                type="text"
                                placeholder="Email"
                                className={errors.email ? "border-destructive focus-visible:ring-destructive" : ""}
                            />
                            {errors.email && (
                                <p id="name-error" className="text-sm text-destructive">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        <div className="relative">
                            <Input
                                {...register("password")}
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                className={`pr-10 ${errors.password ? "border-destructive focus-visible:ring-destructive" : ""}`}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-0 h-9 w-9"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                    <Eye className="h-4 w-4 text-muted-foreground" />
                                )}
                            </Button>
                            {errors.password && (
                                <p id="password-error" className="text-sm text-destructive">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        <FormErrorAlert message={error} />

                        <Button
                            type="submit"
                            variant="default"
                            className="w-full"
                        >
                            Log In
                        </Button>
                    </form>

                    <div className="flex items-center">
                        <div className="h-px flex-1 bg-border"></div>
                        <span className="px-4 text-xs text-muted-foreground">or</span>
                        <div className="h-px flex-1 bg-border"></div>
                    </div>

                    <Button
                        variant="white"
                        className="w-full"
                    >
                        Continue with Google
                        <Image
                            src="/google-logo.svg"
                            alt="google logo"
                            width={20}
                            height={20}
                        />
                    </Button>
                </CardContent>

                <CardFooter className="flex-col">
                    <p className="text-center text-sm text-muted-foreground">
                        Don't have an account?{" "}
                        <Button variant="link" asChild className="p-0 h-auto">
                            <Link href="/register" replace>Register</Link>
                        </Button>
                    </p>
                </CardFooter>
            </Card>
    )
}