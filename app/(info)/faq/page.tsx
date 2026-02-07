import SideBar from "@/(info)/_components/SideBar";

export default function Page(){
    return(
        <div className="flex mx-auto max-w-[1425px] px-[72px] py-6 min-h-[calc(100vh-115px)]">
            <div className="grid grid-cols-[256px_1fr] gap-5 flex-1">
                <SideBar/>
                <div className="py-3">
                    <header className="text-2xl font-bold mb-4">
                        FAQ
                    </header>
                    <p className="text-muted-foreground">
                    </p>
                </div>
            </div>
        </div>
    )
}
