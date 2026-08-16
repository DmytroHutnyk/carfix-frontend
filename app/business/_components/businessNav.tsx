import Link from "next/link";
import {Button} from "@/_components/shadcn/button";

export default function BusinessNav() {
    return (
        <nav className="w-full border-b bg-background">
            <ul className="mx-auto flex max-w-[1475px] items-center justify-center gap-12 px-6 py-2">
                {links.map((link) => (
                    <li key={link.href}>
                        <Button variant="link" className="font-normal" asChild>
                            <Link href={link.href}>{link.label}</Link>
                        </Button>
                    </li>
                ))}
            </ul>
        </nav>
    );
}

const links = [
    {label: "Try for Free", href: "/business#try-for-free"},
    {label: "Pricing", href: "/business#pricing"},
    {label: "FAQ", href: "/business#faq"},
    {label: "Contact us", href: "/business#contact"},
];
