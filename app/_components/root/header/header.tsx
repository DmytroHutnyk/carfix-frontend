"use client"
import {Suspense} from "react";
import Logo from "@/_components/root/header/logo";
import SearchRow from "@/_components/root/header/searchRow";
import AuthNavigation from "@/_components/root/header/authNavigation";
import {SearchLocation} from "@/lib/appTypes";

export default function Header({initialLocation}: {initialLocation: SearchLocation}) {

    return (
        <header className="w-full border-b-border bg-background shadow-[0px_1px_3px_rgba(0,0,0,0.1)]">
            <div className="mx-auto flex max-w-[1475px] items-center gap-7 px-6 py-3 ">

                {/* Logo and slogan*/}
                <Logo/>

                <Suspense fallback={<div className="flex-1"/>}>
                    <SearchRow initialLocation={initialLocation}/>
                </Suspense>

                {/* Buttons for LoggedIn user and for guest*/}
                <AuthNavigation/>

            </div>
        </header>
    )
}
