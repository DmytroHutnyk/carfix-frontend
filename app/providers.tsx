"use client"

import {ReactNode} from "react";
import { AuthProvider } from "@/auth-context"

//Created so the whole root layout does not become "client" component
export default function Providers({ children }: { children: ReactNode }) {
    return (
        <AuthProvider>
            {children}
        </AuthProvider>
    )
}