'use client'
import {Button} from "@/_components/shadcn/button";
import Link from "next/link";
import LanguageRegionSelector from "@/_components/root/header/languageRegionSelector";

export default function GuestNavigation() {
    return (
        <>
            <LanguageRegionSelector />

            <div className="inline-flex items-center justify-center gap-3">
                <Button variant="default" asChild>
                    <Link href="/login">
                        Login/SignUp
                    </Link>
                </Button>
                <Button variant="headerOutline" asChild>
                    <Link href="/business">For Business</Link>
                </Button>
            </div>
        </>
    )
}
