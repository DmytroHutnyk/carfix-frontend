import SideBar from "@/(info)/_components/SideBar";
import {Separator} from "@/_components/shadcn/separator";

export default function Page(){
    return(
        <div className="flex mx-auto max-w-[1425px] px-[72px] py-6 min-h-[calc(100vh-115px)]">
            <div className="grid grid-cols-[256px_1fr] gap-5 flex-1">
                <SideBar/>
                <div className="py-3">
                    <section className="text-center space-y-3">
                        <h1 className="text-3xl font-bold tracking-tight">
                            FAQ
                        </h1>
                        <p className="text-muted-foreground">
                            To be implemented soon
                        </p>
                    </section>

                    <Separator className="my-6" />
                </div>
            </div>
        </div>
    )
}
