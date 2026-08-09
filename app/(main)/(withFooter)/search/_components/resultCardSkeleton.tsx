import {Card} from "@/_components/shadcn/card";
import {Skeleton} from "@/_components/shadcn/skeleton";

export default function ResultCardSkeleton() {
    return (
        <Card className="flex flex-col gap-4 p-4 sm:flex-row">
            <Skeleton className="h-40 w-full shrink-0 rounded-lg sm:h-auto sm:w-48"/>
            <div className="flex flex-1 flex-col gap-3">
                <Skeleton className="h-6 w-1/3"/>
                <Skeleton className="h-4 w-1/2"/>
                <Skeleton className="h-4 w-2/5"/>
                <Skeleton className="h-10 w-full"/>
                <Skeleton className="h-10 w-full"/>
            </div>
        </Card>
    );
}
