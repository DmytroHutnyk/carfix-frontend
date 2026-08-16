"use client"

import Link from "next/link";
import {Button} from "@/_components/shadcn/button";
import {Skeleton} from "@/_components/shadcn/skeleton";
import {useAuth} from "@/features/auth/useAuth";

export default function BusinessAuthNavigation() {
    const {isAuthenticated, isLoading} = useAuth();

    if (isLoading) return <Skeleton className="h-9 w-28 rounded-md"/>;

    return isAuthenticated ? (
        <Button variant="headerOutline" asChild>
            <Link href="/profile">My Account</Link>
        </Button>
    ) : (
        <Button asChild>
            <Link href="/login">Login/SignUp</Link>
        </Button>
    );
}
