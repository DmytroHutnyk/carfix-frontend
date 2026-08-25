import {Card} from "@/_components/shadcn/card";
import {Skeleton} from "@/_components/shadcn/skeleton";

export default function ResultCardSkeleton() {
    return (
        <Card className="flex flex-col gap-2 p-3 lg:gap-4 lg:p-4">
            <div className="flex gap-3 lg:gap-4">
                <Skeleton className="h-18 w-18 shrink-0 rounded-md lg:aspect-[16/10] lg:h-auto lg:w-72 lg:rounded-lg"/>
                <div className="flex flex-1 flex-col gap-2 lg:gap-3">
                    <Skeleton className="h-4 w-1/2 lg:h-6 lg:w-1/3"/>
                    <Skeleton className="h-3 w-2/3 lg:h-4 lg:w-1/2"/>
                    <Skeleton className="h-3 w-2/5 lg:h-4"/>
                </div>
            </div>
            <Skeleton className="h-8 w-full lg:h-10"/>
            <Skeleton className="hidden w-full lg:block lg:h-10"/>
        </Card>
    );
}
