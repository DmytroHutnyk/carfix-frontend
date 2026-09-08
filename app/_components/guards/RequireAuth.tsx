"use client"

import {ReactNode, useEffect} from "react";
import {usePathname, useRouter} from "next/navigation";
import {useAuth} from "@/features/auth/useAuth";
import {Spinner} from "@/_components/shadcn/spinner";
import {UserRole} from "@/features/user/userTypes";
import {loginPathFor, withReturnTo} from "@/lib/returnTo";

type RequireAuthProps = {
    children: ReactNode;
    role?: UserRole;
};

/* Guard is UX only, the backend authorizes every request regardless of what renders. */
export default function RequireAuth({children, role}: RequireAuthProps) {
    const {account, isAuthenticated, isLoading, isError} = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    const unauthenticated = !isLoading && (isError || !isAuthenticated);
    const wrongRole = !isLoading && !unauthenticated && role !== undefined && account?.role !== role;

    useEffect(() => {
        if (unauthenticated) {
            router.replace(withReturnTo(loginPathFor(pathname), pathname));
        } else if (wrongRole) {
            router.replace("/");
        }
    }, [unauthenticated, wrongRole, router, pathname]);

    if (isLoading || unauthenticated || wrongRole) {
        return (
            <div className="flex min-h-[calc(100vh-115px)] items-center justify-center">
                <Spinner className="size-8 text-muted-foreground"/>
            </div>
        );
    }

    return <>{children}</>;
}
