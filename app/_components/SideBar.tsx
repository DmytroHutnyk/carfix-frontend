'use client'

import {usePathname} from "next/navigation";
import {Card, CardContent} from "@/_components/shadcn/card";
import {Button} from "@/_components/shadcn/button";
import Link from "next/link";
import {icons, LucideIcon} from "lucide-react";
import {cn} from "@/lib/utils";

export default function SideBar({menuItems, mobile = "segmented"}: {
    menuItems: SideBarItem[];
    mobile?: "segmented" | "none";
}){
    const pathName = usePathname();
    return(
        <aside className={cn("flex flex-col", mobile === "none" && "hidden lg:flex")}>
            {mobile === "segmented" && (
                <nav className="flex h-9 w-full items-center gap-0.5 rounded-md border bg-muted p-0.5 lg:hidden">
                    {menuItems.map((item) => {
                        const Icon: LucideIcon = icons[item.icon];
                        return (
                            <Link
                                key={item.href}
                                replace
                                href={item.href}
                                data-active={pathName === item.href}
                                className="flex h-8 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-[5px] px-1 text-xs font-medium text-muted-foreground transition-colors data-[active=true]:bg-primary data-[active=true]:text-primary-foreground data-[active=true]:shadow-sm"
                            >
                                <Icon className="h-4 w-4 shrink-0"/>
                                <span className="truncate">{item.shortLabel ?? item.label}</span>
                            </Link>
                        );
                    })}
                </nav>
            )}

            <Card className="hidden p-4 lg:block">
                <CardContent className="p-0">
                    <nav className="flex flex-col gap-2">
                        {menuItems.map((item) => {
                            const isActive = pathName === item.href;
                            const Icon: LucideIcon = icons[item.icon];
                            return (
                                <Button
                                    key={item.href}
                                    variant="ghost"
                                    className="h-9 shrink-0 justify-start gap-3 px-4"
                                    data-active={isActive}
                                    asChild
                                >
                                    <Link replace href={item.href}>
                                        <Icon className="h-5 w-5" />
                                        {item.label}
                                    </Link>
                                </Button>
                            );
                        })}
                    </nav>
                </CardContent>
            </Card>
        </aside>
    )
}

export interface SideBarItem{
    href: string,
    label: string,
    shortLabel?: string,
    icon: keyof typeof icons
}
