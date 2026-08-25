"use client"
import {Suspense} from "react";
import Logo from "@/_components/root/header/logo";
import SearchRow from "@/_components/root/header/searchRow";
import AuthNavigation from "@/_components/root/header/authNavigation";
import MobileMenu from "@/_components/root/header/mobileMenu";
import {SearchLocation} from "@/lib/appTypes";

export default function Header({initialLocation}: {initialLocation: SearchLocation}) {

    return (
        <header className="w-full border-b-border bg-background shadow-[0px_1px_3px_rgba(0,0,0,0.1)]">
            <div className="mx-auto flex max-w-[1475px] flex-col gap-2 px-4 py-2 lg:flex-row lg:items-center lg:gap-7 lg:px-6 lg:py-3">

                <div className="flex h-9 min-w-0 items-center justify-between gap-2 lg:h-auto lg:contents">
                    {/* Logo and slogan*/}
                    <Logo/>
                    <MobileMenu/>
                </div>

                <Suspense fallback={<div className="h-11 flex-1 lg:h-auto"/>}>
                    <SearchRow initialLocation={initialLocation}/>
                </Suspense>

                {/* Buttons for LoggedIn user and for guest*/}
                <div className="hidden lg:contents">
                    <AuthNavigation/>
                </div>

            </div>
        </header>
    )
}
