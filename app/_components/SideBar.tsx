'use client'

import {usePathname} from "next/navigation";
import {Card, CardContent} from "@/_components/shadcn/card";
import {Button} from "@/_components/shadcn/button";
import Link from "next/link";
import {icons, LucideIcon} from "lucide-react";

export default function SideBar({menuItems}: {menuItems: SideBarItem[]}){
    const pathName = usePathname();
    return(
        <aside className="flex flex-col">
            <Card className="p-4">
                <CardContent className="p-0">
                    <nav className="flex flex-col gap-y-2">
                        {menuItems.map((item) => {
                            const isActive = pathName === item.href;
                            const Icon: LucideIcon = icons[item.icon];
                            return (
                                <Button
                                    key={item.href}
                                    variant="ghost"
                                    className="flex justify-start gap-3"
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
    icon: keyof typeof icons
}