'use client'
import Link from "next/link";
import {ChevronRight, LucideIcon} from "lucide-react";
import {cn} from "@/lib/utils";

interface MenuLinkRowProps {
    href: string;
    label: string;
    icon: LucideIcon;
    strong?: boolean;
    active?: boolean;
    replace?: boolean;
    onNavigate: () => void;
}

export default function MenuLinkRow({href, label, icon: Icon, strong, active, replace, onNavigate}: MenuLinkRowProps) {
    return (
        <Link
            href={href}
            replace={replace}
            data-active={active}
            onClick={onNavigate}
            className={cn(
                "flex h-11 items-center gap-3 px-4 text-sm data-[active=true]:bg-accent data-[active=true]:font-medium",
                strong && "font-semibold",
            )}
        >
            <Icon className={cn("h-4 w-4 shrink-0", strong ? "text-foreground" : "text-muted-foreground")}/>
            <span className="truncate">{label}</span>
            <ChevronRight className="ml-auto h-4 w-4 shrink-0 text-muted-foreground"/>
        </Link>
    );
}
