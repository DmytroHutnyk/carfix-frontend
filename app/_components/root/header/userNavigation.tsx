"use client"

import Link from "next/link";
import CarProfileSelector from "@/_components/root/header/carProfileSelector";
import {Button} from "@/_components/shadcn/button";
import {useAuth} from "@/features/auth/useAuth";
import {isOwner} from "@/features/user/userTypes";

export default function UserNavigation(){
    const {account} = useAuth();

    if (account && isOwner(account)) {
        return (
            <Button variant="headerOutline" asChild>
                <Link href="/business/branches">My Service Points</Link>
            </Button>
        );
    }

    return (
        <>
            <CarProfileSelector/>
            <Button variant="headerOutline" asChild>
                <Link href="/profile">My Account</Link>
            </Button>
        </>
    )
}
