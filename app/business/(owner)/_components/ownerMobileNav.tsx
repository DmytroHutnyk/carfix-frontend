"use client"

import {useState} from "react";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {icons, LucideIcon, Menu} from "lucide-react";
import {Button} from "@/_components/shadcn/button";
import {Separator} from "@/_components/shadcn/separator";
import {Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger} from "@/_components/shadcn/sheet";
import {OwnerMenuItem, PRIMARY_ITEMS, SECONDARY_ITEMS} from "@/business/(owner)/_components/ownerMenu";

export default function OwnerMobileNav({businessName}: { businessName: string | null }) {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    const renderItems = (items: OwnerMenuItem[]) => items.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
        const Icon: LucideIcon = icons[item.icon];
        return (
            <Button
                key={item.href}
                variant="ghost"
                className="h-10 justify-start gap-3"
                data-active={isActive}
                onClick={() => setOpen(false)}
                asChild
            >
                <Link replace href={item.href}>
                    <Icon className="h-5 w-5"/>
                    {item.label}
                </Link>
            </Button>
        );
    });

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open menu" className="lg:hidden">
                    <Menu className="h-5 w-5"/>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0 sm:p-0">
                <SheetHeader className="px-3 pb-2 pt-4">
                    <SheetTitle className="text-left">{businessName ?? "Menu"}</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-y-1 px-3 pb-6">
                    {renderItems(PRIMARY_ITEMS)}
                    <Separator className="my-2"/>
                    {renderItems(SECONDARY_ITEMS)}
                </nav>
            </SheetContent>
        </Sheet>
    );
}
