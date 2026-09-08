import SideBar, {SideBarItem} from "@/_components/SideBar";

export default function InfoLayout({ children }: {
    children: React.ReactNode
}) {
    return (
        <div className="flex mx-auto max-w-[1425px] px-4 py-4 sm:px-6 lg:px-[72px] lg:py-6 min-h-[calc(100vh-115px)]">
            <div className="grid grid-cols-1 grid-rows-[auto_1fr] gap-4 lg:grid-cols-[256px_1fr] lg:grid-rows-none lg:gap-5 flex-1">
                <SideBar menuItems={menuItems} mobile="none"/>
                <div className="min-w-0 py-1 lg:py-3">
                    {children}
                </div>
            </div>
        </div>
    )
}

const menuItems: SideBarItem[] = [
    { href: "/about-us",      label: "About Us",      icon: "Info" },
    { href: "/contacts",      label: "Contacts",      icon: "Phone" },
    { href: "/terms-of-use",  label: "Terms of Use",  icon: "FileText" },
    { href: "/faq",           label: "FAQ",            icon: "CircleQuestionMark" },
];
