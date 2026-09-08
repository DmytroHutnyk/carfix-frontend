import {Skeleton} from "@/_components/shadcn/skeleton";

export default function NavigationSkeleton() {
    return (
        <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-20 rounded-md"/>

            <Skeleton className="h-9 w-28 rounded-md"/>

            <Skeleton className="h-9 w-28 rounded-md"/>
        </div>
    );
}
