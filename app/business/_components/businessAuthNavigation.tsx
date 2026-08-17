"use client"

import Link from "next/link";
import {Button} from "@/_components/shadcn/button";
import {Skeleton} from "@/_components/shadcn/skeleton";
import {useAuth} from "@/features/auth/useAuth";
import {isOwner} from "@/features/user/userTypes";

export default function BusinessAuthNavigation() {
    const {account, isAuthenticated, isLoading} = useAuth();

    if (isLoading) return <Skeleton className="h-9 w-28 rounded-md"/>;

    const accountHref = account && isOwner(account) ? "/business/branches" : "/profile";
    const accountLabel = account && isOwner(account) ? "My Service Points" : "My Account";

    return isAuthenticated ? (
        <Button variant="headerOutline" asChild>
            <Link href={accountHref}>{accountLabel}</Link>
        </Button>
    ) : (
        <Button asChild>
            <Link href="/login">Login/SignUp</Link>
        </Button>
    );
}
