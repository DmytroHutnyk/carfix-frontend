"use client"

import {ReactNode, useEffect, useRef} from "react";
import {useRouter} from "next/navigation";
import {useAuth} from "@/features/auth/useAuth";
import {isOwner} from "@/features/user/userTypes";

export default function RedirectIfAuthenticated({children}: { children: ReactNode }) {
    const {account, isAuthenticated, isLoading} = useAuth();
    const router = useRouter();
    const checked = useRef(false);

    useEffect(() => {
        if (isLoading || checked.current) return;
        checked.current = true;
        if (isAuthenticated) {
            router.replace(account && isOwner(account) ? "/business/branches" : "/");
        }
    }, [isLoading, isAuthenticated, account, router]);

    return <>{children}</>;
}
