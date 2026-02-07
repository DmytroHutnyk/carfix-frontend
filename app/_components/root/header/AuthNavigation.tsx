"use client"

import {useAuth} from "@/util/auth/hooks/useAuth";
import UserNavigation from "@/_components/root/header/userNavigation";
import GuestNavigation from "@/_components/root/header/guestNavigation";

export default function AuthNavigation(){
    const { isAuthenticated } = useAuth();

    return(
        <>
            {isAuthenticated ? (<UserNavigation />) : (<GuestNavigation/>)} {/*TODO add placeholder while the auth is loading*/}
        </>
    )
}