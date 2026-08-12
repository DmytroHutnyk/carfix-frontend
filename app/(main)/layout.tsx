import {cookies} from "next/headers";
import Header from "@/_components/root/header/header";
import {parseSearchLocationCookie, SEARCH_LOCATION_COOKIE} from "@/lib/searchLocationCookie";

export default async function MainLayout({ children }: {
    children: React.ReactNode
}) {
    const cookieStore = await cookies();
    const initialLocation = parseSearchLocationCookie(cookieStore.get(SEARCH_LOCATION_COOKIE)?.value);

    return (
        <div className="flex min-h-screen flex-col">
            <Header initialLocation={initialLocation}/>
            <div className="flex flex-1 flex-col">
                {children}
            </div>
        </div>
    )
}
