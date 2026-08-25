'use client'
import {useState} from "react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {
    Briefcase,
    Calendar,
    Car,
    CircleQuestionMark,
    CircleUserRound,
    FileText,
    Info,
    LogIn,
    LogOut,
    LucideIcon,
    Menu,
    Phone,
    Store,
} from "lucide-react";
import {Button} from "@/_components/shadcn/button";
import {Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger} from "@/_components/shadcn/sheet";
import CarProfileSelector from "@/_components/root/header/carProfileSelector";
import LanguageRegionSelector from "@/_components/root/header/languageRegionSelector";
import {useAuth} from "@/features/auth/useAuth";
import {isOwner} from "@/features/user/userTypes";
import MenuLinkRow from "@/_components/menuLinkRow";

interface MenuRow {
    href: string;
    label: string;
    icon: LucideIcon;
    strong?: boolean;
}

const GUEST_ROWS: MenuRow[] = [
    {href: "/login", label: "Log in / Sign up", icon: LogIn, strong: true},
    {href: "/business", label: "For business", icon: Briefcase},
];

const CUSTOMER_ROWS: MenuRow[] = [
    {href: "/profile", label: "My profile", icon: CircleUserRound},
    {href: "/cars", label: "My cars", icon: Car},
    {href: "/bookings", label: "My bookings", icon: Calendar},
];

const OWNER_ROWS: MenuRow[] = [
    {href: "/business/branches", label: "My service points", icon: Store},
];

const INFO_ROWS: MenuRow[] = [
    {href: "/about-us", label: "About us", icon: Info},
    {href: "/contacts", label: "Contacts", icon: Phone},
    {href: "/faq", label: "FAQ", icon: CircleQuestionMark},
    {href: "/terms-of-use", label: "Terms of use", icon: FileText},
];

export default function MobileMenu() {
    const [open, setOpen] = useState(false);
    const {account, isAuthenticated, isLoading, logout} = useAuth();
    const router = useRouter();
    const owner = account != null && isOwner(account);

    const close = () => setOpen(false);

    const accountRows = isAuthenticated ? (owner ? OWNER_ROWS : CUSTOMER_ROWS) : GUEST_ROWS;

    return (
        <div className="flex shrink-0 items-center gap-1 lg:hidden">
            {isAuthenticated && !owner && <CarProfileSelector compact/>}

            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" aria-label="Open menu">
                        <Menu className="h-5 w-5"/>
                    </Button>
                </SheetTrigger>
                <SheetContent side="right" className="flex w-[82vw] max-w-[320px] flex-col gap-0 p-0 lg:p-0">
                    <SheetHeader className="h-12 shrink-0 justify-center border-b px-4 pr-12">
                        <SheetTitle className="text-sm font-semibold">Menu</SheetTitle>
                    </SheetHeader>

                    <nav className="flex-1 overflow-y-auto">
                        {!isLoading && (
                            <div className="divide-y">
                                {accountRows.map((row) => (
                                    <MenuLinkRow key={row.href} {...row} onNavigate={close}/>
                                ))}
                                {isAuthenticated && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            close();
                                            logout().then(() => router.replace("/"));
                                        }}
                                        className="flex h-11 w-full items-center gap-3 px-4 text-sm text-destructive"
                                    >
                                        <LogOut className="h-4 w-4 shrink-0"/>
                                        <span>Log out</span>
                                    </button>
                                )}
                            </div>
                        )}

                        <div className="h-2 border-y bg-muted/40"/>

                        <div className="divide-y">
                            {INFO_ROWS.map((row) => (
                                <MenuLinkRow key={row.href} {...row} onNavigate={close}/>
                            ))}
                        </div>
                    </nav>

                    <div className="shrink-0 border-t px-4 py-1">
                        <LanguageRegionSelector/>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    )
}
