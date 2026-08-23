import Link from "next/link";
import {Button} from "@/_components/shadcn/button";

export default function BusinessFooter() {
    return (
        <footer className="w-full bg-background shadow-[0px_-2px_4px_rgba(0,0,0,0.05)]">
            <div className="flex flex-wrap items-center justify-center gap-2 py-2">
                {links.map((link) => (
                    <Button key={link.href} variant="link" className="font-normal text-muted-foreground" asChild>
                        <Link href={link.href}>{link.label}</Link>
                    </Button>
                ))}
            </div>
        </footer>
    );
}

const links = [
    {label: "Terms of Use", href: "/business/terms-of-use"},
    {label: "Contacts", href: "/business/contact"},
    {label: "FAQ", href: "/business/faq"},
];
