import {ReactNode, Suspense} from "react";
import RedirectIfAuthenticated from "@/_components/guards/RedirectIfAuthenticated";

export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <Suspense>
            <RedirectIfAuthenticated>
                <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-background px-6 py-12">
                    {children}
                </div>
            </RedirectIfAuthenticated>
        </Suspense>
    );
}
