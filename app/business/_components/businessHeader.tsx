import Logo from "@/_components/root/header/logo";
import BusinessAuthNavigation from "@/business/_components/businessAuthNavigation";

export default function BusinessHeader() {
    return (
        <header className="w-full bg-background shadow-[0px_1px_3px_rgba(0,0,0,0.1)]">
            <div className="mx-auto flex max-w-[1475px] items-center justify-between gap-2 px-4 py-2 sm:px-6 sm:py-3">
                <Logo/>
                <BusinessAuthNavigation/>
            </div>
        </header>
    );
}
