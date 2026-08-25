import SideBar, {SideBarItem} from "@/_components/SideBar";
import RequireAuth from "@/_components/guards/RequireAuth";
import {ROLE} from "@/features/user/userTypes";

export default function MyAccountLayout({ children }: {
    children: React.ReactNode
}) {
    return (
        <RequireAuth role={ROLE.CUSTOMER}>
            <div className="flex mx-auto max-w-[1425px] px-4 py-4 sm:px-6 lg:px-[72px] lg:py-6 min-h-[calc(100vh-115px)]">
                <div className="grid grid-cols-1 grid-rows-[auto_1fr] gap-4 lg:grid-cols-[256px_1fr] lg:grid-rows-none lg:gap-5 flex-1">
                    <SideBar menuItems={menuItems}/>
                    <div className="min-w-0 py-1 lg:py-3">
                        {children}
                    </div>
                </div>
            </div>
        </RequireAuth>
    )
}

const menuItems: SideBarItem[] = [
    { href: "/profile",   label: "My Profile",   shortLabel: "Profile",  icon: "CircleUserRound" },
    { href: "/cars",      label: "My Cars",      shortLabel: "Cars",     icon: "Car" },
    { href: "/bookings",  label: "My Bookings",  shortLabel: "Bookings", icon: "Calendar" },
];
