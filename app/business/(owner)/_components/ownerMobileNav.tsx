"use client"

import {useState} from "react";
import {usePathname} from "next/navigation";
import {icons, LucideIcon, Menu} from "lucide-react";
import {Button} from "@/_components/shadcn/button";
import MenuLinkRow from "@/_components/menuLinkRow";
import {Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger} from "@/_components/shadcn/sheet";
import {OwnerMenuItem, PRIMARY_ITEMS, SECONDARY_ITEMS} from "@/business/(owner)/_components/ownerMenu";

export default function OwnerMobileNav({businessName}: { businessName: string | null }) {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    const renderItems = (items: OwnerMenuItem[]) => items.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
        const Icon: LucideIcon = icons[item.icon];
        return (
            <MenuLinkRow
                key={item.href}
                replace
                href={item.href}
                label={item.label}
                icon={Icon}
                active={isActive}
                onNavigate={() => setOpen(false)}
            />
        );
    });

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open menu" className="lg:hidden">
                    <Menu className="h-5 w-5"/>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex w-[82vw] max-w-[320px] flex-col gap-0 p-0 lg:p-0">
                <SheetHeader className="h-12 shrink-0 justify-center border-b px-4 pr-12">
                    <SheetTitle className="truncate text-sm font-semibold">{businessName ?? "Menu"}</SheetTitle>
                </SheetHeader>
                <nav className="flex-1 overflow-y-auto">
                    <div className="divide-y">{renderItems(PRIMARY_ITEMS)}</div>
                    <div className="h-2 border-y bg-muted/40"/>
                    <div className="divide-y">{renderItems(SECONDARY_ITEMS)}</div>
                </nav>
            </SheetContent>
        </Sheet>
    );
}
