import {ReactNode} from "react";
import RequireAuth from "@/_components/guards/RequireAuth";
import {ROLE} from "@/features/user/userTypes";
import OwnerHeader from "@/business/(owner)/_components/ownerHeader";
import OwnerSidebar from "@/business/(owner)/_components/ownerSidebar";
import BusinessFooter from "@/business/_components/businessFooter";

export default function OwnerLayout({children}: { children: ReactNode }) {
    return (
        <RequireAuth role={ROLE.OWNER}>
            <div className="flex min-h-screen flex-col">
                <OwnerHeader/>
                <div className="mx-auto flex w-full max-w-[1425px] flex-1 gap-5 px-[72px] py-6">
                    <OwnerSidebar/>
                    <main className="min-w-0 flex-1 py-3">
                        {children}
                    </main>
                </div>
                <BusinessFooter/>
            </div>
        </RequireAuth>
    );
}
