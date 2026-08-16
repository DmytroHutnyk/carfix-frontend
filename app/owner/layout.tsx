import {ReactNode} from "react";
import RequireAuth from "@/_components/guards/RequireAuth";
import {ROLE} from "@/features/user/userTypes";

export default function OwnerLayout({children}: { children: ReactNode }) {
    return (
        <RequireAuth role={ROLE.OWNER}>
            {children}
        </RequireAuth>
    );
}
