import SideBar, {SideBarItem} from "@/_components/SideBar";

export default function InfoLayout({ children }: {
    children: React.ReactNode
}) {
    return (
        <div className="flex mx-auto max-w-[1425px] px-[72px] py-6 min-h-[calc(100vh-115px)]">
            <div className="grid grid-cols-[256px_1fr] gap-5 flex-1">
                <SideBar menuItems={menuItems}/>
                <div className="py-3">
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
