"use client"

import {Card, CardContent, CardHeader, CardTitle} from "@/components/shadcn/card";
import {Button} from "@/components/shadcn/button";
import {AlertCircle, Check, ChevronsUpDown, Eye, EyeOff, X} from "lucide-react";
import {useRouter} from "next/navigation";
import {Input} from "@/components/shadcn/input";
import {useState} from "react";
import CountryCodeInput from "@/register/countryCodeInput";
import {Alert, AlertDescription} from "@/components/shadcn/alert";
import {OrbitProgress} from "react-loading-indicators";


export default function Register(){
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const router = useRouter()

    async function handleLogin (e: React.FormEvent<HTMLFormElement>){
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

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
                const errorMessage = result.detail || result.title || "Register failed. Please try again";
                throw new Error(errorMessage);
            }

            router.push("/login");

        }catch(err){
            if(err instanceof TypeError){
                setError("Network error. Please try again");
            }if(err instanceof Error){
                setError(err.message);
            }else{
                setError("Something went wrong. Please try again");
            }
        }finally {
            setIsLoading(false);
        }

    }

    const [value, setValue] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);

    return (
        <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-background px-6 py-12">
            <Card className="relative w-full max-w-md ">
                {isLoading && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center">
                        <OrbitProgress
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
                    <form onSubmit={handleLogin} className="space-y-4">
                        <Input
                            id="name"
                            type="text"
                            name="name"
                            placeholder="Name"
                            required
                        />

                        <Input
                            id="surname"
                            type="text"
                            name="surname"
                            placeholder="Surname"
                            required
                        />

                        {/*Hidden input for countryCode*/}
                        <Input
                            id="phoneCountryCode"
                            type="hidden"
                            name="phoneCountryCode"
                            value={value}
                            required
                        />

                        {/* Section for country code and phone number*/}
                        <section className="flex space-x-2">
                            <div className="flex w-[90px]">
                               <CountryCodeInput value={value} setValue={setValue}/>
                            </div>
                            <Input
                                id="phoneNumber"
                                type="tel"
                                name="phoneNumber"
                                pattern="[0-9]*"
                                placeholder="Phone number"
                                required
                            />
                        </section>


                        <Input
                            id="email"
                            type="email"
                            name="email"
                            placeholder="Email"
                            required
                        />

                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Password"
                                required
                                className="pr-10"
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
                        </div>

                        {error && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{error}</AlertDescription>
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