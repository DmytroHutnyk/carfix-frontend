"use client"

import {useRouter} from "next/navigation";
import {LogOut} from "lucide-react";
import Logo from "@/_components/root/header/logo";
import {Button} from "@/_components/shadcn/button";
import OwnerMobileNav from "@/business/(owner)/_components/ownerMobileNav";
import {useAuth} from "@/features/auth/useAuth";
import {isOwner} from "@/features/user/userTypes";

export default function OwnerHeader() {
    const {account, logout} = useAuth();
    const router = useRouter();
    const businessName = account && isOwner(account) ? account.businessName : null;

    return (
        <header className="w-full bg-background shadow-[0px_1px_3px_rgba(0,0,0,0.1)]">
            <div className="mx-auto flex max-w-[1475px] items-center justify-between gap-2 px-4 py-2 sm:px-6 lg:py-3">
                <div className="flex min-w-0 items-center gap-1 lg:gap-0">
                    <OwnerMobileNav businessName={businessName}/>
                    <Logo/>
                </div>
                <div className="flex items-center gap-3">
                    {businessName && (
                        <span className="hidden text-sm font-medium text-muted-foreground sm:inline">{businessName}</span>
                    )}
                    <Button
                        variant="headerOutline"
                        className="w-9 p-0 sm:w-auto sm:px-4 sm:py-2"
                        onClick={() => logout().then(() => router.replace("/business/login"))}
                    >
                        <LogOut/> <span className="hidden sm:inline">Log out</span>
                    </Button>
                </div>
            </div>
        </header>
    );
}
