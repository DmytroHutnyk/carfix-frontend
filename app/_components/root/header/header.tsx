"use client"
import Logo from "@/_components/root/header/logo";
import SearchBar from "@/_components/root/header/searchBar";
import AuthNavigation from "@/_components/root/header/authNavigation";
import LocationSearchBar from "@/_components/root/header/locationSearchBar";
import GoogleApiProvider from "@/lib/providers/googleApiProvider";

type Place = google.maps.places.Place;

export default function Header() {

    return (
        <header className="w-full border-b-border bg-background shadow-[0px_1px_3px_rgba(0,0,0,0.1)]">
            <div className="mx-auto flex max-w-[1475px] items-center gap-7 px-6 py-3 ">

                {/* Logo and slogan*/}
                <Logo/>

                {/* Search + location */}
                <div className="flex flex-1 items-center gap-3">

                    <div className="flex-1">
                        <SearchBar/>
                    </div>

                    <div className="relative w-56">
                        <GoogleApiProvider>
                            <LocationSearchBar/>
                        </GoogleApiProvider>
                    </div>
                </div>

                {/* Buttons for LoggedIn user and for guest*/}
                <AuthNavigation/>

            </div>
        </header>
    )
}