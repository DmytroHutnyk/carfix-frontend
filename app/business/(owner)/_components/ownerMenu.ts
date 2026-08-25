import {icons} from "lucide-react";

export interface OwnerMenuItem {
    href: string;
    label: string;
    icon: keyof typeof icons;
}

export const PRIMARY_ITEMS: OwnerMenuItem[] = [
    {href: "/business/branches", label: "My Service Points", icon: "Store"},
    {href: "/business/subscriptions", label: "Subscriptions", icon: "CreditCard"},
    {href: "/business/statistics", label: "Statistics", icon: "ChartColumn"},
    {href: "/business/profile", label: "Profile", icon: "CircleUserRound"},
];

export const SECONDARY_ITEMS: OwnerMenuItem[] = [
    {href: "/business/contact", label: "Contact Us", icon: "Phone"},
    {href: "/business/faq", label: "FAQ", icon: "CircleQuestionMark"},
    {href: "/business/terms-of-use", label: "Terms of Use", icon: "FileText"},
];
