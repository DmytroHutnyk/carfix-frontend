import {Skeleton} from "@/_components/shadcn/skeleton";

export default function WorkshopPageSkeleton() {
    return (
        <div className="mx-auto w-full max-w-[1475px] px-4 py-4 lg:px-6 lg:py-6">
            <Skeleton className="mb-3 h-4 w-48 lg:mb-4 lg:h-5 lg:w-64"/>
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-6">
                <div className="flex flex-col gap-4 lg:gap-6">
                    <Skeleton className="h-36 w-full rounded-xl lg:aspect-[16/9] lg:h-auto"/>
                    <Skeleton className="h-6 w-48 lg:h-9 lg:w-72"/>
                    <div className="grid gap-4 sm:grid-cols-2 lg:gap-6">
                        <Skeleton className="h-28 w-full lg:h-40"/>
                        <Skeleton className="h-28 w-full lg:h-40"/>
                    </div>
                    <Skeleton className="h-72 w-full lg:h-96"/>
                </div>
                <div className="flex flex-col gap-4 lg:gap-6">
                    <Skeleton className="h-44 w-full lg:h-56"/>
                    <Skeleton className="h-32 w-full lg:h-40"/>
                    <Skeleton className="h-28 w-full lg:h-32"/>
                    <Skeleton className="h-36 w-full lg:h-44"/>
                </div>
            </div>
        </div>
    );
}
