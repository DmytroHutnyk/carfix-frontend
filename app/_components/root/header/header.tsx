"use client"
import Logo from "@/_components/root/header/logo";
import {Search} from "lucide-react";
import {Input} from "@/_components/shadcn/input";
import AuthNavigation from "@/_components/root/header/AuthNavigation";
import LocationSearchBar from "@/_components/root/header/locationSearchBar";
import {useState} from "react";
import GoogleApiProvider from "@/util/providers/googleApiProvider";

export default function Header() {
    

    const [selectedPlace, setSelectedPlace] =
        useState<google.maps.places.Place | null>(null);

    return (
        <header className="w-full border-b-border bg-background shadow-[0px_1px_3px_rgba(0,0,0,0.1)]">
            <div className="mx-auto flex max-w-[1475px] items-center gap-7 px-6 py-3 ">

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
                        <GoogleApiProvider>
                            <LocationSearchBar onPlaceSelect={setSelectedPlace}/>
                        </GoogleApiProvider>
                    </div>
                </div>

                {/* Buttons for LoggedIn user and for guest*/}
                <AuthNavigation/>

            </div>
        </header>
    )
}