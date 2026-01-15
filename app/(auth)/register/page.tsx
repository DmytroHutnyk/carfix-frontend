"use client"

import {Card, CardContent, CardHeader, CardTitle} from "@/_components/shadcn/card";
import {Button} from "@/_components/shadcn/button";
import {AlertCircle, Eye, EyeOff, X} from "lucide-react";
import {useRouter} from "next/navigation";
import {Input} from "@/_components/shadcn/input";
import {useState} from "react";
import CountryCodeInput from "@/(auth)/register/_components/countryCodeInput";
import {Alert, AlertDescription} from "@/_components/shadcn/alert";
import {OrbitProgress} from "react-loading-indicators";
import {SubmitHandler, useForm} from "react-hook-form";
import { z } from "zod";
import {zodResolver} from "@hookform/resolvers/zod";

const registerSchema = z.object({
    name: z.string()
        .trim()
        .min(1, "Name is required")
        .max(50, "Name cannot exceed 50 characters"),

    surname: z.string()
        .trim()
        .min(1, "Surname is required")
        .max(50, "Surname cannot exceed 50 characters"),

    phoneCountryCode: z.string()
        .min(1, "Country code is required"),

    phoneNumber: z.string()
        .transform((val) => val.replace(/\s+/g, ""))
        .pipe(
            z.string()
                .min(1, "Phone number is required")
                .max(15, "Phone number cannot exceed 15 digits")
                .regex(/^[0-9]{5,15}$/, "Phone number must contain from 5 to 15 digits")
        ),

    email: z.string()
        .trim()
        .min(1, "Email is required")
        .email("Invalid email address")
        .max(30, "Email cannot exceed 30 characters"),

    password: z.string()
        .min(8, "Password must be at least 8 characters")
        .max(20, "Password must be at most 20 characters")
        .regex(/[A-Z]/, "Must contain at least one uppercase letter")
        .regex(/[a-z]/, "Must contain at least one lowercase letter")
        .regex(/[0-9]/, "Must contain at least one digit")
        .regex(/[^a-zA-Z0-9]/, "Must contain at least one special character"),
});

type RegisterFormData = z.infer<typeof registerSchema>;


export default function Register(){
    const [value, setValue] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

     const {
         register,
         handleSubmit,
         formState: { errors, isSubmitting },
         setValue: setFormValue,
    } = useForm<RegisterFormData>({
         resolver: zodResolver(registerSchema),
         mode: "onSubmit"
     });

    const onSubmit = async (data: RegisterFormData) => {
        setError(null);

        try{
            const response = await fetch("http://localhost:8080/api/customer/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
                credentials: "include",
            })

            if(!response.ok){
                const result = await response.json();
                let errorMessage = result.detail || result.title || "Register failed. Please try again";

                if (result?.errors) {
                    errorMessage = Object.values(result.errors).join("\n");
                }

                throw new Error(errorMessage);
            }

            router.replace("/login");

        }catch(err) {
            if (err instanceof TypeError) {
                setError("Network error. Please try again");
            }
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Something went wrong. Please try again");
            }
        }
    }

    return (
        <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-background px-6 py-12">
            <Card className="relative w-full max-w-md ">
                {isSubmitting && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center">
                        <OrbitProgress //TODO color is green for some reason, must be yellow?
                            color="hsl(var(--primary))"
                            size="large"
                            text=""
                            textColor=""
                        />
                    </div>
                )}
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-3 top-3"
                    onClick={() => {
                        router.back();
                    }}>
                    <X className="h-5 w-5 z-10" />
                </Button>
                <CardHeader>
                    <CardTitle className="text-center text-2xl">Register</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                        <div className="space-y-1">
                            <Input
                                {...register("name")}
                                id="name"
                                type="text"
                                name="name"
                                placeholder="Name"
                                className={errors.name ? "border-destructive focus-visible:ring-destructive" : ""}
                            />
                            {errors.name && (
                                <p id="name-error" className="text-sm text-destructive">
                                    {errors.name.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-1">
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

                        {/* Section for country code and phone number*/}
                        <div className="space-y-1">
                            {/*Hidden input for countryCode*/}
                            <Input
                                {...register("phoneCountryCode")}
                                id="phoneCountryCode"
                                type="hidden"
                                name="phoneCountryCode"
                                value={value}
                            />

                            <section className="flex space-x-2">
                                <div className="flex w-[90px]">
                                    <CountryCodeInput 
                                        value={value} 
                                        setValue={(newValue) => {
                                            setValue(newValue);
                                            setFormValue("phoneCountryCode", newValue);
                                        }}
                                    />
                                </div>
                                <div className="flex-1">
                                    <Input
                                        {...register("phoneNumber")}
                                        id="phoneNumber"
                                        type="tel"
                                        name="phoneNumber"
                                        placeholder="Phone number"
                                        className={errors.phoneNumber ? "border-destructive focus-visible:ring-destructive" : ""}
                                    />
                                </div>
                            </section>
                            {errors.phoneCountryCode && (
                                <p id="phoneCountryCode-error" className="text-sm text-destructive">
                                    {errors.phoneCountryCode.message}
                                </p>
                            )}
                            {errors.phoneNumber && (
                                <p id="phoneNumber-error" className="text-sm text-destructive">
                                    {errors.phoneNumber.message}
                                </p>
                            )}
                        </div>


                        <div className="space-y-1">
                            <Input
                                {...register("email")}
                                id="email"
                                type="email"
                                placeholder="Email"
                                className={errors.email ? "border-destructive focus-visible:ring-destructive" : ""}
                            />
                            {errors.email && (
                                <p id="email-error" className="text-sm text-destructive">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-1">
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
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                                    ) : (
                                        <Eye className="h-4 w-4 text-muted-foreground" />
                                    )}
                                </Button>
                            </div>
                            {errors.password && (
                                <p id="password-error" className="text-sm text-destructive">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        {error && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription className="whitespace-pre-line">{error}</AlertDescription>
                            </Alert>
                        )}

                        <Button
                            type="submit"
                            variant="default"
                            className="w-full">
                            Register
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}