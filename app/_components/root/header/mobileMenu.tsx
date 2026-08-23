'use client'
import {useState} from "react";
import Link from "next/link";
import {Menu} from "lucide-react";
import {Button} from "@/_components/shadcn/button";
import {Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger} from "@/_components/shadcn/sheet";
import CarProfileSelector from "@/_components/root/header/carProfileSelector";
import LanguageRegionSelector from "@/_components/root/header/languageRegionSelector";
import {useAuth} from "@/features/auth/useAuth";
import {isOwner} from "@/features/user/userTypes";

export default function MobileMenu() {
    const [open, setOpen] = useState(false);
    const {account, isAuthenticated, isLoading} = useAuth();
    const owner = account != null && isOwner(account);

    const close = () => setOpen(false);

    return (
        <div className="flex shrink-0 items-center gap-2 lg:hidden">
            {isAuthenticated && !owner && <CarProfileSelector className="h-11 w-36"/>}

            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" aria-label="Open menu" className="h-11 w-11">
                        <Menu className="h-5 w-5"/>
                    </Button>
                </SheetTrigger>
                <SheetContent side="right" className="flex w-72 flex-col gap-6 overflow-y-auto">
                    <SheetHeader>
                        <SheetTitle>Menu</SheetTitle>
                    </SheetHeader>

                    {!isLoading && (
                        <div className="flex flex-col gap-3">
                            {isAuthenticated ? (
                                <Button variant="headerOutline" className="h-11 w-full" onClick={close} asChild>
                                    <Link href={owner ? "/business/branches" : "/profile"}>
                                        {owner ? "My Service Points" : "My Account"}
                                    </Link>
                                </Button>
                            ) : (
                                <>
                                    <Button className="h-11 w-full" onClick={close} asChild>
                                        <Link href="/login">Login/SignUp</Link>
                                    </Button>
                                    <Button variant="headerOutline" className="h-11 w-full" onClick={close} asChild>
                                        <Link href="/business">For Business</Link>
                                    </Button>
                                </>
                            )}
                        </div>
                    )}

                    <div className="border-t pt-4">
                        <LanguageRegionSelector/>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    )
}
