"use client"

import {useState} from "react";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {ChevronLeft, ChevronRight, icons, LucideIcon} from "lucide-react";
import {Card, CardContent} from "@/_components/shadcn/card";
import {Button} from "@/_components/shadcn/button";
import {Separator} from "@/_components/shadcn/separator";
import {OwnerMenuItem, PRIMARY_ITEMS, SECONDARY_ITEMS} from "@/business/(owner)/_components/ownerMenu";
import {cn} from "@/lib/utils";

export default function OwnerSidebar() {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);

    const renderItems = (items: OwnerMenuItem[]) => items.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
        const Icon: LucideIcon = icons[item.icon];
        return (
            <Button
                key={item.href}
                variant="ghost"
                className={cn("flex justify-start gap-3", collapsed && "justify-center px-0")}
                data-active={isActive}
                title={item.label}
                asChild
            >
                <Link replace href={item.href}>
                    <Icon className="h-5 w-5"/>
                    {!collapsed && item.label}
                </Link>
            </Button>
        );
    });

    return (
        <aside className={cn("hidden shrink-0 transition-[width] lg:block", collapsed ? "w-16" : "w-64")}>
            <Card className="p-4">
                <CardContent className="flex flex-col gap-y-2 p-0">
                    <div className={cn("flex items-center", collapsed ? "justify-center" : "justify-between")}>
                        {!collapsed && <span className="px-4 font-semibold">Menu</span>}
                        <Button
                            variant="ghost"
                            size="icon"
                            aria-label={collapsed ? "Expand menu" : "Collapse menu"}
                            onClick={() => setCollapsed((value) => !value)}
                        >
                            {collapsed ? <ChevronRight/> : <ChevronLeft/>}
                        </Button>
                    </div>
                    <nav className="flex flex-col gap-y-2">
                        {renderItems(PRIMARY_ITEMS)}
                        <Separator className="my-2"/>
                        {renderItems(SECONDARY_ITEMS)}
                    </nav>
                </CardContent>
            </Card>
        </aside>
    );
}
