"use client"

import {useAuth} from "@/features/auth/useAuth";
import UserNavigation from "@/_components/root/header/userNavigation";
import GuestNavigation from "@/_components/root/header/guestNavigation";
import NavigationSkeleton from "@/_components/root/header/navigationSkeleton";

export default function AuthNavigation(){
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) return <NavigationSkeleton/>;

    return(
        <>
            {isAuthenticated ? (<UserNavigation />) : (<GuestNavigation/>)}
        </>
    )
}