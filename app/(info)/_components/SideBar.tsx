import {Card, CardContent} from "@/_components/shadcn/card";
import {Button} from "@/_components/shadcn/button";
import Link from "next/link";
import {FileText, HelpCircle, Info, Phone} from "lucide-react";

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


export default function SideBar({ pathName }: { pathName: string}){
    return(
        <aside className="flex flex-col">
            <Card className="p-4">
                <CardContent className="p-0">
                    <nav className="flex flex-col gap-y-2">
                        {menuItems.map((item) => {
                            const isActive = pathName === item.href;
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
    )
}