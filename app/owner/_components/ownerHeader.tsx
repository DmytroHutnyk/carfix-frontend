"use client"

import {useRouter} from "next/navigation";
import {LogOut} from "lucide-react";
import Logo from "@/_components/root/header/logo";
import {Button} from "@/_components/shadcn/button";
import {useAuth} from "@/features/auth/useAuth";
import {isOwner} from "@/features/user/userTypes";

export default function OwnerHeader() {
    const {account, logout} = useAuth();
    const router = useRouter();
    const businessName = account && isOwner(account) ? account.businessName : null;

    return (
        <header className="w-full bg-background shadow-[0px_1px_3px_rgba(0,0,0,0.1)]">
            <div className="mx-auto flex max-w-[1475px] items-center justify-between px-6 py-3">
                <Logo/>
                <div className="flex items-center gap-3">
                    {businessName && (
                        <span className="text-sm font-medium text-muted-foreground">{businessName}</span>
                    )}
                    <Button
                        variant="headerOutline"
                        onClick={() => logout().then(() => router.replace("/login"))}
                    >
                        <LogOut/> Log out
                    </Button>
                </div>
            </div>
        </header>
    );
}
