import {Button} from "@/_components/shadcn/button";
import Link from "next/link";

const buttons =[
    {
        text: "About Us",
        resource: "/about-us"
    },
    {
        text: "Contacts",
        resource: "/contacts"
    },
    {
        text: "Terms of Use",
        resource: "/terms-of-use"
    },
    {
        text: "FAQ",
        resource: "/faq"
    },
]

export default function Footer(){
    return(
        <footer className="w-full bg-background shadow-[0px_-2px_4px_rgba(0,0,0,0.05)]">
            <div className="flex items-center justify-center gap-2 py-2">
                {buttons.map((button) => (
                    <Button key={button.text} variant="link" className="font-normal italic text-muted-foreground" asChild>
                        <Link href={button.resource}>{button.text}</Link>
                    </Button>
                ))}
            </div>
        </footer>
    )
}