'use client'

import {usePathname} from "next/navigation";
import SideBar from "@/(info)/_components/SideBar";

export default function Page(){
    const pathname = usePathname();

    return(
        <div className="flex mx-auto max-w-[1425px] px-[72px] py-6 min-h-[calc(100vh-115px)]">
            <div className="grid grid-cols-[256px_1fr] gap-5 flex-1">
                <SideBar pathName={pathname}/>
                <div className="py-3">
                    <header className="text-2xl font-bold mb-4">
                        Terms of Use
                    </header>
                    <p className="text-muted-foreground">

                    </p>
                </div>
            </div>
        </div>
    )
}