import {Suspense} from "react";
import RedirectIfAuthenticated from "@/_components/guards/RedirectIfAuthenticated";
import LoginForm from "@/_components/loginForm";

export default function BusinessLoginPage() {
    return (
        <Suspense>
            <RedirectIfAuthenticated>
                <div className="flex min-h-[calc(100vh-115px)] items-center justify-center px-6 py-12">
                    <LoginForm registerHref="/business/register"/>
                </div>
            </RedirectIfAuthenticated>
        </Suspense>
    );
}
