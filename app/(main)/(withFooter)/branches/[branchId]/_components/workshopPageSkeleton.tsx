import {Skeleton} from "@/_components/shadcn/skeleton";

export default function WorkshopPageSkeleton() {
    return (
        <div className="mx-auto w-full max-w-[1475px] px-4 py-4 lg:px-6 lg:py-6">
            <Skeleton className="mb-4 h-5 w-full max-w-64"/>
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
                <div className="flex flex-col gap-6">
                    <Skeleton className="aspect-[16/9] w-full rounded-xl"/>
                    <Skeleton className="h-9 w-full max-w-72"/>
                    <div className="grid gap-6 sm:grid-cols-2">
                        <Skeleton className="h-40 w-full"/>
                        <Skeleton className="h-40 w-full"/>
                    </div>
                    <Skeleton className="h-96 w-full"/>
                </div>
                <div className="flex flex-col gap-6">
                    <Skeleton className="h-56 w-full"/>
                    <Skeleton className="h-40 w-full"/>
                    <Skeleton className="h-32 w-full"/>
                    <Skeleton className="h-44 w-full"/>
                </div>
            </div>
        </div>
    );
}
