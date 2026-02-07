import {ReactNode} from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-background px-6 py-12">
            {children}
        </div>
    );
}

