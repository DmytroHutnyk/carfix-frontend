'use client'

import {Card, CardContent} from "@/_components/shadcn/card";
import {Button} from "@/_components/shadcn/button";
import {Info, Phone, FileText, HelpCircle} from "lucide-react";
import Link from "next/link";
import {usePathname} from "next/navigation";

export default function Page(){
    const pathname = usePathname();

    return(
        <div className="flex mx-auto max-w-[1425px] px-[72px] py-6 min-h-[calc(100vh-115px)]">
            <div className="grid grid-cols-[256px_1fr] gap-5 flex-1">
                <aside className="flex flex-col">
                    <Card className="p-4">
                        <CardContent className="p-0">
                            <nav className="flex flex-col gap-y-2">
                                {menuItems.map((item) => {
                                    const isActive = pathname === item.href;
                                    const Icon = item.icon;
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
                <div className="py-3">
                    <header className="text-2xl font-bold mb-4">
                        Terms of Use
                    </header>
                    <p className="text-muted-foreground">

                    </p>
                </div>
            </div>
        </div>
    )
}


const menuItems = [
    {
        href: "/about-us",
        label: "About Us",
        icon: Info
    },
    {
        href: "/contacts",
        label: "Contacts",
        icon: Phone
    },
    {
        href: "/terms-of-use",
        label: "Terms of Use",
        icon: FileText
    },
    {
        href: "/faq",
        label: "FAQ",
        icon: HelpCircle
    },
];