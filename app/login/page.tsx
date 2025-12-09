"use client"
import {Button} from "@/components/shadcn/button";
import {Input} from "@/components/shadcn/input";
import { Eye, EyeOff, X } from 'lucide-react'
import {useState} from "react";
import {useRouter} from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function Login(){
    const handleLogin= (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    }

    const [showPassword, setShowPassword] = useState<boolean>(false);
    const router = useRouter();

    const handleClose = () => {
        router.back();
    };

    return (

        <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-background px-6 py-12">
            <div className="relative w-full max-w-md rounded-lg bg-card p-8 shadow-lg">
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-3 top-3"
                    onClick={handleClose}
                >
                    <X className="h-5 w-5" />
                </Button>

                <h2 className="mb-8 text-center text-2xl font-bold text-card-foreground">
                    Log in
                </h2>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                        <Input
                            id="email"
                            type="email"
                            name="email"
                            placeholder="Email"
                            required
                        />
                    </div>

                    <div className="relative space-y-2">
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
                            className="absolute right-1 top-1 h-7 w-7"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? (<EyeOff className="h-4 w-4 text-muted-foreground" />) : (<Eye className="h-4 w-4 text-muted-foreground" />)}
                        </Button>
                    </div>

                    <Button 
                        type="submit"
                        variant="default"
                        className="w-full"
                    >
                        Log In
                    </Button>
                </form>

                <div className="my-6 flex items-center">
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

                <p className="mt-6 text-center text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <Button variant="link" asChild className="p-0 h-auto">
                        <Link href="/register">Register</Link>
                    </Button>
                </p>
            </div>
        </div>
    )
}