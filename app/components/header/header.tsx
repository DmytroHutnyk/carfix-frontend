'use client'

import Logo from "@/components/header/logo";
import {MapPin, Search} from "lucide-react";
import {Input} from "@/components/shadcn/input";
import GuestNavigation, {Language} from "@/components/header/guestNavigation";
import UserNavigation from "@/components/header/userNavigation";
import {ChangeEvent, useState} from "react";

export default function Header() {
    const loggedIn = false;
    const [language, setLanguage] = useState<Language>("EN");

    const handleLanguageChange = (newLanguage: Language) => {
        setLanguage(newLanguage);
    }

    return (
        <header className="w-full border-b-border bg-background shadow-[0px_1px_3px_rgba(0,0,0,0.1)]">
            <div className="mx-auto flex max-w-[1425px] items-center gap-7 px-6 py-3 ">

                {/* Logo and slogan*/}
                <Logo/>

                {/* Search + location */}
                <div className="flex flex-1 items-center gap-3">

                    <div className="relative flex-1">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search services..."
                            className="pl-9"
                        />
                    </div>

                    <div className="relative w-56">
                        <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Location..."
                            className="pl-9"
                        />
                    </div>
                </div>

                {/* Buttons for LoggedIn user and for guest*/}
                {loggedIn ? (<UserNavigation />) : (<GuestNavigation language={language} setLanguage={handleLanguageChange} />)}


            </div>
        </header>
    )
}