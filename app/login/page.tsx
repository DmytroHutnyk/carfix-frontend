"use client"
import {Button} from "@/components/shadcn/button";
import {Input} from "@/components/shadcn/input";
import {AlertCircle, Eye, EyeOff, X} from 'lucide-react'
import {useState} from "react";
import Image from "next/image";
import Link from "next/link";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/shadcn/card";
import {useRouter} from "next/navigation";
import {OrbitProgress} from "react-loading-indicators";
import {Alert, AlertDescription} from "@/components/shadcn/alert";
import {useAuth, User} from "@/auth-context";

export default function Login(){
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const router = useRouter();
    const authContext = useAuth();

    async function handleLogin (e: React.FormEvent<HTMLFormElement>)  {
        e.preventDefault();
        setError(null)
        setIsLoading(true)

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        try{
            const response = await fetch("http://localhost:8080/api/customer/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
                credentials: "include",
            })

            const result = await response.json();

            if(!response.ok){
                const errorMessage = result.detail || result.title || "Login failed";
                throw new Error(errorMessage);
            }

            const user = result as User;
            authContext.login(user);

            router.back();
        }catch(err){
            if(err instanceof Error){
                setError(err.message);
            }else{
                setError("Something went wrong. Please try again");
            }
        }finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-background px-6 py-12">
            <Card className={`relative w-full max-w-md transition-opacity ${isLoading ? 'opacity-60' : 'opacity-100'}`}>
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
                    className="absolute right-3 top-3 z-10"
                    asChild
                >
                    <Link href="/">
                        <X className="h-5 w-5" />
                    </Link>
                </Button>

                <CardHeader>
                    <CardTitle className="text-center text-2xl">Log In</CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <Input
                                id="email"
                                type="email"
                                name="email"
                                placeholder="Email"
                                required
                            />
                        </div>

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
                            <Link href="/register">Register</Link>
                        </Button>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}