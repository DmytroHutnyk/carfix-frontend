"use client"

import {ReactNode, useEffect, useRef} from "react";
import {useRouter} from "next/navigation";
import {useAuth} from "@/util/hooks/useAuth";

export default function RedirectIfAuthenticated({children}: { children: ReactNode }) {
    const {isAuthenticated, isLoading} = useAuth();
    const router = useRouter();
    const checked = useRef(false);

    useEffect(() => {
        if (isLoading || checked.current) return;
        checked.current = true;
        if (isAuthenticated) {
            router.replace("/");
        }
    }, [isLoading, isAuthenticated, router]);

    return <>{children}</>;
}
