"use client"

import {ReactNode, useEffect, useRef} from "react";
import {useRouter, useSearchParams} from "next/navigation";
import {useAuth} from "@/features/auth/useAuth";
import {isOwner} from "@/features/user/userTypes";
import {safeReturnTo} from "@/lib/returnTo";

export default function RedirectIfAuthenticated({children}: { children: ReactNode }) {
    const {account, isAuthenticated, isLoading} = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const checked = useRef(false);

    useEffect(() => {
        if (isLoading || checked.current) return;
        checked.current = true;
        if (isAuthenticated) {
            const returnTo = safeReturnTo(searchParams.get("returnTo"));
            router.replace(returnTo ?? (account && isOwner(account) ? "/business/branches" : "/"));
        }
    }, [isLoading, isAuthenticated, account, router, searchParams]);

    return <>{children}</>;
}
